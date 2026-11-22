export interface Project {
    title: string;
    /** Cadre du projet : équipe, année… affiché sous le titre. */
    context?: string;
    description: string;
    technologies: string[];
    image?: string;
    repoUrl?: string;
    demoUrl?: string;
}

export const webProjects: Project[] = [
    {
        title: 'Infradapt — API',
        context: 'Projet en équipe de 3 · 2023-2024',
        description: "API REST d'une application qui recense les lieux et leurs aménagements pour les personnes en situation de handicap. "
            + "J'y ai principalement travaillé : connexion par jeton JWT, mots de passe chiffrés, envoi d'images, recherches favorites et documentation Swagger.",
        technologies: ['Node.js', 'Express', 'Sequelize', 'PostgreSQL', 'JWT'],
    },
    {
        title: 'Infradapt — Application mobile et back-office',
        context: 'Projet en équipe de 3 · 2023-2024',
        description: "Application mobile pour chercher un lieu adapté sur une carte et enregistrer ses recherches, "
            + "accompagnée d'un site d'administration pour gérer les lieux, les aménagements, les types de handicap et les utilisateurs.",
        technologies: ['React Native', 'Expo', 'React', 'Redux', 'Ant Design'],
    },
    {
        title: "Gestion d'unité scoute",
        context: "Projet d'école à 2 (IESN) · 2022-2023",
        description: "Application de bureau pour gérer les membres d'une unité scoute : inscriptions, dossiers, fiches médicales et recherches, "
            + "sur une base de données de 25 tables, avec une architecture en couches (interface, métier, accès aux données).",
        technologies: ['Java', 'Swing', 'MySQL', 'JDBC'],
    },
    {
        title: 'Ce portfolio',
        context: 'Projet personnel · 2026',
        description: "Le site que vous consultez : un style par saison, des scènes en pixel art, une navigation adaptée au mobile "
            + "et un contenu séparé du code pour être mis à jour facilement.",
        technologies: ['React', 'TypeScript', 'Vite', 'Vitest'],
        repoUrl: 'https://github.com/Galgo-dev/belle-guillaume-portfolio',
    },
];
