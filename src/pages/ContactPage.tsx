import React, {FC} from "react";

import '../styles/Component.css';
import {contactInfo} from "../data/contact";
import {socialLinks} from "../data/navigation";

const ContactPage: FC = () => {
    return (
        <div className="page" style={{maxWidth: 600}}>
            <h1>Contact</h1>
            <p className="page-intro">N'hésitez pas à me contacter pour toute demande, stage ou opportunité professionnelle.</p>
            <ul className="contact-list text-start">
                <li>
                    <span>E-mail</span>
                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </li>
                <li>
                    <span>Téléphone</span>
                    <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>{contactInfo.phone}</a>
                </li>
                <li>
                    <span>LinkedIn</span>
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">Guillaume Belle</a>
                </li>
                <li>
                    <span>GitHub</span>
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">Galgo-dev</a>
                </li>
                <li>
                    <span>Localisation</span>
                    <p className="mb-0">{contactInfo.location}</p>
                </li>
            </ul>
        </div>
    );
};

export default ContactPage;
