import {seeded} from "./draw";

// Bruit de valeur 2D + fBm : formes organiques (nuages, feuillages, collines) sans images.

export interface Noise {
    noise: (x: number, y: number) => number;
    fbm: (x: number, y: number, octaves?: number) => number;
}

export const makeNoise = (seed: number): Noise => {
    const random = seeded(seed);
    const values = Float32Array.from({length: 256}, () => random());
    const perm = Uint8Array.from({length: 256}, (_, i) => i);
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    const hash = (x: number, y: number) => values[perm[(perm[x & 255] + y) & 255]];
    const smooth = (t: number) => t * t * (3 - 2 * t);

    const noise = (x: number, y: number) => {
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const tx = smooth(x - xi);
        const ty = smooth(y - yi);
        const top = hash(xi, yi) + (hash(xi + 1, yi) - hash(xi, yi)) * tx;
        const bottom = hash(xi, yi + 1) + (hash(xi + 1, yi + 1) - hash(xi, yi + 1)) * tx;
        return top + (bottom - top) * ty;
    };

    const fbm = (x: number, y: number, octaves = 4) => {
        let sum = 0;
        let amplitude = 0.5;
        let norm = 0;
        for (let o = 0; o < octaves; o++) {
            sum += noise(x, y) * amplitude;
            norm += amplitude;
            x *= 2.03;
            y *= 2.03;
            amplitude *= 0.5;
        }
        return sum / norm;
    };

    return {noise, fbm};
};

export type RGB = [number, number, number];

export const hexToRgb = (hex: string): RGB => {
    const value = parseInt(hex.replace('#', ''), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

// Matrice de Bayer 4×4 : le tramage ordonné typique du pixel art pour passer d'une teinte à l'autre.
const BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
].map(row => row.map(v => (v + 0.5) / 16 - 0.5));

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
};

/** Choisit une couleur d'une rampe (sombre → clair) pour une valeur 0..1, avec tramage. */
export const pickRamp = (ramp: RGB[], value: number, x: number, y: number, dither = 1): RGB => {
    const scaled = clamp01(value) * (ramp.length - 1) + BAYER4[y & 3][x & 3] * dither;
    const index = Math.max(0, Math.min(ramp.length - 1, Math.round(scaled)));
    return ramp[index];
};

/** Petit hachage déterministe par pixel (étoiles, fleurs, éclats). */
export const pixelHash = (x: number, y: number, seed = 0) => {
    let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
