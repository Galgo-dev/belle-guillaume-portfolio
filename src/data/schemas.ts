import scoutEntiteAssociationFr from "../assets/images/schemas/scout-entite-association-fr.webp";
import scoutEntiteAssociationEn from "../assets/images/schemas/scout-entite-association-en.webp";
import scoutRelationnel from "../assets/images/schemas/scout-relationnel.webp";

export interface Schema {
    title: string;
    type: string;
    /** Projet pour lequel le schéma a été réalisé. */
    project: string;
    description: string;
    image?: string;
}

const scoutProject = "Gestion d'unité scoute · en binôme · 2022-2023";

export const schemas: Schema[] = [
    {
        title: 'Schéma entité-association',
        type: 'Entité-association',
        project: scoutProject,
        description: "Modèle conceptuel de la base de données : personnes, membres, unités, dossiers d'inscription, assurances et budgets, avec leurs associations et cardinalités.",
        image: scoutEntiteAssociationFr,
    },
    {
        title: 'Schéma entité-association (version anglaise)',
        type: 'Entité-association',
        project: scoutProject,
        description: "Le même modèle traduit en anglais pour le code, complété par les fiches médicales, les allergies et les vaccins.",
        image: scoutEntiteAssociationEn,
    },
    {
        title: 'Schéma relationnel',
        type: 'Relationnel',
        project: scoutProject,
        description: "Traduction du modèle en tables : clés primaires, clés étrangères et contraintes, tel qu'implémenté dans MySQL.",
        image: scoutRelationnel,
    },
];
