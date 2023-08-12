import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../mapIcon.json';

const MapAnimation = ({ onClick, height = 40, width = 40, ...restProps }) => {
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

    // Add an event listener for the click event
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer', height, width, ...restProps }}>
            <Lottie options={defaultOptions} height={height} width={width} />
        </div>
    );
};

export default MapAnimation;
