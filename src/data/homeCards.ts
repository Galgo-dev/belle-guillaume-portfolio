import type {BentoCardProps} from "../components/effects/MagicBento";

export const homeCards: BentoCardProps[] = [
    {
        title: 'Schémas',
        description: 'Entité-association, relationnel',
        label: 'Analyse',
        link: '/schemas'
    },
    {
        title: 'Mes compétences',
        description: 'Découvrez-en plus sur moi',
        label: 'Compétences',
        link: '/skills'
    },
    {
        title: 'Projets vidéoludiques',
        description: 'Mes créations Phaser',
        label: 'Jeux vidéo',
        link: '/games'
    },
    {
        title: 'Sites et applications',
        description: 'Projets réalisés',
        label: 'Projets web',
        link: '/webSite'
    },
    {
        title: 'CV',
        description: 'Téléchargez-le !',
        label: 'Curriculum vitae',
        link: '/CV'
    },
    {
        title: 'Des questions ?',
        description: 'Contactez-moi !',
        label: 'Contact',
        link: '/contact'
    }
];
