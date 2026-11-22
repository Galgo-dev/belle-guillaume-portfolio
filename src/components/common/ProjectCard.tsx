import React, {FC} from 'react';

import '../../styles/Component.css';
import {Project} from "../../data/projects";
import ImagePlaceholder from "./ImagePlaceholder";

interface ProjectCardProps {
    project: Project;
    demoLabel?: string;
}

const ProjectCard: FC<ProjectCardProps> = ({project, demoLabel = 'Voir la démo'}) => {
    return (
        <article className="portfolio-card h-100 d-flex flex-column">
            <ImagePlaceholder image={project.image} alt={`Aperçu de ${project.title}`} />
            <div className="p-3 d-flex flex-column flex-grow-1 text-start">
                <h2 className="portfolio-card__title">{project.title}</h2>
                {project.context && <p className="portfolio-card__context">{project.context}</p>}
                <p className="flex-grow-1">{project.description}</p>
                <ul className="tech-list">
                    {project.technologies.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="d-flex gap-2 mt-3">
                    {project.repoUrl && (
                        <a className="card-link-btn" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            Code source
                        </a>
                    )}
                    {project.demoUrl && (
                        <a className="card-link-btn card-link-btn--primary" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            {demoLabel}
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ProjectCard;
