import React, {FC, useEffect, useState} from 'react';

import '../styles/Component.css';
import ImagePlaceholder from "../components/common/ImagePlaceholder";
import {Schema, schemas} from "../data/schemas";

const SchemasPage: FC = () => {
    const [selected, setSelected] = useState<Schema | null>(null);

    useEffect(() => {
        if (!selected) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelected(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selected]);

    return (
        <div className="page">
            <h1>Mes schémas d'analyse</h1>
            <p className="page-intro">Schémas réalisés lors de l'analyse de mes projets. Cliquez sur un schéma pour l'agrandir.</p>
            <div className="row g-4">
                {schemas.map(schema => (
                    <div key={schema.title} className="col-12 col-md-6 col-lg-4">
                        <button className="portfolio-card schema-card h-100" onClick={() => setSelected(schema)}>
                            {schema.image
                                ? <img className="card-media schema-thumb" src={schema.image} alt={`Aperçu : ${schema.title}`} />
                                : <ImagePlaceholder alt={schema.title} label="Schéma à venir" />}
                            <div className="p-3 text-start">
                                <ul className="tech-list mb-2"><li>{schema.type}</li></ul>
                                <h2 className="portfolio-card__title">{schema.title}</h2>
                                <p className="portfolio-card__context">{schema.project}</p>
                                <p className="mb-0">{schema.description}</p>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {selected && (
                <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
                    <div className="lightbox__content">
                        {selected.image
                            ? <img className="lightbox__image" src={selected.image} alt={selected.title} />
                            : <ImagePlaceholder alt={selected.title} label="Schéma à venir" />}
                        <p className="mt-3 mb-2">{selected.title} — appuyez sur Échap ou cliquez pour fermer.</p>
                        {selected.image && (
                            <a
                                className="card-link-btn"
                                href={selected.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={event => event.stopPropagation()}
                            >
                                Ouvrir en taille réelle
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchemasPage;
