import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import LivreurSelector from '../../Components/livreurSelector';
import { DataGrid } from '@mui/x-data-grid';
import MiniDrawerChefAgence from "../../Layouts/sideBarChefAgence";
import {FcMoneyTransfer} from "react-icons/fc";
import {useEffect} from "react";
import {styled} from "@mui/material/styles";
import { calculateTotalAmountForLivreur } from '../../Components/totalAmountCalculator';
import {FaBox} from "react-icons/fa";
import {updateColisStatus} from "../../Components/UpdateColisStatus";
import {Button} from "@mui/material";

function GetLivreurAmount() {
    const [totalAmount, setTotalAmount] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [selectedLivreur, setSelectedLivreur] = useState(null);
    const [livredColis, setLivredColis] = useState([]);
    const [livredColisCount, setLivredColisCount] = useState(0); // Initialize with 0
    const [livredColisRetour, setLivredColisRetour] = useState(0); // Initialize with 0

    const handleLivreurSelect = (selectedLivreur) => {
        setSelectedLivreur(selectedLivreur);
    };
    useEffect(() => {
        if (selectedLivreur) {
            fetchLivreurLivredColis(selectedLivreur);
        } else {
            setLivredColis([]);
        }
    }, [selectedLivreur]);


    const fetchLivreurLivredColis = (livreurId) => {
        axios
            .get('http://localhost:3000/getLivreurLivredColis', {
                params: { livreurId }
                , headers: {
            "x-access-token": localStorage.getItem('token')
        }}
    )
            .then((response) => {
                console.log('Livreur livré colis:', response.data);
                const transformedResponse = response.data.map(colis => {
                    return {
                        ...colis,
                        id: colis._id,
                        fournisseur: {
                            nom: colis.fournisseur.nom,
                            adresse: colis.fournisseur.adresse,
                            numero: colis.fournisseur.numero,
                        },
                    };
                });
                setLivredColis(transformedResponse);
            })
            .catch((error) => {
                console.error('Error fetching livreur livré colis:', error);
                enqueueSnackbar('Error fetching livreur livré colis', { variant: 'error' });
            });
    };
    const handleUpdateColisStatus = async () => {
        const selectedColisIds = livredColis.map(colis => colis.id); // Assuming 'id' is the property holding the colis ID
        try {
            await updateColisStatus(selectedColisIds);
            enqueueSnackbar(' approving livreur livred colis done', { variant: 'success' });
        } catch (error) {
            console.error('Error approving livreur livré colis:', error);
            enqueueSnackbar('Error approving livreur livred colis', { variant: 'error' });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID COlis', width: 180 },
        {
            field: 'fournisseur.nom',
            headerName: 'Fournisseur nom',
            width: 150,
            valueGetter: (params) => {
                const fournisseur = params.row.fournisseur;
                if (fournisseur) {
                    return `${fournisseur.nom}`;
                }
                return '';
            },
        },
        { field: 'prix', headerName: 'Prix', width: 150 },
        { field: 'num_client', headerName: 'Client Number', width: 150 },
        {field: 'dateLivraison', headerName: 'dateLivraison', width: 150},
        { field: 'date_creation', headerName: 'Date Creation', width: 150 },
        { field: 'retourCount', headerName: 'RetourCount', width: 150 },
    ];
    const Div = styled('div')(({theme}) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
    }));
    useEffect(() => {
        if (selectedLivreur) {
            const fetchTotalAmount = async () => {
                const calculatedTotalAmount = await calculateTotalAmountForLivreur(selectedLivreur);
                setTotalAmount(calculatedTotalAmount);
            };

            fetchTotalAmount();
        }
    }, [selectedLivreur]);
    useEffect(() => {
        // Filter rows to count "livré" colis with retourCount = 0
        const filteredLivredColisretour = livredColis.filter(livredColis => livredColis.status === 'livré' && livredColis.retourCount === !0);

        // Set the count of "livré" colis with retourCount = 0
        setLivredColisRetour(filteredLivredColisretour.length);
    }, [livredColis]);
    useEffect(() => {
        // Filter rows to count "livré" colis with retourCount = 0
        const filteredLivredColis = livredColis.filter(livredColis => livredColis.status === 'livré' && livredColis.retourCount === 0);

        // Set the count of "livré" colis with retourCount = 0
        setLivredColisCount(filteredLivredColis.length);
    }, [livredColis]);

    return (
        <>
            <MiniDrawerChefAgence/>
            <Box sx={{ marginLeft: 70 ,marginBottom: '100px'}}>
                <LivreurSelector onLivreurSelect={handleLivreurSelect}  />
            </Box>
            <Box sx={{
                position: 'static', marginLeft: '259px', overflow: 'auto', height: 500,
                width: 1000, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
            }}>
            <DataGrid rows={livredColis} columns={columns} pageSize={5} checkboxSelection />
            </Box>
                <Button
                    onClick={handleUpdateColisStatus}
                    sx={{
                        marginTop: '20px', // Add some spacing between the DataGrid and the button
                        backgroundColor: '#4caf50', // Change button background color
                        color: 'white', // Change text color
                        padding: '10px 20px', // Adjust padding
                        borderRadius: '4px', // Add border radius
                        cursor: 'pointer', // Change cursor style on hover
                        width: 300,
                        '&:hover': {
                            backgroundColor: '#45a049', // Change background color on hover
                        },
                        position: 'static', marginLeft: '600px', overflow: 'auto',boxShadow: 3,marginBottom: '100px',
                    }}
                >
                    APPROVE
                </Button>
            <Box display="flex" flexDirection="column" alignItems="center" p={3} backgroundColor="#fff" borderRadius={8}
                 boxShadow={2} marginBottom={1}>

                <Box display="flex" alignItems="center">
                    <FaBox size={30} style={{marginRight: '8px', margin: '16px'}}/>
                    <Div variant="h4"> Nombre de Colis Livré la premiere fois : {livredColisCount} :
                        Total amount: {livredColisCount * 7} Dinar
                    </Div>
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" p={2} backgroundColor="#fff" borderRadius={8}
                 boxShadow={2} marginBottom={1}>

                <Box display="flex" alignItems="center">
                    <FaBox size={30} style={{marginRight: '8px', margin: '16px'}}/>
                    <Div variant="h4"> Nombre de Colis retour Livré : {livredColisRetour} : Total
                        amount: {livredColisRetour * 5} Dinar</Div>
                </Box>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" p={2} backgroundColor="#fff" borderRadius={8}
                 boxShadow={2} marginBottom={1}>

                <Box display="flex" alignItems="center">
                    <FcMoneyTransfer size={30} style={{marginRight: '8px', margin: '16px'}}/>
                    <Div variant="h4">Total Amount: {totalAmount} Dinar</Div>
                </Box>
            </Box>
        </>
    );
}

export default GetLivreurAmount;
