import React, {FC, useState} from 'react';

import '../styles/Component.css';

import FallingText from "../components/effects/FallingText";
import HardSkills from "../components/skills/HardSkills";
import {usePrefersReducedMotion} from "../hooks/usePrefersReducedMotion";

const SkillsPage: FC = () => {
    const reducedMotion = usePrefersReducedMotion();
    // Changer la clé recrée le composant : les mots reviennent à leur place.
    const [resetCount, setResetCount] = useState(0);

    return (
        <div className="page">
            <h1>Compétences</h1>
            <div className="hard-skills-box my-4">
                <HardSkills />
            </div>
            <div className="soft-skills-box my-4 p-3">
                <h2 className="section-title">Savoir-être</h2>
                <p className="soft-skills-hint">
                    {reducedMotion ? 'Cliquez sur le texte' : 'Survolez le texte'} pour faire tomber les mots, puis attrapez-les à la souris.
                </p>
                <FallingText
                    key={resetCount}
                    text={`Mes savoir-être : la créativité, la gestion du stress, la gestion budgétaire et la conception de jeux.`}
                    highlightWords={["créativité", "stress", "budgétaire", "jeux", "gestion"]}
                    highlightClass="highlighted"
                    trigger={reducedMotion ? 'click' : 'hover'}
                    backgroundColor="transparent"
                    wireframes={false}
                    gravity={0.56}
                    fontSize="clamp(1rem, 2.4vw, 1.6rem)"
                    mouseConstraintStiffness={0.9}
                />
                <button className="card-link-btn soft-skills-reset" onClick={() => setResetCount(count => count + 1)}>
                    Remettre en place
                </button>
            </div>
        </div>
    );
};

export default SkillsPage;
