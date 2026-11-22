import React, {createContext, FC, ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useState} from 'react';

import {paletteToCssVars, Theme, ThemeChoice, themes} from "./themes";
import {getSeasonForDate} from "./season";

const STORAGE_KEY = 'portfolio-theme';

interface ThemeContextValue {
    theme: Theme;
    choice: ThemeChoice;
    setChoice: (choice: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isChoice = (value: string | null): value is ThemeChoice =>
    value === 'auto' || (value !== null && value in themes);

const readStoredChoice = (): ThemeChoice => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return isChoice(stored) ? stored : 'auto';
    } catch {
        return 'auto';
    }
};

export const ThemeProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [choice, setChoiceState] = useState<ThemeChoice>(readStoredChoice);

    const theme = themes[choice === 'auto' ? getSeasonForDate() : choice];

    const setChoice = useCallback((next: ThemeChoice) => {
        setChoiceState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Stockage indisponible (navigation privée…) : le choix ne vaut que pour cette visite.
        }
    }, []);

    // Avant l'affichage, pour éviter un flash de l'ancien thème.
    useLayoutEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = theme.id;
        Object.entries(paletteToCssVars(theme.palette)).forEach(([name, value]) => root.style.setProperty(name, value));
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.palette.bg);
    }, [theme]);

    const value = useMemo(() => ({theme, choice, setChoice}), [theme, choice, setChoice]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme doit être utilisé dans un ThemeProvider');
    return context;
};
