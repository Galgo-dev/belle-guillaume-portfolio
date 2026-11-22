import React, {FC, Suspense} from 'react';
import {Outlet, useLocation} from "react-router-dom";

import '../../styles/Component.css';
import PillNav from "../effects/PillNav";
import Footer from "./Footer";
import ErrorBoundary from "./ErrorBoundary";
import {navItems} from "../../data/navigation";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";
import {useTheme} from "../../themes/ThemeContext";
import ThemeSwitcher from "./ThemeSwitcher";
import SeasonParticles from "./SeasonParticles";

const Layout: FC = () => {
    const location = useLocation();
    const reducedMotion = usePrefersReducedMotion();
    const {palette} = useTheme().theme;

    return (
        <>
        <SeasonParticles />
        <div className="d-flex flex-column min-vh-100 position-relative" style={{zIndex: 1}}>
            <header className="site-header">
                <PillNav
                    items={navItems}
                    activeHref={location.pathname}
                    baseColor={palette.accent}
                    pillColor={palette.surface}
                    hoveredPillTextColor={palette.accentContrast}
                    pillTextColor={palette.text}
                    initialLoadAnimation={!reducedMotion}
                />
            </header>
            <main className="flex-grow-1">
                <ErrorBoundary key={location.pathname}>
                    <Suspense fallback={<p className="py-5">Chargement…</p>}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </main>
            <Footer />
            <ThemeSwitcher />
        </div>
        </>
    );
};

export default Layout;
