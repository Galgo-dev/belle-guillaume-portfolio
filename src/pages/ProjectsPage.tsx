import React, {FC} from 'react';

import '../styles/Component.css';
import ProjectCard from "../components/common/ProjectCard";
import {webProjects} from "../data/projects";

const ProjectsPage: FC = () => {
    return (
        <div className="page">
            <h1>Projets réalisés</h1>
            <p className="page-intro">Applications que j'ai conçues et développées, seul ou en équipe.</p>
            <div className="row g-4">
                {webProjects.map(project => (
                    <div key={project.title} className="col-12 col-md-6">
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;
