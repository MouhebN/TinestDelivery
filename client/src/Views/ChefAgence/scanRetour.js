import Box from "@mui/material/Box";
import {Button} from "@mui/material";
import {BarcodeScanner} from "../../Components/BarcodeScanner";
import React, {useState} from "react";
import axios from 'axios';
import debounce from 'lodash.debounce';
import {useSnackbar} from "notistack";
import MiniDrawerMagasinier from "../../Layouts/sideBarMagasinier";
import MiniDrawerChefAgence from "../../Layouts/sideBarChefAgence";

// eslint-disable-next-line

function RetourColisAuStockChef() {
    const {enqueueSnackbar} = useSnackbar();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedQRCodes, setScannedQRCodes] = useState([]);

    const startScanning = () => {
        setIsScanning(true);
    };

    const stopScanning = () => {
        setIsScanning(false);
    };

    const retourColis = (qrCodeData) => {
        const getAuthorizedHeaders = () => ({
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        });
        if (isScanning) {
            try {
                const parsedData = JSON.parse(qrCodeData);
                if (!scannedQRCodes.includes(parsedData.qr_code)) {
                    setScannedQRCodes([...scannedQRCodes, parsedData.qr_code]); // Add the QR code to the scanned list
                    axios
                        .post('http://localhost:3000/retournerColis', {
                            id: parsedData.id,
                        }, getAuthorizedHeaders())
                        .then((response) => {
                            console.log('Colis retour added to stock successfully:', response.data);
                            enqueueSnackbar('Colis retour au stock registred successfully', {variant: 'success'});

                            stopScanning();
                            // Show the notification here (you can use a library like react-toastify)
                            // Example: showToast('Colis added to stock successfully');
                        })
                        .catch((error) => {

                            if (error.response && error.response.data && error.response.data.error) {
                                // Display the backend error message in the Snackbar
                                enqueueSnackbar(error.response.data.error, {variant: 'error'});
                            } else {
                                enqueueSnackbar('Error returning colis to stock', {variant: 'error'});
                            }
                        });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const debouncedRetourColis = debounce(retourColis, 1000);

    return (
        <body>
        <MiniDrawerChefAgence/>
        <Box
            component="div"
            sx={{
                height: 350,
                top: 150,
                left: 400,
                width: 600,
                p: 1,
                border: '1px dashed grey',
                overflow: 'hidden', // Clip the content that overflows the box
                boxShadow: 3,
                backgroundColor: '#D6E8DB',
                position: 'fixed',
            }}
        >
            {!isScanning ? (
                <Button onClick={startScanning}>SCAN COLIS RETOUR </Button>
            ) : (
                <BarcodeScanner onScan={debouncedRetourColis}/>
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
        </body>

    );
}

export default RetourColisAuStockChef;