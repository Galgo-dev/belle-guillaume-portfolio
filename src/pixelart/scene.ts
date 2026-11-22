import {Season} from "../themes/themes";
import {Ctx, px, rect, withAlpha} from "./draw";
import {hexToRgb, pickRamp, pixelHash, RGB} from "./noise";
import {HEIGHT, renderLandscape, SILL, WIDTH} from "./landscape";

// Scène lo-fi : la vue de saison en grand, et devant, la pièce en silhouettes à contre-jour
// (Guillaume qui code, le bureau, le chat sur le rebord), éclairées par le ciel et par l'écran.

export const SCENE_WIDTH = WIDTH;
export const SCENE_HEIGHT = HEIGHT;

export interface SceneColors {
    accent: string;
    secondary: string;
    textMuted: string;
}

// Position de la tête de l'avatar (coin haut gauche).
const CX = 190;
const CY = 77;
const SCREEN = {x: 259, y: 103, w: 39, h: 24};

// Matières de l'avatar : sombres à contre-jour, révélées par la lumière de l'écran sur le côté visage.
const SILHOUETTE = 1;
const LED = 10;
const MATERIAL_CODES: Record<string, number> = {H: 2, S: 3, B: 4, K: 5, P: 6, D: 7, E: 8, M: 9, k: LED, '#': SILHOUETTE};
const MATERIALS: Record<number, { dark: string; lit: string }> = {
    2: {dark: '#2e1a10', lit: '#7a4a2a'}, // cheveux bruns bouclés
    3: {dark: '#2a1813', lit: '#e3a98c'}, // peau
    4: {dark: '#1f120b', lit: '#8a5530'}, // barbe
    5: {dark: '#34343f', lit: '#6a6a7a'}, // casque
    6: {dark: '#1c1030', lit: '#7449c2'}, // sweat violet
    7: {dark: '#2a2440', lit: '#e8e0f0'}, // cordon de capuche
    8: {dark: '#2a1813', lit: '#1a0d08'}, // œil
    9: {dark: '#2a1813', lit: '#7a3a2a'}, // bouche
};

// Profil tourné vers l'écran, 28×29 : boucles en bordure, casque (arceau + écouteur), nez, barbe fournie.
const HEAD = [
    '...........H..HH..H.........',
    '........H.HHHHHHHHHH.H......',
    '......HHHHHKKKKKKKHHHHH.....',
    '.....HHHHKKHHHHHHHKKHHHH....',
    '....HHHHKHHHHHHHHHHHKHHHH...',
    '...HHHHHKHHHHHHHHHHHHKHHHH..',
    '..HHHHHKHHHHHHHHHHHHHHHHHH..',
    '..HHHHHKHHHHHHHHHHHHHHHHHHH.',
    '.HHHHHHKHHHHHHHHHHHHHHHSSS..',
    'HHHHHHHKHHHHHHHHHHHHHSSSSS..',
    '.HHHHHKKKHHHHHHHHHHSSSSSSS..',
    'HHHHHKKKKKHHHHHHHSSSSSSSSSS.',
    '.HHHKKKKKKKHHHHSSSSSSSESSSS.',
    'HHHHKKKkKKKHHHSSSSSSSSSSSSSS',
    '.HHHKKKKKKKHHSSSSSSSSSSSSSSS',
    'HHHHKKKKKKKHSSSSSSSSSSSSSSS.',
    '.HHHHKKKKKHBSSSSSSSSSSSSSS..',
    '..HHHHKKKHBBSSSSSSSSSSSSSSS.',
    '...HHHHHHBBBBSSSSSSSSMMSSS..',
    '...HHHHHBBBBBBBSSSSBBBBBBB..',
    '....HHHBBBBBBBBBBBBBBBBBBB..',
    '....HHBBBBBBBBBBBBBBBBBBBB..',
    '.....BBBBBBBBBBBBBBBBBBBB...',
    '......BBBBBBBBBBBBBBBBBBB...',
    '.......BBBBBBBBBBBBBBBBB....',
    '........BBBBBBBBBBBBBB......',
    '..........BBBBBBBBBB........',
    '...........SSSSSSS..........',
    '...........SSSSSS...........',
];

