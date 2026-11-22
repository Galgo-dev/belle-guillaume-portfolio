import React, {FC, useEffect, useRef} from 'react';

import {Season} from "../themes/themes";
import {useTheme} from "../themes/ThemeContext";
import {usePrefersReducedMotion} from "../hooks/usePrefersReducedMotion";
import {drawScene, SCENE_HEIGHT, SCENE_WIDTH} from "./scene";

// ~8 images par seconde : une cadence « pixel art », légère pour le processeur.
const FRAME_MS = 125;

const PixelScene: FC<{ season: Season }> = ({season}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reducedMotion = usePrefersReducedMotion();
    const {accent, secondary, textMuted} = useTheme().theme.palette;

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const colors = {accent, secondary, textMuted};

        // Première image dessinée tout de suite : la nouvelle saison s'affiche dès le changement de style,
        // sans attendre la boucle d'animation.
        drawScene(ctx, season, 0, colors);
        if (reducedMotion) return;

        let frameId = 0;
        const start = performance.now();
        let last = start;
        const tick = (now: number) => {
            if (now - last >= FRAME_MS) {
                last = now;
                drawScene(ctx, season, (now - start) / 1000, colors);
            }
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [season, reducedMotion, accent, secondary, textMuted]);

    return (
        <canvas
            ref={canvasRef}
            className="hero-scene"
            width={SCENE_WIDTH}
            height={SCENE_HEIGHT}
            role="img"
            aria-label="Illustration pixel art : Guillaume code à son bureau dans une chambre lo-fi"
        />
    );
};

export default PixelScene;
