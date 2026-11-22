import React, {FC, useEffect, useRef} from 'react';

import '../../styles/Component.css';
import {Season} from "../../themes/themes";
import {useTheme} from "../../themes/ThemeContext";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";

// Particules de saison en arrière-plan de tout le site : neige, pétales, feuilles, lucioles.

interface ParticleStyle {
    colors: string[];
    size: number;
    fall: number;
    sway: number;
    blink?: boolean;
}

const styles: Record<Season, ParticleStyle> = {
    spring: {colors: ['#ffc2dc', '#ffe3ef', '#ff9ecd'], size: 4, fall: 22, sway: 30},
    summer: {colors: ['#ffd166', '#fff1a8'], size: 3, fall: -6, sway: 18, blink: true},
    autumn: {colors: ['#e8792b', '#c44536', '#f4c95d'], size: 5, fall: 30, sway: 40},
    winter: {colors: ['#ffffff', '#e8f4ff'], size: 3, fall: 26, sway: 14},
};

// Les particules sont des carrés alignés sur une grille de 4 px, pour rester dans l'esprit pixel art.
const GRID = 4;

const SeasonParticles: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {theme} = useTheme();
    const reducedMotion = usePrefersReducedMotion();
    const season = theme.id === 'classic' ? null : theme.id;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !season || reducedMotion) return;

        const style = styles[season];
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const count = window.innerWidth < 768 ? 18 : 36;
        const particles = Array.from({length: count}, (_, i) => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.6 + Math.random() * 0.8,
            phase: Math.random() * Math.PI * 2,
            color: style.colors[i % style.colors.length],
        }));

        let frameId = 0;
        let previous = performance.now();
        const tick = (now: number) => {
            const dt = Math.min((now - previous) / 1000, 0.1);
            previous = now;
            const t = now / 1000;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += style.fall * p.speed * dt;
                p.x += Math.sin(t * 0.8 + p.phase) * style.sway * dt;
                if (p.y > canvas.height + 10) p.y = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.x < -10) p.x = canvas.width + 10;

                const alpha = style.blink ? Math.max(0, Math.sin(t * 1.5 + p.phase)) : 0.7;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.round(p.x / GRID) * GRID, Math.round(p.y / GRID) * GRID, style.size, style.size);
            });
            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [season, reducedMotion]);

    if (!season || reducedMotion) return null;

    return <canvas ref={canvasRef} className="season-particles" aria-hidden="true" />;
};

export default SeasonParticles;
