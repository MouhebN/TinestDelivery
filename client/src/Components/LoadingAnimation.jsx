import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../loadingIcon.json';

const LoadingAnimation = () => {
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
    const height = 80;
    const width = 80;

    // Define the margin left value (adjust it as needed)
    const marginLeftValue = 5;

    return (
        <div style={{ marginLeft: `${marginLeftValue}px` }}>
            <Lottie options={defaultOptions} height={height} width={width} />
        </div>
    );
};

export default LoadingAnimation;
