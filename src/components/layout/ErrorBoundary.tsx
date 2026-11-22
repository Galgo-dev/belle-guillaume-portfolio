import React, {Component, ErrorInfo, ReactNode} from 'react';

import '../../styles/Component.css';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

// Évite l'écran noir : affiche un message si une page plante au rendu ou au chargement.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {hasError: false};

    static getDerivedStateFromError(): ErrorBoundaryState {
        return {hasError: true};
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Erreur dans la page :', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="page">
                    <h1>Oups, un problème est survenu</h1>
                    <p>Cette page n'a pas pu s'afficher.</p>
                    <button className="neon-btn" onClick={() => window.location.reload()}>Recharger la page</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
