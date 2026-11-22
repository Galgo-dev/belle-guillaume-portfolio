import menu from "../assets/images/games/menu.webp";
import hub from "../assets/images/games/hubTest.webp";
import nutonForest from "../assets/images/games/nutonForest.webp";
import lutinDesert from "../assets/images/games/lutinDesert.webp";
import scoutCavern from "../assets/images/games/adventureCave.webp";
import horizonPlaine from "../assets/images/games/horizonPlaine.webp";

export interface GameLevel {
    name: string;
    /** Type d'épreuve du niveau. */
    kind: string;
    description: string;
    image: string;
    inProgress?: boolean;
}

export interface Game {
    title: string;
    status: string;
    technologies: string[];
    pitch: string;
    cover: string;
    levels: GameLevel[];
    todo: string[];
}

export const game: Game = {
    title: '64 Adventure',
    status: 'En cours de développement',
    technologies: ['Phaser'],
    pitch: "Un jeu de plateforme où chaque niveau terminé rapporte un badge. "
        + "Une fois tous les badges obtenus, le joueur devient un vrai membre de l'unité Guides Jacques Thibaut.",
    cover: menu,
    levels: [
        {
            name: 'Le hub',
            kind: 'Choix du niveau',
            description: 'Le point de départ : chaque porte mène à un niveau.',
            image: hub,
            inProgress: true,
        },
        {
            name: 'Nuton Forest',
            kind: 'Collecte',
            description: 'Ramasser toutes les étoiles cachées dans la forêt.',
            image: nutonForest,
        },
        {
            name: 'Lutin Desert',
            kind: 'Course',
            description: "Traverser le désert le plus vite possible.",
            image: lutinDesert,
        },
        {
            name: 'Scout Cavern',
            kind: 'Tir sur cibles',
            description: 'Détruire toutes les cibles présentes dans la caverne.',
            image: scoutCavern,
        },
        {
            name: 'Horizon Plaine',
            kind: "Jeu d'approche",
            description: "Avancer sans se faire repérer. Niveau en cours de développement.",
            image: horizonPlaine,
            inProgress: true,
        },
    ],
    todo: [
        'Terminer le niveau Horizon Plaine',
        'Créer le hub final et le monde de la victoire',
        'Améliorer les sprites existants et en créer de nouveaux',
    ],
};
