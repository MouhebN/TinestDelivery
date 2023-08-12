import React, { useState } from 'react';
import { BarcodeScanner } from '../../Components/BarcodeScanner';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Box from "@mui/material/Box";
import {Button} from "@mui/material";
import {SnackbarProvider, useSnackbar} from "notistack";
import MiniDrawerMagasinier from "../../Layouts/sideBarMagasinier";



function AjoutColis() {
    const {enqueueSnackbar}  = useSnackbar();
    const [isScanning, setIsScanning] = useState(false);
    const startScanning = () => {
        setIsScanning(true);
    };

    const stopScanning = () => {
        setIsScanning(false);
    };

    const ajouterColisAuStock = async (qrCodeData) => {
        const getAuthorizedHeaders = () => ({
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        });
        if (isScanning) {
            try {
                const jsonDataRegex = /{([^}]+)}/;
                const match = qrCodeData.match(jsonDataRegex);

                if (match) {
                    const jsonData = match[0];
                    const parsedData = JSON.parse(jsonData);
                    await enqueueSnackbar('Adding colis to stock...', {variant: 'info'});

                    axios
                        .post('http://localhost:3000/ajouterColisAuStock', {
                            id: parsedData.id,
                            fournisseur: parsedData.fournisseur,
                            destination: parsedData.destination,
                            num_client: parsedData.num_client,
                            nomClient: parsedData.nomClient,
                            prenomClient: parsedData.prenomClient,
                            date_creation: parsedData.date_creation,
                            prix: parsedData.prix,
                            hauteur: parsedData.hauteur,
                            largeur: parsedData.largeur,
                            typeDePayment: parsedData.typeDePayment,
                            typeDeColis: parsedData.typeDeColis
                        }, getAuthorizedHeaders())
                        .then((response) => {
                            console.log('Colis added to stock successfully:', response.data);
                            // Show a success snackbar when a colis is added to stock
                            stopScanning();
                            enqueueSnackbar('Colis added to stock successfully', {variant: 'success'});
                        })
                        .catch((error) => {
                            if (error.response && error.response.data && error.response.data.error) {
                                // Display the backend error message in the Snackbar
                                enqueueSnackbar(error.response.data.error, { variant: 'error' });
                            } else {
                                enqueueSnackbar('Error adding Colis to stock', { variant: 'error' });
                            }
                        });
                }
            } catch (error) {
                enqueueSnackbar('Error parsing QR code data', {variant: 'error'});
                console.error('Error parsing QR code data:', error);
            }
        }
    };
    const debouncedAjouterColisAuStock = debounce(ajouterColisAuStock, 1000);

    return (
<>
    <MiniDrawerMagasinier/>
            <SnackbarProvider maxSnack={3}>
                <div>
                    <Box
                        component="span"
                        sx={{
                            height: 350,
                            position: 'fixed',
                            top: 150,
                            left: 400,
                            width: 600,
                            p: 1,
                            border: '1px dashed grey',
                            overflow: 'hidden',
                            boxShadow: 3,
                            backgroundColor: '#D6E8DB'
                        }}
                    >
                        {!isScanning ? (
                            <Button onClick={startScanning}>Start Scanning</Button>
                        ) : (
                            <BarcodeScanner onScan={debouncedAjouterColisAuStock} />
                        )}
                    </Box>

                    {isScanning && (
                        <Box position="fixed" top={550} left={650} zIndex={2}>
                            <Button onClick={stopScanning}>Stop Scanning</Button>
                        </Box>
                    )}
                </div>
            </SnackbarProvider>
</>


    )};

export default AjoutColis;

