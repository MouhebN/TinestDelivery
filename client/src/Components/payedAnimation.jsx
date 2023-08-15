import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../payed.json';

const PayedAnimation = () => {
    // Configuration for the Lottie animation
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, // The JSON animation file imported above
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
        speed: 1.5,
    };
    // Define height and width
    const height = 50;
    const width = 50;
    return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default PayedAnimation;