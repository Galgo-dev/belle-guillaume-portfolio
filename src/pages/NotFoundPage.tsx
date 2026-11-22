import React, {FC} from 'react';
import {Link} from "react-router-dom";

import '../styles/Component.css';

const NotFoundPage: FC = () => {
    return (
        <div className="py-5">
            <h1>Page introuvable</h1>
            <p>La page demandée n'existe pas ou a été déplacée.</p>
            <Link className="neon-btn" to="/">Retour à l'accueil</Link>
        </div>
    );
};

export default NotFoundPage;
