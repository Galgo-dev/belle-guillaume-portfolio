import React from 'react';
import {act, render, screen} from '@testing-library/react';

import {ThemeProvider, useTheme} from './ThemeContext';
import {getSeasonForDate} from './season';

const Probe = () => {
    const {theme, setChoice} = useTheme();
    return <button onClick={() => setChoice('summer')}>{theme.id}</button>;
};

afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
});

test('sans choix enregistré, le thème suit la saison du jour', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent(getSeasonForDate());
    expect(document.documentElement.dataset.theme).toBe(getSeasonForDate());
});

test('le choix enregistré est relu et appliqué sur <html>', () => {
    localStorage.setItem('portfolio-theme', 'classic');
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(document.documentElement.dataset.theme).toBe('classic');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#00ff21');
});

test('changer de style met à jour la page et le stockage', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>);
    act(() => screen.getByRole('button').click());
    expect(document.documentElement.dataset.theme).toBe('summer');
    expect(localStorage.getItem('portfolio-theme')).toBe('summer');
});

test('une valeur enregistrée invalide est ignorée', () => {
    localStorage.setItem('portfolio-theme', 'nimporte-quoi');
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent(getSeasonForDate());
});
