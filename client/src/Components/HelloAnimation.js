import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../hello.json';

const HelloAnimation = () => {
    // Configuration for the Lottie animation
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, // The JSON animation file imported above
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
        speed: 1.5, // Adjust animation speed (1 is the default speed)
    };
    // Define height and width
    const height = 60;
    const width = 60;
    return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default HelloAnimation;