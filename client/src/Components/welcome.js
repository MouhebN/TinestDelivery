import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HelloAnimation from "./HelloAnimation";

const WelcomeComponent = () => {
    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        // Make an API call to the backend to fetch the welcome message
        axios.get('http://localhost:3000/welcome', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response.data.message);
                setWelcomeMessage(response.data.message);
            })
            .catch(error => {
                console.error('Error fetching welcome message:', error);
            });
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: '5px' }}>{welcomeMessage}</p>
            <HelloAnimation />
        </div>
    );
};

export default WelcomeComponent;
