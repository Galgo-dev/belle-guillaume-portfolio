import React, {FC, useState} from 'react';

import '../../styles/Component.css';
import {useTheme} from "../../themes/ThemeContext";
import {ThemeChoice, themeOrder, themes} from "../../themes/themes";
import {getSeasonForDate} from "../../themes/season";

// Bouton de test des styles : visible en développement, avec VITE_THEME_SWITCHER=true, ou avec ?styles dans l'adresse.
export const isThemeSwitcherEnabled = (): boolean =>
    import.meta.env.DEV
    || import.meta.env.VITE_THEME_SWITCHER === 'true'
    || new URLSearchParams(window.location.search).has('styles');

const ThemeSwitcher: FC = () => {
    const {choice, setChoice, theme} = useTheme();
    const [open, setOpen] = useState(false);

    if (!isThemeSwitcherEnabled()) return null;

    const options: { value: ThemeChoice; label: string; icon: string }[] = [
        {value: 'auto', label: `Auto (${themes[getSeasonForDate()].label})`, icon: '⟳'},
        ...themeOrder.map(id => ({value: id, label: themes[id].label, icon: themes[id].icon})),
    ];

    return (
        <div className="theme-switcher">
            {open && (
                <ul className="theme-switcher__menu" role="listbox" aria-label="Choisir un style">
                    {options.map(option => (
                        <li key={option.value}>
                            <button
                                role="option"
                                aria-selected={choice === option.value}
                                className={`theme-switcher__option${choice === option.value ? ' is-active' : ''}`}
                                onClick={() => {
                                    setChoice(option.value);
                                    setOpen(false);
                                }}
                            >
                                <span aria-hidden="true">{option.icon}</span> {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <button
                className="theme-switcher__toggle"
                aria-expanded={open}
                aria-label={`Changer de style (actuel : ${theme.label})`}
                onClick={() => setOpen(!open)}
            >
                <span aria-hidden="true">{theme.icon}</span> Style
            </button>
        </div>
    );
};

export default ThemeSwitcher;
