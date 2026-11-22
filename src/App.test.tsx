import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// jsdom ne fournit pas de contexte WebGL : on remplace l'effet de fond.
vi.mock('./components/effects/DarkVeil', () => ({ default: () => null }));
// Même chose pour les canvas des scènes pixel art et des particules.
vi.mock('./pixelart/PixelScene', () => ({ default: () => null }));
vi.mock('./components/layout/SeasonParticles', () => ({ default: () => null }));

afterEach(() => window.history.pushState({}, '', '/'));

test('affiche la présentation sur la page d\'accueil', async () => {
  render(<App />);
  // La page d'accueil est chargée à la demande : on lui laisse le temps d'arriver quand les tests tournent en parallèle.
  expect(await screen.findByText(/je suis Guillaume Belle/i, {}, {timeout: 5000})).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeInTheDocument();
});

test('affiche la page 404 pour une URL inconnue', async () => {
  window.history.pushState({}, '', '/page-inexistante');
  render(<App />);
  expect(await screen.findByText(/Page introuvable/i, {}, {timeout: 5000})).toBeInTheDocument();
});
