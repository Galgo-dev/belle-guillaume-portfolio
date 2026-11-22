import React, {FC} from 'react';

import '../../styles/Component.css';
import DarkVeil from "../effects/DarkVeil";
import PixelScene from "../../pixelart/PixelScene";
import {Season} from "../../themes/themes";
import {useTheme} from "../../themes/ThemeContext";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";

// Images perso : déposer src/assets/scenes/<saison>.(webp|png|gif|jpg) suffit, elles remplacent la scène dessinée.
const customScenes = import.meta.glob<string>('../../assets/scenes/*.{webp,png,gif,jpg,jpeg}', {
    eager: true,
    import: 'default',
});

const findCustomScene = (season: Season): string | undefined => {
    const path = Object.keys(customScenes).find(file => file.split('/').pop()?.split('.')[0] === season);
    return path ? customScenes[path] : undefined;
};

const HeroBackground: FC = () => {
    const {theme} = useTheme();
    const reducedMotion = usePrefersReducedMotion();

    if (theme.id === 'classic') {
        return (
            <div className="darkveil_box">
                {!reducedMotion && (
                    <DarkVeil
                        hueShift={82}
                        noiseIntensity={0.2}
                        scanlineIntensity={1}
                        speed={3}
                        scanlineFrequency={2.5}
                        warpAmount={5}
                    />
                )}
            </div>
        );
    }

    const customImage = findCustomScene(theme.id);
    if (customImage) {
        return <img className="hero-scene" src={customImage} alt={`Illustration ${theme.label.toLowerCase()} : Guillaume code à son bureau`} />;
    }

    // Nouvelle clé à chaque saison : canvas tout neuf, aucune image de l'ancienne saison ne reste affichée.
    return <PixelScene key={theme.id} season={theme.id} />;
};

export default HeroBackground;