const CAT = [
    '.#.....#.',
    '.##...##.',
    '.#######.',
    '#########',
    '#########',
    '.#######.',
    '..#####..',
    '.#######.',
    '#########',
    '##########',
    '##########',
    '###########',
    '###########',
    '###########',
    '###########',
    '.#########.',
];

type Mask = Uint8Array;

const inBounds = (x: number, y: number) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;

// Chaque pixel du masque porte une matière (0 = vide, 1 = silhouette simple, 2+ = matières de l'avatar).
const fill = (mask: Mask, x: number, y: number, material = SILHOUETTE) => {
    x = Math.round(x);
    y = Math.round(y);
    if (inBounds(x, y)) mask[y * WIDTH + x] = material;
};

const fillRect = (mask: Mask, x: number, y: number, w: number, h: number, material = SILHOUETTE) => {
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) fill(mask, x + dx, y + dy, material);
};

const fillEllipse = (mask: Mask, cx: number, cy: number, rx: number, ry: number, material = SILHOUETTE) => {
    for (let dy = -ry; dy <= ry; dy++) {
        const half = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))));
        fillRect(mask, cx - half, cy + dy, half * 2 + 1, 1, material);
    }
};

const fillLine = (mask: Mask, x0: number, y0: number, x1: number, y1: number, size: number, material = SILHOUETTE) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        fillRect(mask, x0 + (x1 - x0) * t - size / 2, y0 + (y1 - y0) * t - size / 2, size, size, material);
    }
};

const fillGrid = (mask: Mask, rows: string[], x: number, y: number) =>
    rows.forEach((row, dy) => [...row].forEach((char, dx) => {
        if (char !== '.') fill(mask, x + dx, y + dy, MATERIAL_CODES[char] ?? SILHOUETTE);
    }));

const HAIR = MATERIAL_CODES.H;
const HOODIE = MATERIAL_CODES.P;
const SKIN = MATERIAL_CODES.S;

const drawCharacter = (mask: Mask) => {
    // Dossier de chaise derrière le dos.
    fillRect(mask, CX - 8, CY + 27, 6, 34);
    fillRect(mask, CX - 9, CY + 25, 8, 3);
    // Buste voûté vers l'écran, capuche dans le dos, cordon qui pend.
    for (let row = 28; row <= 62; row++) {
        const left = row < 33 ? 9 - (row - 28) : row < 56 ? 2 : 3;
        const right = row < 30 ? 18 : row < 35 ? 23 : 25;
        fillRect(mask, CX + left, CY + row, right - left, 1, HOODIE);
    }
    fillEllipse(mask, CX + 7, CY + 30, 7, 4, HOODIE);
    fillRect(mask, CX + 22, CY + 33, 1, 10, MATERIAL_CODES.D);
    fillGrid(mask, HEAD, CX, CY);
    // Quelques boucles qui dépassent à l'arrière de la tête.
    [[-1, 4], [-1, 12], [0, 18], [2, 21]].forEach(([dx, dy]) => fill(mask, CX + dx, CY + dy, HAIR));
};

const drawArm = (mask: Mask, frame: number) => {
    fillLine(mask, CX + 15, CY + 33, CX + 21, CY + 49, 7, HOODIE);
    fillLine(mask, CX + 21, CY + 49, CX + 40, CY + 56 - frame, 5, HOODIE);
    fillRect(mask, CX + 41, CY + 54 - frame, 5, 4, SKIN);
};

