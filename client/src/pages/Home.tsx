import React from 'react';
import Jumbotron from '../components/Jumbotron';
import Body from '../components/Body';
import Description from '../components/Description';
import Button from '../components/Button';

const Home: React.FC = () => {
    return (
        <div>
            <Jumbotron />
            <Body />
            <Description />
            <Button />
        </div>
    )
}

export default Home;