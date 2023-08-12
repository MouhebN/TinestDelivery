import React, {useState} from 'react';
import {BarcodeScanner} from '../../Components/BarcodeScanner';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Box from "@mui/material/Box";
import {Button} from "@mui/material";
import {SnackbarProvider, useSnackbar} from "notistack";
import MiniDrawerLivreur from "../../Layouts/sideBarLivreur";


function PaymentColisClient() {
    const {enqueueSnackbar} = useSnackbar();
    const [isScanning, setIsScanning] = useState(false);
    const startScanning = () => {
        setIsScanning(true);
    };

    const stopScanning = () => {
        setIsScanning(false);
    };

    const payementColis = async (qrCodeData) => {
        if (isScanning) {
            try {
                const jsonDataRegex = /{([^}]+)}/;
                const match = qrCodeData.match(jsonDataRegex);

                if (match) {
                    const jsonData = match[0];
                    const parsedData = JSON.parse(jsonData);
                    await enqueueSnackbar('payement colis en cours...', {variant: 'info'});

                    axios
                        .post('http://localhost:3000/payementColis', {
                            id: parsedData.id,
                        }, {
                            headers: {
                                "x-access-token": localStorage.getItem('token')
                            }

                        })
                        .then((response) => {
                            console.log('Colis payé:', response.data);
                            // Show a success snackbar when a colis is added to stock
                            stopScanning();
                            enqueueSnackbar('Colis payé', {variant: 'success'});
                        })
                        .catch((error) => {
                            if (error.response && error.response.data && error.response.data.error) {
                                // Display the backend error message in the Snackbar
                                enqueueSnackbar(error.response.data.error, {variant: 'error'});
                            } else {
                                enqueueSnackbar('Erreur payment ', {variant: 'error'});
                            }
                        });
                }
            } catch (error) {
                enqueueSnackbar('Error parsing QR code data', {variant: 'error'});
                console.error('Error parsing QR code data:', error);
            }
        }
    };
    const debouncedAjouterColisAuStock = debounce(payementColis, 1000);
    return (
        <>
            <MiniDrawerLivreur/>
            <SnackbarProvider maxSnack={3}>
                <div>

                    {/* QR code scanning zone */}
                    <Box
                        component="span"
                        sx={{
                            height: 350,
                            position: "fixed",
                            top: 150,
                            left: 400,
                            width: 600,
                            p: 1,
                            border: '1px dashed grey',
                            overflow: 'hidden', // Clip the content that overflows the box
                            boxShadow: 3,
                            backgroundColor: '#D6E8DB'
                        }}
                    >
                        {!isScanning ? (
                            <Button onClick={startScanning}>Start Scanning Colis </Button>
                        ) : (
                            <BarcodeScanner onScan={debouncedAjouterColisAuStock}/>
                        )}
                    </Box>

                    {/* "Stop Scanning" button outside the scanning zone */}
                    {isScanning && (
                        <Box
                            position="fixed"
                            top={550}
                            left={650}
                            zIndex={2} // Set a higher z-index to keep it on top of the scanning zone
                        >
                            <Button onClick={stopScanning}>Stop Scanning</Button>
                        </Box>
                    )}
                </div>
            </SnackbarProvider>
        </>
    );
};

export default PaymentColisClient;

