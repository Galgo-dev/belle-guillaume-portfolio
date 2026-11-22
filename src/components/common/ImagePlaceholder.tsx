import React, {FC} from 'react';

interface ImagePlaceholderProps {
    image?: string;
    alt: string;
    label?: string;
}

// Affiche l'image si elle existe, sinon un encadré « Aperçu à venir ».
const ImagePlaceholder: FC<ImagePlaceholderProps> = ({image, alt, label = 'Aperçu à venir'}) => {
    if (image) {
        return <img className="card-media" src={image} alt={alt} />;
    }

    return (
        <div className="card-media card-media--empty" role="img" aria-label={alt}>
            {label}
        </div>
    );
};

export default ImagePlaceholder;
