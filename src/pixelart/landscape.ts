import {Season} from "../themes/themes";
import {clamp01, hexToRgb, makeNoise, Noise, pickRamp, pixelHash, RGB, smoothstep} from "./noise";

// Paysages de saison générés pixel par pixel : ciel tramé, nuages éclairés, collines, eau ou sol, arbres de premier plan.

export const WIDTH = 320;
export const HEIGHT = 180;
/** Bord de la fenêtre / du bureau : en dessous, c'est l'intérieur de la pièce. */
export const SILL = 140;

type Ground = 'water' | 'meadow' | 'snow';
type Foliage = 'silhouette' | 'blossom' | 'autumn' | 'pines';

export interface LandscapeConfig {
    seed: number;
    sky: string[];
    skyCurve: number;
    sun: { x: number; y: number; r: number; glow: number; kind: 'sun' | 'moon' };
    clouds: { amount: number; threshold: number; sx: number; sy: number };
    horizon: number;
    farHills: string[];
    nearHills: string[];
    hillRim: string;
    ground: Ground;
    groundRamp: string[];
    foliage: Foliage;
    foliageRamp: string[];
    foliageLit: string[];
    stars?: boolean;
    cabin?: boolean;
    /** Lumière de contre-jour sur les silhouettes de la pièce. */
    rim: string;
    silhouette: string;
    interior: string[];
}

export const landscapes: Record<Season, LandscapeConfig> = {
    summer: {
        seed: 11,
        sky: ['#140a1f', '#24113a', '#3b1a52', '#55225f', '#72296a', '#9a2f62', '#c73e4c', '#e85a2f', '#f7822a', '#ffad3a', '#ffd35a', '#fff09a'],
        skyCurve: 1.6,
        sun: {x: 150, y: 92, r: 9, glow: 48, kind: 'sun'},
        clouds: {amount: 0.95, threshold: 0.46, sx: 34, sy: 6},
        horizon: 96,
        farHills: ['#2a1238', '#3d1a45', '#5a2448'],
        nearHills: ['#0e0814', '#180c1f', '#24102a'],
        hillRim: '#ff7a2a',
        ground: 'water',
        groundRamp: ['#0c0716', '#1a0e2a'],
        foliage: 'silhouette',
        foliageRamp: ['#07040b', '#0e0814', '#160b1d'],
        foliageLit: ['#ff5a2a', '#ff8a2a', '#c7303a', '#ffb43a'],
        rim: '#ff9a3a',
        silhouette: '#0b0610',
        interior: ['#0b0610', '#140a1a', '#1f0f24', '#2c1428'],
    },
    spring: {
        seed: 23,
        sky: ['#2a2350', '#3a3168', '#4d4482', '#655a9c', '#8273b4', '#a38cc6', '#c4a3d2', '#e0b6d6', '#f3c6d4', '#ffd8d4', '#ffe9d8', '#fff6e6'],
        skyCurve: 1.2,
        sun: {x: 214, y: 84, r: 7, glow: 60, kind: 'sun'},
        clouds: {amount: 0.8, threshold: 0.5, sx: 40, sy: 8},
        horizon: 100,
        farHills: ['#6a6aa8', '#7f80b8', '#9a96c6'],
        nearHills: ['#3f6a5a', '#4f7f62', '#62946c'],
        hillRim: '#fff0d8',
        ground: 'meadow',
        groundRamp: ['#1f3a2e', '#2a4d38', '#386243', '#4a7a4c', '#5f9256', '#7aab60'],
        foliage: 'blossom',
        foliageRamp: ['#4a1f3e', '#7a2f5a', '#a8447a', '#d26a9c', '#ee94b8', '#ffbcd2', '#ffe0ea'],
        foliageLit: ['#fff0f4', '#ffe0ea'],
        rim: '#ffd6e0',
        silhouette: '#1a1428',
        interior: ['#1a1428', '#241c36', '#302545', '#3d2f52'],
    },
    autumn: {
        seed: 37,
        sky: ['#1a0f14', '#2b151a', '#43201f', '#5e2c22', '#7c3a25', '#9c4a26', '#bd5e2a', '#d97830', '#ec963c', '#f6b552', '#fbd27a', '#fde8a8'],
        skyCurve: 1.4,
        sun: {x: 120, y: 90, r: 8, glow: 55, kind: 'sun'},
        clouds: {amount: 0.9, threshold: 0.44, sx: 30, sy: 7},
        horizon: 98,
        farHills: ['#5a2a1e', '#7a3a22', '#9a4e26'],
        nearHills: ['#2a120c', '#3e1a10', '#561f12'],
        hillRim: '#ffb04a',
        ground: 'water',
        groundRamp: ['#120806', '#1f0e0a'],
        foliage: 'autumn',
        foliageRamp: ['#2a0e08', '#4a160c', '#7a2410', '#a83814', '#d25418', '#ec7a22', '#f8a83a', '#fdd060'],
        foliageLit: ['#fde8a8', '#fbd27a'],
        rim: '#f6a24a',
        silhouette: '#140a08',
        interior: ['#140a08', '#1f100c', '#2c1810', '#3a2014'],
    },
    winter: {
        seed: 53,
        sky: ['#03050d', '#070c1d', '#0c1430', '#121d42', '#1a2856', '#22356a', '#2d457e', '#3b5892', '#5072a8', '#6e90c0', '#9cb6d8', '#d4e2f2'],
        skyCurve: 1.3,
        sun: {x: 232, y: 30, r: 6, glow: 34, kind: 'moon'},
        clouds: {amount: 0.55, threshold: 0.56, sx: 44, sy: 9},
        horizon: 104,
        farHills: ['#2a3a5e', '#3a4c72', '#4f6488'],
        nearHills: ['#101a30', '#16233e', '#1e2e4e'],
        hillRim: '#c8daf0',
        ground: 'snow',
        groundRamp: ['#2a3a5c', '#3e5276', '#566e94', '#7590b4', '#9cb4d2', '#c8d8ec', '#e8f0fa'],
        foliage: 'pines',
        foliageRamp: ['#050a12', '#0a1420', '#10202c'],
        foliageLit: ['#e8f0fa', '#c8d8ec', '#9cb4d2'],
        stars: true,
        cabin: true,
        rim: '#9cb6d8',
        silhouette: '#050812',
        interior: ['#050812', '#0a1020', '#111a30', '#1a2440'],
    },
};

