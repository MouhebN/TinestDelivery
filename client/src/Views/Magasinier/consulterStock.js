import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {darken, Grid, lighten} from "@mui/material";
import ColisEnStockCount from "../../Components/ColisEnStockCount";
import ColisEnCoursCount from "../../Components/ColisEnCourCount";
import ColisEnRetourCount from "../../Components/ColisRetourEnStock";
import MyLottieAnimation from '../../Components/CarAnimation';
import StockAnimation from "../../Components/StockAnimation";
import DoneAnimation from "../../Components/DoneAnimation";
import CancelledAnimation from "../../Components/CancelledAnimation";
import RetourAnimation from "../../Components/RetourEnStockAnimation";
import LoadingAnimation from "../../Components/LoadingAnimation";
import MiniDrawerMagasinier from "../../Layouts/sideBarMagasinier";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    '& .super-app-theme--en-stock': {

        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#3f51b5', 0.6) : lighten('#3f51b5', 0.6),
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#3f51b5', 0.5) : lighten('#3f51b5', 0.5),
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? darken('#3f51b5', 0.4) : lighten('#3f51b5', 0.4),
            },
        },
    },
    '& .super-app-theme--en-cours': {

        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#9e9e9e', 0.6) : lighten('#9e9e9e', 0.6),
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#9e9e9e', 0.5) : lighten('#9e9e9e', 0.5),
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? darken('#9e9e9e', 0.4) : lighten('#9e9e9e', 0.4),
            },
        },
    },
    '& .super-app-theme--retour-en-stock': {

        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#f44336', 0.6) : lighten('#f44336', 0.6),
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#f44336', 0.5) : lighten('#f44336', 0.5),
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? darken('#f44336', 0.4) : lighten('#f44336', 0.4),
            },
        },
    },
    '& .super-app-theme--payé': {

        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#4caf50', 0.6) : lighten('#4caf50', 0.6),
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#4caf50', 0.5) : lighten('#4caf50', 0.5),
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? darken('#4caf50', 0.4) : lighten('#4caf50', 0.4),
            },
        },
    },
    '& .super-app-theme--annulé': {

        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#331D2C', 0.6) : lighten('#331D2C', 0.6),
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' ? darken('#331D2C', 0.5) : lighten('#331D2C', 0.5),
            '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? darken('#331D2C', 0.4) : lighten('#331D2C', 0.4),
            },
        },
    },
}));

function ConsulterStock() {
    const [rows, setRows] = useState([]);
    const CustomLivreurCell = ({value}) => {
        const livreur = value;
        if (!livreur) {
            // If there is no livreur, return the animated icon using MyLottieAnimation
            return <LoadingAnimation/>;
        }
        // If there is a livreur, return the nom and prenom as before
        return `${livreur.nom} ${livreur.prenom}`;
    };
    const columns = [
        {field: 'destination', headerName: 'Destination', width: 200},
        {field: 'num_client', headerName: 'Client Number', width: 180},
        {field: 'date_creation', headerName: 'date creation', width: 180},
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const status = params.value;
                if (status === 'en stock') {
                    return <StockAnimation/>;
                } else if (status === 'en cours') {
                    return <MyLottieAnimation/>;
                } else if (status === 'retour en stock') {
                    return <RetourAnimation/>;
                } else if (status === 'payé') {
                    return <DoneAnimation/>;
                } else if (status === 'annulé') {
                    return <CancelledAnimation/>;
                } else {
                    return null;
                }
            },
        },
        {
            field: 'livreur',
            headerName: 'Livreur',
            width: 200,
            renderCell: (params) => <CustomLivreurCell value={params.value}/>, // Use the CustomLivreurCell component
        },
        {field: 'retourCount', headerName: 'RetourCount', width: 200},
    ];
    useEffect(() => {
        axios
            .get('http://localhost:3000/getStockColis', {
                headers: {
                    "x-access-token": localStorage.getItem('token') // Include the token in the Authorization header
                }
            })
            .then((response) => {
                // Map and rename the _id property to id for each row
                const updatedRows = response.data.map((row) => ({...row, id: row._id}));
                // Update the rows state with the updated data
                setRows(updatedRows);

                // Extract unique Livreur IDs from the rows and filter out "none" and undefined values
                const uniqueLivreurIds = [
                    ...new Set(updatedRows.map((row) => row.livreur).filter((livreur) => livreur !== undefined))
                ];
                console.log('Unique Livreur IDs:', uniqueLivreurIds); // Log the unique Livreur IDs

                // Fetch Livreur data for all unique Livreur IDs
                axios
                    .get('http://localhost:3000/getMultipleLivreur', {
                        headers: {
                            "x-access-token": localStorage.getItem('token')
                        },
                        params: {ids: uniqueLivreurIds}
                    })
                    .then((response) => {
                        const livreursData = response.data;
                        console.log('Fetched Livreur data:', livreursData); // Log the fetched Livreur data

                        // Organize Livreur data as an object with Livreur IDs as keys
                        const livreursMap = {};
                        livreursData.forEach((livreur) => {
                            livreursMap[livreur._id] = livreur;
                        });

                        // Update the rows with Livreur data
                        const rowsWithLivreurData = updatedRows.map((row) => ({
                            ...row,
                            livreur: row.livreur !== undefined ? livreursMap[row.livreur] || null : null,
                        }));
                        console.log('Rows with Livreur data:', rowsWithLivreurData); // Log the rows with Livreur data
                        setRows(rowsWithLivreurData);
                    })
                    .catch((error) => {
                        console.error('Error fetching Livreur data:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    return (
        <>
            <MiniDrawerMagasinier/>
            <Box sx={{
                position: 'static', marginLeft: '200px', overflow: 'auto', height: 500,
                width: 1050, boxShadow: 3, backgroundColor: '#F5F5F5'
            }}>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    getRowClassName={(params) => `super-app-theme--${params.row.status.replace(/\s+/g, '-').toLowerCase()}`}
                    disableSelectionOnClick
                    hideScrollbar={true}
                />
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', margin: '150px', marginLeft: '200px'}}>
                <Box sx={{height: 200, width: 300, padding: '20px'}}>
                    <ColisEnStockCount/>
                </Box>
                <Box sx={{height: 200, width: 300, padding: '20px'}}>
                    <ColisEnCoursCount/>
                </Box>
                <Box sx={{height: 200, width: 300, padding: '20px'}}>
                    <ColisEnRetourCount/>
                </Box>
            </Box>
        </>
    );
}

export default ConsulterStock;
