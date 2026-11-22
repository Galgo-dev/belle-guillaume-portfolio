import React, {FC} from "react";

import '../styles/Component.css';
import DownloadCVButton from "../components/common/DownloadCVButton";
import cvPdf from "../assets/documents/BelleGuillaumeCV2Vert.pdf";
// Image de la page du PDF : le CV s'affiche en entier, sans lecteur à faire défiler (et aussi sur mobile).
// À régénérer si le PDF change.
import cvImage from "../assets/images/BelleGuillaumeCV2Vert.webp";


const CV: FC = () => {
    return (
        <div className="page">
            <h1>Curriculum vitae</h1>
            <DownloadCVButton />
            <a href={cvPdf} target="_blank" rel="noopener noreferrer" title="Ouvrir le CV en PDF">
                <img
                    className="cv-image"
                    src={cvImage}
                    width={1600}
                    height={2263}
                    alt="Curriculum vitae de Guillaume Belle, analyste développeur web junior : formation, expériences et compétences. La version PDF est téléchargeable avec le bouton ci-dessus."
                />
            </a>
        </div>
    );
};

export default CV;
