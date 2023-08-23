import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import StockAnimation from "./StockAnimation";
import MyLottieAnimation from "./CarAnimation";
import RetourAnimation from "./RetourEnStockAnimation";
import DoneAnimation from "./DoneAnimation";
import CancelledAnimation from "./CancelledAnimation";
import PayedAnimation from "./payedAnimation";
import PickupAnimation from "./EnpickUpAnimation";
import {Button, TextField, Tooltip} from "@mui/material";
import ColisDetailsModal from "./ColisDetailsModal";

const ColisAgenceChef = () => {
    const [agenceColis, setAgenceColis] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(agenceColis);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedColis, setSelectedColis] = useState(null);

    const handleOpenModal = (colis) => {
        setSelectedColis(colis);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedColis(null);
        setModalOpen(false);
    };

    const constructGoogleMapsUrl = (address) => {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };

    useEffect(() => {
        axios
            .get('http://localhost:3000/getColisAgence', {
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                },
            })
            .then((response) => {
                const transformedResponse = response.data.map(colis => {
                    return {
                        ...colis,
                        id: colis._id,
                        fournisseur: {
                            nom: colis.fournisseur.nom,
                            address: colis.fournisseur.address,
                            telephone: colis.fournisseur.telephone,
                        },
                        livreur: {
                            nom: colis.livreur.nom,
                        },
                        livreurPickup: {
                            nom: colis.livreurPickup.nom,
                        },
                    };
                });
                setAgenceColis(transformedResponse);
                console.log("transformedResponse", transformedResponse);
            })
            .catch((error) => {
                console.error('Error fetching "en attente" colis:', error);
            });
    }, []);
    useEffect(() => {

        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = agenceColis.filter(row =>
            row.nomClient.toLowerCase().includes(lowerCaseQuery) ||
            row.status.toLowerCase().includes(lowerCaseQuery) ||
            row.prix.toString().includes(lowerCaseQuery) ||
            row.fournisseur.nom.toLowerCase().includes(lowerCaseQuery) ||
            row.prenomClient.toLowerCase().includes(lowerCaseQuery) ||
            row.destination.toLowerCase().includes(lowerCaseQuery)
        );
        console.log('Filtered data:', filtered);
        setFilteredData(filtered);
    }, [searchQuery, agenceColis]);


    const columns = [
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
        }, {
            field: 'fournisseur.numero',
            headerName: 'Fournisseur numero',
            width: 150,
            valueGetter: (params) => {
                const fournisseur = params.row.fournisseur;
                if (fournisseur) {
                    return `${fournisseur.telephone}`;
                }
                return '';
            },
        },
        {field: 'nomClient', headerName: 'nom client', width: 100},
        {field: 'prenomClient', headerName: 'prenom client', width: 100},
        {field: 'destination', headerName: 'Destination client', width: 180},
        {field: 'prix', headerName: 'prix ', width: 180},
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const status = params.value;
                let icon = null;
                if (status === 'en stock') {
                    icon = <StockAnimation/>;
                } else if (status === 'en cours') {
                    icon = <MyLottieAnimation/>;
                } else if (status === 'retour en stock') {
                    icon = <RetourAnimation/>;
                } else if (status === 'payé') {
                    icon = <DoneAnimation/>;
                } else if (status === 'annulé') {
                    icon = <CancelledAnimation/>;
                } else if (status === 'livré et payé') {
                    icon = <PayedAnimation/>;
                } else if (status === 'en pickup') {
                    icon = <PickupAnimation/>;
                } else {
                    return status;
                }
                return (
                    <Tooltip title={status} placement="top"> {/* Add a tooltip with the status */}
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            {icon}
                        </Box>
                    </Tooltip>
                );
            },
        },
        {
            field: 'actions', // A unique field name for the "More" button column
            headerName: '', // No header text for the column
            width: 100,
            renderCell: (params) => (
                <Button onClick={() => handleOpenModal(params.row)}>More</Button>
            ),
        }
    ];
    return (
        <Box sx={{
            position: 'static', marginLeft: '259px', overflow: 'auto', height: 500,
            width: 1000, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
        }}>
            <TextField
                label="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
            />
            <DataGrid rows={filteredData} columns={columns} ypageSize={5}/>

            {/* Modal for detailed information */}
            <ColisDetailsModal isOpen={modalOpen} onClose={handleCloseModal} colis={selectedColis}/>
        </Box>
    );
}
export default ColisAgenceChef;