const drawRoom = (mask: Mask, season: Season) => {
    // Rebord de fenêtre, puis bureau plein (sa façade masque les jambes et la chaise).
    fillRect(mask, 0, SILL - 3, WIDTH, 4);
    fillRect(mask, 150, SILL - 3, WIDTH - 150, HEIGHT - SILL + 3);
    // Lampe de bureau articulée.
    fillRect(mask, 158, 134, 12, 3);
    fillLine(mask, 163, 134, 158, 117, 2);
    fillLine(mask, 158, 117, 170, 108, 2);
    fillEllipse(mask, 175, 110, 7, 3);
    // Écran (de face, tourné vers Guillaume), clavier, mug.
    fillRect(mask, SCREEN.x - 3, SCREEN.y - 3, SCREEN.w + 6, SCREEN.h + 6);
    fillRect(mask, 275, SCREEN.y + SCREEN.h + 3, 6, 8);
    fillRect(mask, 268, SILL - 4, 20, 2);
    fillRect(mask, 228, SILL - 5, 26, 2);
    fillRect(mask, 304, 128, 8, 9);
    fillRect(mask, 312, 130, 2, 1);
    fillRect(mask, 313, 130, 1, 4);
    fillRect(mask, 312, 133, 2, 1);
    // Chat assis sur le rebord, de dos, qui regarde dehors.
    fillGrid(mask, CAT, 50, SILL - 3 - CAT.length);

    // Objets de saison sur le rebord.
    if (season === 'summer') {
        fillRect(mask, 96, 126, 12, 11);
        fillRect(mask, 95, 125, 14, 2);
        [[94, 112, 7, 4], [108, 108, 6, 5], [100, 101, 4, 7], [113, 118, 6, 3], [89, 120, 5, 3]].forEach(([cx, cy, rx, ry]) => fillEllipse(mask, cx, cy, rx, ry));
        [[101, 125, 94, 113], [102, 125, 108, 109], [102, 125, 100, 102], [103, 125, 112, 118]].forEach(([x0, y0, x1, y1]) => fillLine(mask, x0, y0, x1, y1, 1));
    } else if (season === 'spring') {
        fillEllipse(mask, 102, 131, 5, 6);
        fillRect(mask, 100, 123, 5, 3);
        [[102, 123, 92, 104], [102, 123, 108, 100], [102, 123, 116, 112], [92, 104, 86, 98], [108, 100, 112, 94]].forEach(([x0, y0, x1, y1]) => fillLine(mask, x0, y0, x1, y1, 1));
    } else if (season === 'autumn') {
        fillEllipse(mask, 100, 132, 9, 5);
        fillRect(mask, 99, 125, 2, 3);
        fillRect(mask, 118, 126, 5, 11);
    } else {
        fillRect(mask, 96, 122, 14, 15);
        fillRect(mask, 94, 120, 18, 2);
        fillRect(mask, 101, 116, 4, 4);
        // Fil de la guirlande en haut de la fenêtre.
        for (let x = 0; x < WIDTH; x++) fill(mask, x, 4 + Math.round(5 * Math.sin((Math.PI * (x % 80)) / 80)));
    }
};

interface PixelList {
    x: number;
    y: number;
    color: string;
}

interface StaticScene {
    frames: HTMLCanvasElement[];
    mask: Mask;
    arms: PixelList[][];
    rim: string;
    silhouette: string;
}

const toCss = (c: RGB) => `rgb(${c[0]},${c[1]},${c[2]})`;

const mixRgb = (a: RGB, b: RGB, t: number): RGB => [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
];

// Intensité de la lumière de l'écran selon la distance (en px) au bord du profil tourné vers lui.
const SCREEN_LIGHT = [0, 1, 0.7, 0.45, 0.25];

