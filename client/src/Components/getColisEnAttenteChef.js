import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import MapAnimation from "./MapAnimation";
import Typography from "@mui/material/Typography";
import ReadyAnimation from "./ReadyAnimation";
import { Button, Tooltip, Modal } from "@mui/material";
import LivreurSelector from "../Components/livreurSelector";
import SendIcon from '@mui/icons-material/Send';


function ColisEnAttenteChef() {
    const [selectedColis, setSelectedColis] = useState(null);
    const [selectedLivreur, setSelectedLivreur] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const constructGoogleMapsUrl = (address) => {
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };
    const [enAttenteColis, setEnAttenteColis] = useState([]);
    useEffect(() => {
        axios
            .get('http://localhost:3000/getColisEnAttente', {
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
                            adresse: colis.fournisseur.adresse,
                            numero: colis.fournisseur.numero,
                        },
                    };
                });
                setEnAttenteColis(transformedResponse);
                console.log("transformedResponse",transformedResponse);
            })
            .catch((error) => {
                console.error('Error fetching "en attente" colis:', error);
            });
    }, []);
    const columns = [
        {
            field: 'fournisseur.addresse',
            headerName: 'Colis Adresse',
            width: 180,
            valueGetter: (params) => {
                const fournisseur = params.row.fournisseur;
                if (fournisseur) {
                    return `${fournisseur.adresse}`;
                }
            },
            renderCell: (params) => {
                const address = params.value;
                return (
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <MapAnimation
                            onClick={() => window.open(constructGoogleMapsUrl(address), "_blank")}
                            sx={{
                                cursor: "pointer",
                                marginRight: "10px"
                            }} // Add a pointer cursor to indicate it's clickable
                        />
                        <Typography>{address}</Typography>
                    </Box>
                );
            },
        },
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
                    return `${fournisseur.numero}`;
                }
                return '';
            },
        },
        {field: 'date_creation', headerName: 'date creation', width: 150},
        {field: 'destination', headerName: 'Destination client', width: 180},
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => {
                const status = params.value;
                let icon = null;
                {
                    icon = <ReadyAnimation/>;
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
            field: 'actions',
            headerName: '',
            width: 150,
            renderCell: (params) => (
                <div>
                    <Button variant="contained" endIcon={<SendIcon /> }onClick={() => handleAttribuerColis(params.row)}>Attribuer</Button>
                </div>
            ),
        }
    ];
    const handleAttribuerColis = (colis) => {
        setSelectedColis(colis);
        setModalOpen(true);
        setSelectedLivreur('');
    };

    const handleLivreurSelect = (selectedLivreur) => {
        setSelectedLivreur(selectedLivreur);
    };

    const handleConfirmAttribuer = () => {
        // Update the colis with the selected livreur using axios
        if (selectedColis && selectedLivreur) {
            const updatedColis = {
                colisId: selectedColis.id,
                livreurPickup: selectedLivreur,
            };
            axios
                .post(`http://localhost:3000/${selectedColis.id}/modifierColis`, updatedColis, {
                    headers: {
                        'x-access-token': localStorage.getItem('token'),
                    },
                })
                .then((response) => {
                    // Handle successful update
                    console.log('Colis updated:', response.data);
                })
                .catch((error) => {
                    console.error('Error updating colis:', error);
                })
                .finally(() => {
                    setSelectedColis(null);
                    setSelectedLivreur('');
                });

        }
        setModalOpen(false);
    };

    return (
        <Box sx={{
            position: 'static', marginLeft: '220px', overflow: 'auto', height: 500,
            width: 1100, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
        }}>
            <DataGrid rows={enAttenteColis} columns={columns} pageSize={5}/>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <LivreurSelector onLivreurSelect={handleLivreurSelect} />
                    <Button onClick={handleConfirmAttribuer}>Confirm</Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default ColisEnAttenteChef;