export interface Landscape {
    /** Une image par étape d'animation de l'eau (une seule pour les paysages sans eau). */
    frames: ImageData[];
    config: LandscapeConfig;
}

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const skyValue = (config: LandscapeConfig, n: Noise, x: number, y: number) => {
    const {sun, clouds, horizon} = config;
    let value = 0.06 + 0.62 * Math.pow(clamp01(y / horizon), config.skyCurve);
    const dx = x - sun.x;
    const dy = (y - sun.y) * 1.7;
    const glow = Math.exp(-(dx * dx + dy * dy) / (2 * sun.glow * sun.glow));
    value += glow * (sun.kind === 'sun' ? 0.5 : 0.22);

    const density = n.fbm(x / clouds.sx, y / clouds.sy);
    const mask = smoothstep(clouds.threshold, clouds.threshold + 0.14, density) * clouds.amount;
    if (mask > 0) {
        // Bord inférieur des nuages éclairé par le soleil couchant (ou la lune).
        const below = n.fbm(x / clouds.sx, (y + 2) / clouds.sy);
        const lit = clamp01((density - below) * 9);
        const cloud = value * 0.5 + lit * (sun.kind === 'sun' ? 0.3 + glow * 0.7 : 0.15 + glow * 0.4);
        value = value * (1 - mask) + cloud * mask;
    }
    return value;
};