/** Couleur d'un pixel de silhouette : liseré de contre-jour côté ciel, lumière de l'écran côté visage. */
const shade = (mask: Mask, x: number, y: number, rim: RGB, accent: RGB, silhouette: RGB): RGB => {
    const open = (nx: number, ny: number) => inBounds(nx, ny) && !mask[ny * WIDTH + nx] && ny < SILL - 3;
    const material = mask[y * WIDTH + x];
    if (material === LED) return accent;

    if (material > SILHOUETTE) {
        const {dark, lit} = MATERIALS[material];
        // Distance au bord droit du profil : plus on est près, plus l'écran éclaire (tramé pour un dégradé pixel art).
        // Le visage (peau, barbe, œil, bouche) fait face à l'écran : il est éclairé presque entièrement.
        const isFace = material === SKIN || material === MATERIAL_CODES.B || material === MATERIAL_CODES.E || material === MATERIAL_CODES.M;
        const reach = isFace ? 22 : SCREEN_LIGHT.length;
        let distance = 0;
        for (let k = 1; k < reach; k++) {
            if (inBounds(x + k, y) && mask[y * WIDTH + x + k]) continue;
            if (open(x + k, y) && x + k < SCREEN.x - 3) distance = k;
            break;
        }
        const strength = !distance ? 0 : isFace ? Math.min(1, Math.max(0.3, 1.2 - distance * 0.04)) : SCREEN_LIGHT[distance];
        const litColor = mixRgb(hexToRgb(lit), accent, 0.22);
        const darkColor = mixRgb(silhouette, hexToRgb(dark), 0.75);
        const dithered = strength >= 0.7 || (strength >= 0.45 && (x + y) % 2 === 0) || (strength > 0 && x % 2 === 0 && y % 2 === 0);
        if (dithered) return strength >= 0.7 ? litColor : mixRgb(litColor, darkColor, 0.35);
        if (open(x, y - 1)) return rim;
        if (open(x - 1, y) && (x + y) % 2 === 0) return rim;
        // Reflets épars dans les cheveux pour suggérer les boucles.
        if (material === HAIR && pixelHash(x, y, 21) > 0.78) return mixRgb(darkColor, hexToRgb(lit), 0.35);
        return darkColor;
    }

    // Contre-jour : liseré plein sur les bords exposés vers le haut, tramé sur les côtés (évite l'effet « contour »).
    if (open(x, y - 1)) return rim;
    if ((open(x - 1, y) || open(x + 1, y)) && (x + y) % 2 === 0) return rim;
    return silhouette;
};

const cache = new Map<string, StaticScene>();

const buildStaticScene = (season: Season, colors: SceneColors): StaticScene => {
    const landscape = renderLandscape(season);
    const {config} = landscape;
    const rim = hexToRgb(config.rim);
    const accent = hexToRgb(colors.accent);
    const silhouette = hexToRgb(config.silhouette);
    const interior = config.interior.map(hexToRgb);

    const mask: Mask = new Uint8Array(WIDTH * HEIGHT);
    drawRoom(mask, season);
    drawCharacter(mask);

    const frames = landscape.frames.map(image => {
        const data = image.data;
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                const i = y * WIDTH + x;
                let color: RGB | null = null;
                if (mask[i]) {
                    color = shade(mask, x, y, rim, accent, silhouette);
                } else if (y >= SILL - 3) {
                    // Mur sous la fenêtre : sombre, à peine éclairé par la lampe et le reflet du ciel sous le rebord.
                    const d2 = (x - 165) ** 2 + ((y - SILL) * 2) ** 2;
                    const value = 0.06 + 0.22 * Math.exp(-d2 / (2 * 60 * 60)) + 0.12 * Math.max(0, 1 - (y - SILL) / 8);
                    color = pickRamp(interior.slice(0, 4), value, x, y);
                }
                if (color) {
                    data[i * 4] = color[0];
                    data[i * 4 + 1] = color[1];
                    data[i * 4 + 2] = color[2];
                }
            }
        }
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.putImageData(image, 0, 0);
            // Ampoule de la lampe.
            rect(ctx, 170, 112, 11, 1, '#fff1c0');
        }
        return canvas;
    });

    // Bras qui tape : deux positions, avec le même éclairage que le reste de la silhouette.
    const arms = [0, 1].map(frame => {
        const armMask: Mask = new Uint8Array(WIDTH * HEIGHT);
        drawArm(armMask, frame);
        const combined = mask.map((value, i) => armMask[i] || value);
        const pixels: PixelList[] = [];
        armMask.forEach((value, i) => {
            if (!value) return;
            const x = i % WIDTH;
            const y = Math.floor(i / WIDTH);
            pixels.push({x, y, color: toCss(shade(combined, x, y, rim, accent, silhouette))});
        });
        return pixels;
    });

    return {frames, mask, arms, rim: config.rim, silhouette: config.silhouette};
};

