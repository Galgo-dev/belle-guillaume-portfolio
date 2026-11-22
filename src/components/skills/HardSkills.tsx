import React, {FC} from 'react';

import '../../styles/Component.css';
import OrbitImages from "../effects/OrbitImages";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";
import {useTheme} from "../../themes/ThemeContext";

import JavaScriptLogo from "../../assets/logos/JavaScriptLogo.webp";
import css from "../../assets/logos/css.webp";
import HTML5Logo from "../../assets/logos/HTML5Logo.webp";
import ReactLogo from "../../assets/logos/ReactLogo.webp";
import mysqlLogo from "../../assets/logos/mysqlLogo.webp";
import nodejsLogo from "../../assets/logos/nodejsLogo.webp";
import javaLogo from "../../assets/logos/javaLogo.webp";
import pythonLogo from "../../assets/logos/Python-Logo.webp";

const skills = [
    {name: 'JavaScript', logo: JavaScriptLogo},
    {name: 'CSS', logo: css},
    {name: 'HTML5', logo: HTML5Logo},
    {name: 'React', logo: ReactLogo},
    {name: 'MySQL', logo: mysqlLogo},
    {name: 'Node.js', logo: nodejsLogo},
    {name: 'Java', logo: javaLogo},
    {name: 'Python', logo: pythonLogo},
];

const HardSkills: FC = () => {
    const reducedMotion = usePrefersReducedMotion();
    const {accent} = useTheme().theme.palette;

    return (
        <div>
            <h2 className="section-title">Compétences techniques</h2>
            {/* Liste lue par les lecteurs d'écran ; l'orbite de logos est purement décorative. */}
            <ul className="visually-hidden">
                {skills.map(skill => <li key={skill.name}>{skill.name}</li>)}
            </ul>
            <div aria-hidden="true">
                <OrbitImages
                    images={skills.map(skill => skill.logo)}
                    shape="ellipse"
                    baseWidth={800}
                    baseHeight={360}
                    radiusX={340}
                    radiusY={80}
                    rotation={-8}
                    duration={30}
                    itemSize={80}
                    responsive={true}
                    radius={160}
                    direction="normal"
                    fill={true}
                    showPath={true}
                    pathColor={accent}
                    paused={reducedMotion}
                />
            </div>
        </div>
    );
};

export default HardSkills;
