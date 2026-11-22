import React, {FC} from 'react';
import '../../styles/Component.css';
import MagicBento from "../effects/MagicBento";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";
import {useTheme} from "../../themes/ThemeContext";

const Resume: FC = () => {
    const reducedMotion = usePrefersReducedMotion();
    const {glowRgb} = useTheme().theme.palette;

    return (
        <div className="d-flex justify-content-center">
            <MagicBento
                textAutoHide={false}
                enableStars
                enableSpotlight
                enableBorderGlow={true}
                enableTilt={false}
                enableMagnetism
                clickEffect
                spotlightRadius={400}
                particleCount={12}
                glowColor={glowRgb}
                disableAnimations={reducedMotion}
            />
        </div>
    );
};

export default Resume;