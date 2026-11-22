import React, {FC} from 'react';

import '../styles/Component.css';
import Presentation from "../components/home/Presentation";
import Resume from "../components/home/Resume";

const Home: FC = () => {
    return (
        <div>
            <Presentation />
            <Resume />
        </div>
    );
};

export default Home;