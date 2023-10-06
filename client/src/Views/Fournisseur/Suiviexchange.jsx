import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';
import MiniDrawerfourisseur from "../../Layouts/sideBarFournisseur";

const SuiviEchange = () => {
    const [trackingData, setTrackingData] = useState([]);

    useEffect(() => {
        // Fetch tracking data from an API using axios
        axios.get('http://localhost:3000/echangerColis', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
        .then(response => {
            setTrackingData(response.data); // Utilisez le nom de champ correct ici
        })
        .catch(error => {
            console.error('Error fetching tracking data:', error);
        });
    }, []);

    return (
        <>
            <MiniDrawerfourisseur/>
            <div>
            <Box sx={{ padding: 1, left: 250, position: 'relative', width: 1500 }}>
                <Typography variant="h5" gutterBottom>
                    Suivi de l'échange de colis
                </Typography>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID de l'échange</TableCell>
                                    <TableCell>Colis 1</TableCell>
                                    <TableCell>Colis 2</TableCell>
                                    <TableCell>Date de l'échange</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trackingData.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{data._id}</TableCell>
                                        <TableCell>{data.colis1}</TableCell>
                                        <TableCell>{data.colis2}</TableCell>
                                        <TableCell>{data.dateEchange}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary">
                                                <PlayArrowIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
            
</div>
            
        </>
    );
};

export default SuiviEchange;