const getStaticScene = (season: Season, colors: SceneColors) => {
    const key = `${season}|${colors.accent}`;
    if (!cache.has(key)) cache.set(key, buildStaticScene(season, colors));
    return cache.get(key) as StaticScene;
};

// ---------- Éléments animés ----------

const codeLines = Array.from({length: 40}, (_, i) => ({
    indent: Math.floor(pixelHash(i, 1) * 4) * 3,
    length: 5 + Math.floor(pixelHash(i, 2) * 26),
    tone: Math.floor(pixelHash(i, 3) * 3),
}));

const LIGHT_COLORS = ['#ff5a5a', '#ffd166', '#7ee081', '#8fd3ff'];

const drawParticles = (ctx: Ctx, season: Season, t: number, mask: Mask) => {
    const visible = (x: number, y: number) => inBounds(x, y) && y < SILL - 3 && !mask[y * WIDTH + x];
    const wrap = (v: number, size: number) => ((v % size) + size) % size;
    const count = season === 'summer' ? 22 : 34;
    for (let i = 0; i < count; i++) {
        const seedX = pixelHash(i, 11) * WIDTH;
        const seedY = pixelHash(i, 12) * SILL;
        const speed = 0.6 + pixelHash(i, 13) * 0.8;
        let x: number;
        let y: number;
        let color: string;
        let size = 1;
        if (season === 'winter') {
            y = wrap(seedY + t * 9 * speed, SILL);
            x = wrap(seedX + Math.sin(t * 0.7 + i) * 4, WIDTH);
            color = speed > 1.2 ? '#ffffff' : '#c8daf0';
            size = speed > 1.25 ? 2 : 1;
        } else if (season === 'spring') {
            y = wrap(seedY + t * 6 * speed, SILL);
            x = wrap(seedX + t * 8 * speed + Math.sin(t + i) * 3, WIDTH);
            color = i % 3 ? '#ffc2dc' : '#fff0f4';
            size = 2;
        } else if (season === 'autumn') {
            y = wrap(seedY + t * 8 * speed, SILL);
            x = wrap(seedX + Math.sin(t * 1.3 + i) * 6, WIDTH);
            color = ['#e8792b', '#c44536', '#f4c95d'][i % 3];
            size = 2;
        } else {
            // Lucioles qui flottent au-dessus de l'eau et dans les arbres.
            y = 70 + pixelHash(i, 14) * 66 + Math.sin(t * 0.8 + i) * 4;
            x = wrap(seedX + Math.sin(t * 0.5 + i * 2) * 8, WIDTH);
            const blink = Math.sin(t * 2 + i * 1.7);
            if (blink < 0.2) continue;
            color = blink > 0.8 ? '#fff09a' : '#ffd35a';
        }
        const rx = Math.round(x);
        const ry = Math.round(y);
        if (!visible(rx, ry)) continue;
        if (size === 2 && season === 'spring') rect(ctx, rx, ry, 2, 1, color);
        else rect(ctx, rx, ry, size, size, color);
    }
};

