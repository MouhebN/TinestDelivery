import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import errorSound from '../wrong.mp3';

const ErrorSound = ({ playSound  }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (playSound) {
            if (audioRef.current) {
                audioRef.current.play();
            }
        }
    }, [playSound]);

    return <audio ref={audioRef} src={errorSound} />;
};

ErrorSound.propTypes = {
    playSound: PropTypes.bool.isRequired,
};
export default ErrorSound;

