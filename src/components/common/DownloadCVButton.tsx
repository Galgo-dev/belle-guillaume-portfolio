import React, {FC} from 'react';
import '../../styles/Component.css';

import CV from "../../assets/documents/BelleGuillaumeCV2Vert.pdf"


const DownloadCVButton: FC = () => {

    return (
        <div className="my-4">
            <a className="neon-btn" href={CV} download="CV_Guillaume_Belle.pdf">
                Télécharger le CV
            </a>
        </div>
    );
};

export default DownloadCVButton;
