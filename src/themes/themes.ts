// Seule définition des couleurs du site : chaque palette est injectée en variables CSS (--accent, --surface…).

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ThemeId = 'classic' | Season;
export type ThemeChoice = ThemeId | 'auto';

export interface Palette {
    bg: string;
    bgGradient: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    /** Couleur du texte posé sur l'accent (boutons, menu survolé). */
    accentContrast: string;
    secondary: string;
    /** Icônes du pied de page (LinkedIn, GitHub…). */
    icon: string;
    /** Mots mis en avant dans le texte qui tombe (page Compétences). */
    highlight: string;
    /** Couleur des lueurs MagicBento, au format "r, g, b". */
    glowRgb: string;
}

export interface Theme {
    id: ThemeId;
    label: string;
    icon: string;
    palette: Palette;
    /** Classique garde le fond WebGL d'origine ; les saisons affichent une scène pixel art. */
    background: 'darkveil' | 'scene';
    pixelFont: boolean;
}

export const themes: Record<ThemeId, Theme> = {
    classic: {
        id: 'classic',
        label: 'Classique (archive)',
        icon: '◆',
        background: 'darkveil',
        pixelFont: false,
        palette: {
            bg: '#000000',
            bgGradient: '#000000',
            surface: '#120F17',
            border: '#2a2433',
            text: '#ffffff',
            textMuted: '#cfcfcf',
            accent: '#00ff21',
            accentContrast: '#120F17',
            secondary: '#efefef',
            icon: '#4cd964',
            highlight: 'cyan',
            glowRgb: '132, 0, 255',
        },
    },
    spring: {
        id: 'spring',
        label: 'Printemps',
        icon: '✿',
        background: 'scene',
        pixelFont: true,
        palette: {
            bg: '#1f1a2e',
            bgGradient: 'linear-gradient(180deg, #1f1a2e 0%, #2b2140 60%, #3a2a4a 100%)',
            surface: '#2b2140',
            border: '#4a3a63',
            text: '#fff4fa',
            textMuted: '#d8c8e0',
            accent: '#ff9ecd',
            accentContrast: '#2b1630',
            secondary: '#8fd694',
            icon: '#ff9ecd',
            highlight: '#8fd694',
            glowRgb: '255, 158, 205',
        },
    },
    summer: {
        id: 'summer',
        label: 'Été',
        icon: '☀',
        background: 'scene',
        pixelFont: true,
        palette: {
            bg: '#1b1e3c',
            bgGradient: 'linear-gradient(180deg, #1b1e3c 0%, #3b2a55 55%, #7a3b4f 100%)',
            surface: '#24284d',
            border: '#3e4378',
            text: '#fff8ec',
            textMuted: '#e6d6c3',
            accent: '#ffd166',
            accentContrast: '#2a1d05',
            secondary: '#2ec4b6',
            icon: '#ffd166',
            highlight: '#2ec4b6',
            glowRgb: '255, 209, 102',
        },
    },
    autumn: {
        id: 'autumn',
        label: 'Automne',
        icon: '❦',
        background: 'scene',
        pixelFont: true,
        palette: {
            bg: '#2a1a14',
            bgGradient: 'linear-gradient(180deg, #1e1410 0%, #2a1a14 50%, #3d2218 100%)',
            surface: '#36231b',
            border: '#5a3a2a',
            text: '#fff1e3',
            textMuted: '#e0c6ad',
            accent: '#ff8c42',
            accentContrast: '#2a1206',
            secondary: '#f4c95d',
            icon: '#ff8c42',
            highlight: '#f4c95d',
            glowRgb: '255, 140, 66',
        },
    },
    winter: {
        id: 'winter',
        label: 'Hiver',
        icon: '❄',
        background: 'scene',
        pixelFont: true,
        palette: {
            bg: '#0f1b2d',
            bgGradient: 'linear-gradient(180deg, #0b1424 0%, #0f1b2d 50%, #1a2b44 100%)',
            surface: '#16263d',
            border: '#2b4263',
            text: '#eef6ff',
            textMuted: '#b9cde4',
            accent: '#8fd3ff',
            accentContrast: '#08131f',
            secondary: '#ffcf70',
            icon: '#8fd3ff',
            highlight: '#ffcf70',
            glowRgb: '143, 211, 255',
        },
    },
};

export const themeOrder: ThemeId[] = ['spring', 'summer', 'autumn', 'winter', 'classic'];

const toKebab = (key: string) => key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/** Variables CSS d'une palette : { '--accent': '#ff9ecd', '--bg-gradient': '…', … } */
export const paletteToCssVars = (palette: Palette): Record<string, string> =>
    Object.fromEntries(Object.entries(palette).map(([key, value]) => [`--${toKebab(key)}`, value]));
