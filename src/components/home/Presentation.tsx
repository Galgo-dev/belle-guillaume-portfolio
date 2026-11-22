import React, {FC} from 'react';
import '../../styles/Component.css';
import PhotoCV from '../../assets/images/PhotoCV.webp';
import HeroBackground from "./HeroBackground";
import {useTheme} from "../../themes/ThemeContext";


const Presentation: FC = () => {
    const {theme} = useTheme();
    const withScene = theme.background === 'scene';

    return (
        <div className={`presentation-box${withScene ? ' hero--scene' : ''}`}>
            <HeroBackground />
            <div className="Presentation-content d-flex flex-column-reverse flex-md-row align-items-center justify-content-center gap-4 gap-md-5 p-4 p-md-5">
                <div className="d-flex flex-column align-items-center">
                    <h1>Développeur web junior</h1>
                    <p>Bonjour, je suis Guillaume Belle.</p>
                    <p>Je suis un jeune développeur web belge, basé dans la région de Dinant.</p>
                    <p>Je suis à la recherche d'une première expérience professionnelle.</p>
                </div>
                <img className="cvPP" src={PhotoCV} alt="Photo de Guillaume Belle"/>
            </div>
        </div>

    );
}

export default Presentation;
