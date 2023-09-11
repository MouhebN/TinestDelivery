import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';
import MiniDrawerfourisseur from "../../Components/SideBar";

const SuiviEchange = () => {
    const [trackingData, setTrackingData] = useState([]);

    useEffect(() => {
        // Fetch tracking data from an API using axios
        axios.get('http://localhost:3000/listerColisFournisseur',{
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                setTrackingData(response.data.colisList);
            })
            .catch(error => {
                console.error('Error fetching tracking data:', error);
            });
    }, []);

    return (
        <>
            <MiniDrawerfourisseur/>
        <div sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: 1, left: 250, position: 'relative', width: 1400 }}>
            <Box sx={{ padding: 1, left: 250, position: 'relative', width: 1500 }}>
                <Typography variant="h5" gutterBottom>
                    Suivi de l'échange de colis
                </Typography>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <List>
                        {trackingData.map((data, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText
                                        primary={data.status}
                                        secondary={`Emplacement: ${data.destination} - Heure: ${data.timestamp}`}
                                    />
                                    <IconButton color="primary">
                                        <PlayArrowIcon />
                                    </IconButton>
                                </ListItem>
                                {index !== trackingData.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Box>
        </div>
            </>
    );
};

export default SuiviEchange;