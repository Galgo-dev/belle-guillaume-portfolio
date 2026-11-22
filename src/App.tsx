import React, {lazy} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
// Seuls le reset, la grille et les utilitaires de Bootstrap sont utilisés (aucun composant).
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
// Après Bootstrap, pour que le fond du thème l'emporte sur le fond blanc par défaut de Bootstrap.
import './styles/App.css';

import Layout from "./components/layout/Layout";
import {ThemeProvider} from "./themes/ThemeContext";

const Home = lazy(() => import("./pages/Home"));
const CV = lazy(() => import("./pages/CV"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const GamesPage = lazy(() => import("./pages/GamesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const SchemasPage = lazy(() => import("./pages/SchemasPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <ThemeProvider>
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/CV" element={<CV />} />
                    <Route path="/skills" element={<SkillsPage />} />
                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/webSite" element={<ProjectsPage />} />
                    <Route path="/schemas" element={<SchemasPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>

    </div>
    </ThemeProvider>
  );
}

export default App;
