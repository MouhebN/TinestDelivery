import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import MapAnimation from "./MapAnimation";
import Typography from "@mui/material/Typography";
import ReadyAnimation from "./ReadyAnimation";
import StockAnimation from "./StockAnimation";
import MyLottieAnimation from "./CarAnimation";
import RetourAnimation from "./RetourEnStockAnimation";
import DoneAnimation from "./DoneAnimation";
import CancelledAnimation from "./CancelledAnimation";
import PayedAnimation from "./payedAnimation";
import PickupAnimation from "./EnpickUpAnimation";
import {Tooltip} from "@mui/material";

function ColisEnAttenteChef() {
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
            headerName: 'colis adresse',
            width: 200,
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
            width: 150,
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
        }

    ];


    return (
        <Box sx={{
            position: 'static', marginLeft: '259px', overflow: 'auto', height: 500,
            width: 1000, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
        }}>
            <DataGrid rows={enAttenteColis} columns={columns} pageSize={5}/>
        </Box>
    );
}

export default ColisEnAttenteChef;