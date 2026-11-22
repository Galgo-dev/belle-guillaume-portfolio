# Portfolio — Guillaume Belle

Portfolio de développeur web junior, en React 19 + TypeScript, construit avec Vite.
Le site change de style selon la saison (printemps, été, automne, hiver) et garde l'ancien style néon en archive.

## Commandes

| Commande          | Effet                                              |
|-------------------|----------------------------------------------------|
| `npm run dev`     | Lance le site en développement (port 3000)         |
| `npm run build`   | Vérifie les types puis construit le site dans `dist/` |
| `npm run preview` | Sert le site construit, pour le tester             |
| `npm test`        | Lance les tests (Vitest)                           |

## Organisation des dossiers

```
├── public/              Fichiers servis tels quels (favicon, manifest, robots.txt)
├── assets-source/       Images d'origine avant optimisation (non incluses dans le site)
├── index.html           Page HTML d'entrée
└── src/
    ├── index.tsx        Point d'entrée
    ├── App.tsx          Routes du site
    ├── assets/
    │   ├── documents/   CV en PDF
    │   ├── images/      Photos
    │   ├── logos/       Logos des technologies
    │   └── scenes/      Images de fond des saisons (voir son README)
    ├── components/
    │   ├── layout/      Mise en page commune : menu, pied de page, bouton de style, particules
    │   ├── home/        Blocs de la page d'accueil
    │   ├── skills/      Blocs de la page Compétences
    │   ├── common/      Composants réutilisés sur plusieurs pages
    │   ├── icons/       Icônes SVG
    │   └── effects/     Effets visuels (PillNav, MagicBento, DarkVeil…) avec leur CSS
    ├── data/            Contenu du site : projets, jeux, schémas, contact, menu
    ├── hooks/           Hooks React
    ├── pages/           Une page par route
    ├── pixelart/        Scènes pixel art dessinées en code (utilisées si une saison n'a pas d'image)
    ├── styles/          Feuilles de style globales
    ├── themes/          Palettes des saisons et choix du style
    └── types/           Déclarations TypeScript
```

## Modifier le contenu

- **Projets, jeux, schémas, coordonnées :** fichiers de `src/data/`.
- **Couleurs d'une saison :** `src/themes/themes.ts`.
- **Image de fond d'une saison :** déposer `spring`, `summer`, `autumn` ou `winter` (`.png`, `.webp`, `.gif`, `.jpg`) dans `src/assets/scenes/`.

## Tester les styles

En développement, le bouton « Style » en bas à droite permet de changer de saison.
Sur le site en ligne, il n'apparaît que si l'adresse contient `?styles`.