export const renderLandscape = (season: Season): Landscape => {
    const config = landscapes[season];
    const n = makeNoise(config.seed);
    const sky = config.sky.map(hexToRgb);
    const far = config.farHills.map(hexToRgb);
    const near = config.nearHills.map(hexToRgb);
    const ground = config.groundRamp.map(hexToRgb);
    const foliageRamp = config.foliageRamp.map(hexToRgb);
    const foliageLit = config.foliageLit.map(hexToRgb);
    const hillRim = hexToRgb(config.hillRim);
    const {horizon, sun} = config;

    const base = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
    const set = (buffer: Uint8ClampedArray, x: number, y: number, c: RGB) => {
        const i = (y * WIDTH + x) * 4;
        buffer[i] = c[0];
        buffer[i + 1] = c[1];
        buffer[i + 2] = c[2];
        buffer[i + 3] = 255;
    };
    const get = (buffer: Uint8ClampedArray, x: number, y: number): RGB => {
        const i = (Math.max(0, Math.min(HEIGHT - 1, y)) * WIDTH + Math.max(0, Math.min(WIDTH - 1, x))) * 4;
        return [buffer[i], buffer[i + 1], buffer[i + 2]];
    };

    const farTop = (x: number) => horizon - 6 - 20 * n.fbm(x / 70 + 3, 1.7, 3);
    const nearTop = (x: number) => horizon - 1 - 9 * n.fbm(x / 28 + 11, 4.2, 3) - 4 * n.noise(x / 3.2, 9.5);
    const atmosphere = (x: number) => Math.exp(-((x - sun.x) ** 2) / (2 * (sun.glow * 1.6) ** 2));

    // 1. Ciel, astre et collines.
    for (let y = 0; y < horizon; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let color: RGB;
            const nearY = nearTop(x);
            const farY = farTop(x);
            if (y >= nearY) {
                const value = 0.15 + 0.5 * atmosphere(x) - 0.25 * ((y - nearY) / 10);
                const rimLit = y - nearY < 1 && sun.kind === 'sun' && atmosphere(x) > 0.45 && (x + y) % 2 === 0;
                color = rimLit ? hillRim : pickRamp(near, value, x, y);
            } else if (y >= farY) {
                const value = 0.3 + 0.55 * atmosphere(x) - 0.3 * ((y - farY) / 20);
                color = pickRamp(far, value, x, y);
            } else {
                const dx = x - sun.x;
                const dy = y - sun.y;
                const inDisc = dx * dx + dy * dy <= sun.r * sun.r;
                if (inDisc) {
                    // Soleil tranché de bandes sombres, comme dans les couchers de soleil en pixel art.
                    const sliced = sun.kind === 'sun' && dy > 0 && dy % 3 === 0;
                    color = sky[sky.length - (sliced ? 3 : 1)];
                } else {
                    color = pickRamp(sky, skyValue(config, n, x, y), x, y);
                    if (config.stars && y < horizon * 0.7 && pixelHash(x, y, 1) > 0.993) color = sky[sky.length - 1];
                }
            }
            set(base, x, y, color);
        }
    }

    // Cabane lointaine avec une fenêtre éclairée (hiver).
    if (config.cabin) {
        const cx = 84;
        const cy = Math.round(farTop(cx)) + 3;
        for (let dy = 0; dy < 5; dy++) for (let dx = -3; dx <= 3; dx++) set(base, cx + dx, cy + dy, near[0]);
        for (let dy = 0; dy < 3; dy++) for (let dx = -dy - 1; dx <= dy + 1; dx++) set(base, cx + dx, cy - 3 + dy, dy === 0 ? hillRim : near[1]);
        set(base, cx + 1, cy + 2, hexToRgb('#ffcf70'));
        set(base, cx + 2, cy + 2, hexToRgb('#ffcf70'));
    }

    // 2. Sol : eau qui reflète le ciel (4 étapes d'animation), prairie ou neige.
    const frameCount = config.ground === 'water' ? 4 : 1;
    const frames = Array.from({length: frameCount}, (_, frame) => {
        const buffer = new Uint8ClampedArray(base);
        for (let y = horizon; y < HEIGHT; y++) {
            const depth = y - horizon;
            for (let x = 0; x < WIDTH; x++) {
                let color: RGB;
                if (config.ground === 'water') {
                    const ripple = (n.noise(depth * 0.45, frame * 1.7 + 3) - 0.5) * (2 + depth * 0.15);
                    const reflected = get(base, Math.round(x + ripple), Math.round(horizon - 1 - depth * 1.4));
                    color = mix(reflected, ground[0], Math.min(0.75, 0.32 + depth * 0.012));
                    if (y % 3 === 0) color = mix(color, ground[0], 0.25);
                    const streak = n.noise(x / 9 + frame * 0.6, y * 1.3);
                    const nearSun = Math.abs(x - sun.x) < sun.r * 1.3 + depth * 0.5;
                    if (nearSun && streak > 0.62 && pixelHash(x, y, frame) > 0.35) color = sky[sky.length - 2];
                    else if (streak > 0.78) color = mix(color, sky[Math.floor(sky.length * 0.6)], 0.35);
                } else if (config.ground === 'meadow') {
                    const value = 0.78 - 0.55 * (depth / (HEIGHT - horizon)) + (n.fbm(x / 14, y / 4) - 0.5) * 0.55;
                    color = pickRamp(ground, value, x, y);
                    const flower = pixelHash(x, y, 7);
                    if (flower > 0.975) color = hexToRgb(['#ffd0e0', '#fff4e0', '#ffe680', '#ff9ecd'][Math.floor(flower * 1000) % 4]);
                } else {
                    const value = 0.72 - 0.4 * (depth / (HEIGHT - horizon)) + (n.fbm(x / 26, y / 6) - 0.5) * 0.45;
                    color = pickRamp(ground, value, x, y);
                    if (pixelHash(x, y, 3) > 0.994) color = ground[ground.length - 1];
                }
                set(buffer, x, y, color);
            }
        }
        return buffer;
    });

    // 3. Arbres de premier plan qui encadrent la vue.
    const foliageAt = (x: number, y: number): number => {
        if (config.foliage === 'pines') {
            let best = -1;
            [[14, 18, 132], [46, 52, 110], [296, 8, 136], [266, 46, 96]].forEach(([px, top, base]) => {
                if (y < top || y > base) return;
                const progress = (y - top) / (base - top);
                const tier = ((y - top) % 12) / 12;
                const half = 3 + progress * 26 * (0.55 + tier * 0.45) + (n.noise(x / 2, y / 2) - 0.5) * 3;
                best = Math.max(best, (half - Math.abs(x - px)) / 6);
            });
            return best;
        }
        const leftReach = 72 + 16 * Math.sin(y / 23) - y * 0.18;
        const rightReach = 252 - 10 * Math.sin(y / 19) + y * 0.22;
        const bias = Math.max(y < 122 ? (leftReach - x) / 28 : -9, y < 108 ? (x - rightReach) / 28 : -9);
        return bias + (n.fbm(x / 9, y / 9) - 0.5) * 1.5;
    };

    const isTrunk = (x: number, y: number) => {
        if (config.foliage === 'pines') return false;
        const trunkLeft = 20 + (n.noise(y / 14, 2) - 0.5) * 6;
        const trunkRight = 302 + (n.noise(y / 14, 5) - 0.5) * 6;
        return (y > 40 && Math.abs(x - trunkLeft) < 3 + (y - 40) * 0.03)
            || (y > 30 && Math.abs(x - trunkRight) < 3.5 + (y - 30) * 0.03);
    };

    for (let y = 0; y < SILL; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const m = foliageAt(x, y);
            if (m <= 0) {
                if (isTrunk(x, y)) {
                    const trunk = pickRamp(foliageRamp.slice(0, 2), n.noise(x / 2, y / 6), x, y);
                    frames.forEach(buffer => set(buffer, x, y, trunk));
                }
                continue;
            }
            const edge = m < 0.14;
            const litFromAbove = foliageAt(x, y - 1) <= 0;
            let color: RGB;
            if (config.foliage === 'pines') {
                color = litFromAbove || (edge && pixelHash(x, y, 9) > 0.55) ? foliageLit[(x + y) % foliageLit.length] : pickRamp(foliageRamp, n.fbm(x / 5, y / 5), x, y);
            } else if (config.foliage === 'silhouette') {
                // Éclats de lumière clairsemés : plus nombreux sur le bord tourné vers le soleil, quelques-uns dans le feuillage.
                const towardSun = (x < sun.x && foliageAt(x + 2, y) <= 0) || (x > sun.x && foliageAt(x - 2, y) <= 0);
                const speck = pixelHash(x, y, 4);
                const lit = (edge && towardSun && speck > 0.6) || (edge && speck > 0.88) || (m < 0.45 && speck > 0.975);
                color = lit
                    ? foliageLit[Math.floor(pixelHash(x, y, 5) * foliageLit.length)]
                    : pickRamp(foliageRamp, n.fbm(x / 6, y / 6) * 0.8, x, y);
            } else {
                // Cerisiers roses ou arbres roux : le feuillage lui-même est coloré, plus clair vers le haut.
                const value = 0.2 + n.fbm(x / 6, y / 6) * 0.7 + (litFromAbove ? 0.25 : 0) - Math.min(0.3, m * 0.25);
                color = edge && pixelHash(x, y, 6) > 0.7 ? foliageLit[0] : pickRamp(foliageRamp, value, x, y);
            }
            frames.forEach(buffer => set(buffer, x, y, color));
        }
    }

    return {frames: frames.map(buffer => new ImageData(buffer, WIDTH, HEIGHT)), config};
};
