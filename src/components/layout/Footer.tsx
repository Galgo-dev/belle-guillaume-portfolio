import React, {FC} from 'react';
import {Link} from "react-router-dom";

import {BrandLinkedin} from "../icons/BrandLinkedin";
import {Mail} from "../icons/Mail";
import {BrandGithub} from "../icons/BrandGithub";
import {socialLinks} from "../../data/navigation";

const Footer: FC = () => {

    return (
        <footer className="site-footer d-flex justify-content-center align-items-center gap-4 py-4">
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <BrandLinkedin />
            </a>
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <BrandGithub />
            </a>
            <Link to="/contact" aria-label="Contact">
                <Mail />
            </Link>
        </footer>
    );
};

export default Footer;
