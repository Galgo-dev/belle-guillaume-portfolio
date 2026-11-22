// Petites primitives de dessin « pixel » : tout est tracé en carrés de 1 px sur un canvas 320×180 agrandi en CSS.

export type Ctx = CanvasRenderingContext2D;

export const rect = (ctx: Ctx, x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

export const px = (ctx: Ctx, x: number, y: number, color: string) => rect(ctx, x, y, 1, 1, color);

/** Générateur pseudo-aléatoire déterministe : le décor reste identique d'une image à l'autre. */
export const seeded = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const withAlpha = (ctx: Ctx, alpha: number, draw: () => void) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    draw();
    ctx.restore();
};