const drawSeasonAnimations = (ctx: Ctx, season: Season, t: number) => {
    if (season === 'winter') {
        for (let x = 5; x < WIDTH; x += 10) {
            const y = 5 + Math.round(5 * Math.sin((Math.PI * (x % 80)) / 80));
            const index = Math.floor(x / 10);
            const on = Math.sin(t * 3 + index * 1.7) > -0.3;
            const color = LIGHT_COLORS[index % LIGHT_COLORS.length];
            rect(ctx, x - 1, y + 1, 2, 2, on ? color : '#2a2a34');
            if (on) withAlpha(ctx, 0.25, () => rect(ctx, x - 2, y, 4, 4, color));
        }
        // Bougie dans la lanterne.
        const flicker = Math.floor(t * 8) % 3;
        rect(ctx, 101, 127, 4, 7, '#f3e6c8');
        rect(ctx, 102, 124 + (flicker ? 0 : 1), 2, 3, '#ffb347');
        withAlpha(ctx, 0.18, () => rect(ctx, 97, 121, 12, 14, '#ffcf70'));
    } else if (season === 'autumn') {
        const flicker = Math.floor(t * 8) % 3;
        rect(ctx, 119, 127, 3, 9, '#f3e6c8');
        rect(ctx, 119 + (flicker === 2 ? 1 : 0), 123 + (flicker ? 0 : 1), 2, 3, '#ffb347');
        px(ctx, 120, 124, '#fff1a8');
        withAlpha(ctx, 0.15, () => rect(ctx, 113, 118, 15, 18, '#ffb347'));
    } else if (season === 'spring') {
        [[92, 104], [108, 100], [116, 112], [86, 98], [112, 94], [97, 102], [111, 106], [89, 101]].forEach(([bx, by], i) => {
            rect(ctx, bx - 1, by - 1, 3, 3, i % 2 ? '#ffb7d5' : '#ff9ecd');
            px(ctx, bx, by - 1, '#fff0f4');
        });
    }
};

export const drawScene = (ctx: Ctx, season: Season, t: number, colors: SceneColors) => {
    const scene = getStaticScene(season, colors);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(scene.frames[Math.floor(t * 3) % scene.frames.length], 0, 0);

    drawParticles(ctx, season, t, scene.mask);

    // Écran : code qui défile + curseur.
    rect(ctx, SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, '#0b0d14');
    const tones = [colors.accent, colors.secondary, colors.textMuted];
    const scroll = Math.floor(t * 2);
    for (let row = 0; row < 7; row++) {
        const code = codeLines[(scroll + row) % codeLines.length];
        rect(ctx, SCREEN.x + 2 + code.indent, SCREEN.y + 2 + row * 3, Math.min(code.length, SCREEN.w - 4 - code.indent), 1, tones[code.tone]);
    }
    if (scroll % 2 === 0) rect(ctx, SCREEN.x + 2, SCREEN.y + 2 + 7 * 3 - 1, 2, 3, colors.accent);
    withAlpha(ctx, 0.08, () => rect(ctx, SCREEN.x - 14, SCREEN.y - 10, SCREEN.w + 16, SCREEN.h + 20, colors.accent));

    scene.arms[Math.floor(t * 7) % 2].forEach(p => px(ctx, p.x, p.y, p.color));

    // Queue du chat qui bat doucement sur le rebord.
    const tail = Math.round(Math.sin(t * 1.2) * 2);
    rect(ctx, 60, SILL - 5, 5, 2, scene.silhouette);
    rect(ctx, 64, SILL - 6 + tail, 2, 3, scene.silhouette);
    withAlpha(ctx, 0.9, () => px(ctx, 65, SILL - 7 + tail, scene.rim));

    // Vapeur du mug.
    withAlpha(ctx, 0.55, () => {
        for (let i = 0; i < 4; i++) {
            const rise = (t * 6 + i * 3.5) % 14;
            px(ctx, 307 + Math.round(Math.sin(t * 2.5 + i) * 1.5), 126 - rise, '#ffffff');
        }
    });

    drawSeasonAnimations(ctx, season, t);
};
