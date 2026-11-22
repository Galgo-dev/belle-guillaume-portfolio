import React, {FC} from 'react';

import '../styles/Component.css';
import {game} from "../data/games";

const GamesPage: FC = () => {
    return (
        <div className="page">
            <h1>Mes jeux</h1>
            <p className="page-intro">Mes créations vidéoludiques réalisées avec Phaser.</p>

            <article className="portfolio-card game-hero text-start">
                <img className="game-hero__cover" src={game.cover} alt={`Écran titre de ${game.title}`} />
                <div className="p-3 p-md-4">
                    <h2 className="portfolio-card__title">{game.title}</h2>
                    <p className="portfolio-card__context">{game.status}</p>
                    <p>{game.pitch}</p>
                    <ul className="tech-list">
                        {game.technologies.map(tech => <li key={tech}>{tech}</li>)}
                    </ul>
                </div>
            </article>

            <h2 className="section-title mt-5 mb-4">Les niveaux</h2>
            <div className="row g-4">
                {game.levels.map(level => (
                    <div key={level.name} className="col-12 col-md-6">
                        <article className="portfolio-card h-100 text-start">
                            <img className="card-media game-shot" src={level.image} alt={`Capture du niveau ${level.name}`} />
                            <div className="p-3">
                                <ul className="tech-list mb-2">
                                    <li>{level.kind}</li>
                                    {level.inProgress && <li className="tech-list__muted">En cours</li>}
                                </ul>
                                <h3 className="portfolio-card__title">{level.name}</h3>
                                <p className="mb-0">{level.description}</p>
                            </div>
                        </article>
                    </div>
                ))}
            </div>

            <h2 className="section-title mt-5 mb-3">Ce qu'il reste à faire</h2>
            <ul className="game-todo text-start">
                {game.todo.map(item => <li key={item}>{item}</li>)}
            </ul>
        </div>
    );
};

export default GamesPage;
