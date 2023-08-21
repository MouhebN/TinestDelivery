import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PayedAnimation from "./payedAnimation";
import ReadyAnimation from "./ReadyAnimation";
import MyLottieAnimation from "./CarAnimation";
import CancelledAnimation from "./CancelledAnimation";
import RetourAnimation from "./RetourEnStockAnimation";
import StockAnimation from "./StockAnimation";
import DoneAnimation from "./DoneAnimation";
import RetourEnStockAnimation from "./RetourEnStockAnimation";
import CarAnimation from "./CarAnimation";
import LoadingAnimation from "./LoadingAnimation";

const ColisStatusCounts = () => {
    const [statusDistribution, setStatusDistribution] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3000/getStatusData', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                setStatusDistribution(response.data);
            })
            .catch(error => {
                console.error('Error fetching colis status counts:', error);
            });
    }, []);

    const getStatusColor = (status) => {
        // Define color codes for each status
        const statusColors = {
            'en attente': '#FFD700',
            'en stock': '#82CA9D',
            'en cours': '#8884D8',
            'retour en stock': '#FF6347',
            'livré': '#00C49F',
            'en pickup': '#FFBB28',
            'annulé': '#FF6868',
            'retour au fournisseur': '#7B68EE',
            'livré et payé': '#0088FE',
            'payé': '#FF8042'
        };
        return statusColors[status] || '#CCCCCC'; // Default color
    };

    return (
        <Grid container spacing={0.5}>
            {Object.keys(statusDistribution).map((status, index) => (
                <Grid sx={{padding: '20px',boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'}} item xs={2} key={index}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 1,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: getStatusColor(status),
                            transition: 'background-color 0.3s ease-in-out',
                            cursor: 'pointer', // Add pointer cursor
                            '&:hover': {
                                boxShadow: 'inset 0 0 0 2em var(--hover)',
                                transform: 'translateY(-0.25em)',
                                backgroundColor: '#3D246C',

                            },
                        }}
                    >
                        {status === 'en attente' && <ReadyAnimation size={40} color="white" />}
                        {status === 'livré et payé' && <PayedAnimation size={40} color="white" />}
                        {status === 'en cours' && <MyLottieAnimation size={40} color="white" />}
                        {status === 'annulé' && <CancelledAnimation size={40} color="white" />}
                        {status === 'retour au fournisseur' && <RetourAnimation size={40} color="white" />}
                        {status === 'retour en stock' && <RetourEnStockAnimation size={40} color="white" />}
                        {status === 'livré' && <PayedAnimation size={40} color="white" />}
                        {status === 'en stock' && <StockAnimation size={40} color="white" />}
                        {status === 'payé' && <DoneAnimation size={40} color="white" />}
                        {status === 'en pickup' && <LoadingAnimation size={40} color="white" />}
                        <Typography variant="h6" sx={{ color: 'white', marginTop: 1 }}>
                            {status}
                        </Typography>
                        <Box sx={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginTop: 1 ,marginLeft:1  }}>
                            {statusDistribution[status]}
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default ColisStatusCounts;




