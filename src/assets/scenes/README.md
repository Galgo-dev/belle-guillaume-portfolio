# Scènes de saison personnalisées

Par défaut, le haut de la page d'accueil affiche une scène pixel art dessinée en code (`src/pixelart/`).

Pour la remplacer par ta propre image, dépose ici un fichier nommé d'après la saison :

| Saison    | Nom du fichier                           |
|-----------|------------------------------------------|
| Printemps | `spring.webp` (ou `.png`, `.gif`, `.jpg`) |
| Été       | `summer.webp`                            |
| Automne   | `autumn.webp`                            |
| Hiver     | `winter.webp`                            |

Aucune modification de code n'est nécessaire : l'image est détectée automatiquement et remplace la scène dessinée pour cette saison uniquement.

Conseils :
- Format paysage 16:9, idéalement **320×180** (ou un multiple exact : 640×360, 1280×720) pour garder des pixels nets.
- Garde le personnage et le bureau sur la **droite** de l'image : sur ordinateur, la carte de présentation recouvre la partie gauche.
- Un `.gif` animé fonctionne aussi.
