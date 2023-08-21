import React, {useState} from 'react';
import {BarcodeScanner} from '../../Components/BarcodeScanner';
import axios from 'axios';
import LivreurSelector from '../../Components/livreurSelector';
import Box from "@mui/material/Box";
import {useSnackbar} from "notistack";
import debounce from "lodash.debounce";
import {DataGrid} from "@mui/x-data-grid";
import {useEffect} from "react";
import StockAnimation from "../../Components/StockAnimation";
import MiniDrawerMagasinier from "../../Layouts/sideBarMagasinier";
import ReadyAnimation from "../../Components/ReadyAnimation";
import {Tooltip} from "@mui/material";


function AttribuerColisAuLivreur() {
    const getAuthorizedHeaders = () => ({
        headers: {
            "x-access-token": localStorage.getItem('token')
        }
    });
    const {enqueueSnackbar} = useSnackbar();
    const [showScanner, setShowScanner] = useState(false);
    const [selectedLivreur, setSelectedLivreur] = useState(null);

    const handleLivreurSelect = (selectedLivreur) => {
        setSelectedLivreur(selectedLivreur);
        setShowScanner(true);
    };

    const handleQRcodeScan = (data) => {
        const parsedData = JSON.parse(data);
        if (selectedLivreur) {
            const colisId = parsedData.id;
            const numero = parsedData.num_client;
            const livreurId = selectedLivreur;

            axios
                .post('http://localhost:3000/attribuerColis', {
                    livreurId: livreurId,
                    id: colisId,
                    numeroClient: numero
                }, getAuthorizedHeaders())
                .then((response) => {
                    console.log('Livreur updated:', response.data);
                    enqueueSnackbar('Colis added to livreur successfully', {variant: 'success'});
                })
                .catch((error) => {
                    console.error('Error updating livreur:', error);
                    if (error.response && error.response.data && error.response.data.error) {
                        // Display the backend error message in the Snackbar
                        enqueueSnackbar(error.response.data.error, {variant: 'error'});
                    } else {
                        enqueueSnackbar('Error adding Colis to livreur', {variant: 'error'});
                    }
                });
        }
    };
    const debouncedhandleQRcodeScan = debounce(handleQRcodeScan, 1000);
    const [rows, setRows] = useState([]);
    const columns = [
        {field: '_id', headerName: 'id', width: 200},
        {field: 'destination', headerName: 'Destination', width: 200},
        {field: 'num_client', headerName: 'Client Number', width: 180},
        {field: 'date_creation', headerName: 'date creation', width: 180},
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const status = params.value;
                let icon = null;
                {
                    icon = <StockAnimation/>;
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
        {field: 'retourCount', headerName: 'RetourCount', width: 200},
    ];
    useEffect(() => {
        console.log('Fetching data from the backend API...');
        // Fetch data from the backend API
        axios
            .get('http://localhost:3000/getAllColisEnStock', getAuthorizedHeaders()) // Replace with your backend API endpoint
            .then((response) => {
                const updatedRows = response.data;
                setRows(updatedRows);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <>
            <MiniDrawerMagasinier/>
            <Box sx={{marginLeft: 60}}>
                <LivreurSelector onLivreurSelect={handleLivreurSelect}/>
            </Box>
            <div style={{height: '100vh', overflow: 'auto'}}>
                {selectedLivreur && showScanner && (
                    <Box
                        component="span"
                        sx={{
                            height: 400,
                            position: "static",
                            top: 20, // Adjust the top position to add padding
                            left: 50, // Adjust the left position for horizontal alignment
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 700,
                            borderRadius: '16px',
                            borderColor: 'error.main',
                            overflow: 'auto',
                            boxShadow: 3,

                        }}
                    >
                        <BarcodeScanner onScan={debouncedhandleQRcodeScan}/>
                    </Box>
                )}

                <Box sx={{
                    position: 'static',
                    top: 20,
                    left: 550,
                    height: 400,
                    width: 900,
                    overflow: 'auto',
                    padding: '20px',
                    margin: '30px',
                    marginLeft: '250px',
                    backgroundColor: '#F5F5F5',
                    boxShadow: 8,


                }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        getRowId={(row) => row._id}
                    />
                </Box>
            </div>
        </>
    );

}

export default AttribuerColisAuLivreur;





