import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import successSound from '../succes.mp3';

const SuccessSound = ({ playSound  }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (playSound && audioRef.current) {
            audioRef.current.currentTime = 0; // Reset currentTime
            audioRef.current.play();
        }
    }, [playSound]);

    return <audio ref={audioRef} src={successSound} />;
};

SuccessSound.propTypes = {
    playSound: PropTypes.bool.isRequired,
};
export default SuccessSound;
