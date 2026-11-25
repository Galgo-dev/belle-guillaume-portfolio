import scoutEntiteAssociationFr from "../assets/images/schemas/scout-entite-association-fr.webp";
import scoutEntiteAssociationEn from "../assets/images/schemas/scout-entite-association-en.webp";
import scoutRelationnel from "../assets/images/schemas/scout-relationnel.webp";
import ceriseUcConnexion from "../assets/images/schemas/cerise-uc-connexion.webp";
import ceriseUcCategories from "../assets/images/schemas/cerise-uc-categories.webp";
import ceriseUcSanicommande from "../assets/images/schemas/cerise-uc-sanicommande.webp";
import ceriseUcGestionMateriel from "../assets/images/schemas/cerise-uc-gestion-materiel.webp";
import ceriseUcCommandeMateriel from "../assets/images/schemas/cerise-uc-commande-materiel.webp";
import ceriseFluxCommandeMateriel from "../assets/images/schemas/cerise-flux-commande-materiel.webp";
import ceriseFluxRetag from "../assets/images/schemas/cerise-flux-retag.webp";
import ceriseUcListingColisage from "../assets/images/schemas/cerise-uc-listing-colisage.webp";
import ceriseUcTableauDeBordColis from "../assets/images/schemas/cerise-uc-tableau-de-bord-colis.webp";
import ceriseUcColisIncomplet from "../assets/images/schemas/cerise-uc-colis-incomplet.webp";

export interface Schema {
    title: string;
    type: string;
    description: string;
    image?: string;
}

/** Les schémas sont regroupés par projet sur la page. */
export interface SchemaGroup {
    project: string;
    context: string;
    schemas: Schema[];
}

const USE_CASE = "Cas d'utilisation";
const FLOW = 'Diagramme de flux';

export const schemaGroups: SchemaGroup[] = [
    {
        project: 'CERISE V2 — Travail de fin d’études',
        context: 'Stage à l’ARSIA · 2025 · analyse de la plateforme existante avant sa refonte',
        schemas: [
            {
                title: 'Commande de matériel',
                type: FLOW,
                description: "Le parcours complet d'un éleveur qui commande du matériel d'identification, de la connexion à la confirmation.",
                image: ceriseFluxCommandeMateriel,
            },
            {
                title: 'Retag (boucle perdue)',
                type: FLOW,
                description: "Les étapes pour recommander une boucle perdue : recherche de l'opérateur, choix du troupeau et du type de boucle, confirmation.",
                image: ceriseFluxRetag,
            },
            {
                title: 'Commande de matériel',
                type: USE_CASE,
                description: "Les actions qui composent une commande : choix du matériel, enregistrement des informations, sélection d'articles, confirmation.",
                image: ceriseUcCommandeMateriel,
            },
            {
                title: 'Rubrique SaniCommande',
                type: USE_CASE,
                description: "Toutes les actions proposées par la rubrique de gestion du matériel.",
                image: ceriseUcSanicommande,
            },
            {
                title: 'Catégories d’action de CERISE',
                type: USE_CASE,
                description: "Les grandes rubriques accessibles après connexion à la plateforme.",
                image: ceriseUcCategories,
            },
            {
                title: 'Connexion à CERISE',
                type: USE_CASE,
                description: "Connexion, oubli et modification du mot de passe.",
                image: ceriseUcConnexion,
            },
            {
                title: 'Gestion et listing du matériel',
                type: USE_CASE,
                description: "Consultation, création et modification du matériel.",
                image: ceriseUcGestionMateriel,
            },
            {
                title: 'Impression du listing de colisage',
                type: USE_CASE,
                description: "Sélection des critères, puis téléchargement du listing en PDF.",
                image: ceriseUcListingColisage,
            },
            {
                title: 'Tableau de bord des colis',
                type: USE_CASE,
                description: "Consultation, filtrage et modification des colis.",
                image: ceriseUcTableauDeBordColis,
            },
            {
                title: 'Traitement d’un colis incomplet',
                type: USE_CASE,
                description: "Recherche par filtres, puis modification du colis incomplet.",
                image: ceriseUcColisIncomplet,
            },
        ],
    },
    {
        project: 'Gestion d’unité scoute',
        context: 'Projet d’école en binôme · 2022-2023 · conception de la base de données',
        schemas: [
            {
                title: 'Schéma entité-association',
                type: 'Entité-association',
                description: "Modèle conceptuel de la base de données : personnes, membres, unités, dossiers d'inscription, assurances et budgets, avec leurs associations et cardinalités.",
                image: scoutEntiteAssociationFr,
            },
            {
                title: 'Schéma entité-association (version anglaise)',
                type: 'Entité-association',
                description: "Le même modèle traduit en anglais pour le code, complété par les fiches médicales, les allergies et les vaccins.",
                image: scoutEntiteAssociationEn,
            },
            {
                title: 'Schéma relationnel',
                type: 'Relationnel',
                description: "Traduction du modèle en tables : clés primaires, clés étrangères et contraintes, tel qu'implémenté dans MySQL.",
                image: scoutRelationnel,
            },
        ],
    },
];
