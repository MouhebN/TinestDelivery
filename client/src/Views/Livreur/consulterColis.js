import {useEffect, useState} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import * as React from "react";
import {DataGrid} from "@mui/x-data-grid";
import MyLottieAnimation from "../../Components/CarAnimation";
import Typography from "@mui/material/Typography";
import MapAnimation from "../../Components/MapAnimation";
import MiniDrawerLivreur from "../../Layouts/sideBarLivreur";
import {styled} from "@mui/material/styles";
import {FaBox} from "react-icons/fa";
import PayedAnimation from "../../Components/payedAnimation";
import {FcMoneyTransfer} from "react-icons/fc";
import ColisEnAttenteLivreur from "../../Components/colisEnAttenteLivreur";

const constructGoogleMapsUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

function ConsulterColis() {
    const [totalAmount, setTotalAmount] = useState(0); // Initialize total amount with 0
    const [rows, setRows] = useState([]);
    const [livredColis, setLivredColis] = useState([]);
    const [livredColisCount, setLivredColisCount] = useState(0); // Initialize with 0
    const [livredColisRetour, setLivredColisRetour] = useState(0); // Initialize with 0
    useEffect(() => {
        // Filter rows to count "livré" colis with retourCount = 0
        const filteredLivredColisretour = livredColis.filter(livredColis => livredColis.status === 'livré' && livredColis.retourCount === !0);

        // Set the count of "livré" colis with retourCount = 0
        setLivredColisRetour(filteredLivredColisretour.length);
    }, [livredColis]);
    // retourcount = 0
    useEffect(() => {
        // Filter rows to count "livré" colis with retourCount = 0
        const filteredLivredColis = livredColis.filter(livredColis => livredColis.status === 'livré' && livredColis.retourCount === 0);

        // Set the count of "livré" colis with retourCount = 0
        setLivredColisCount(filteredLivredColis.length);
    }, [livredColis]);
    useEffect(() => {
        console.log('Fetching "livré" colis from the backend API...');
        axios
            .get('http://localhost:3000/LivreurColisLivre', {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            })
            .then((response) => {
                const updatedLivredColis = response.data;

                // Update the data with a unique id property
                const colisWithId = updatedLivredColis.map((colis) => ({...colis, id: colis._id}));
                setLivredColis(colisWithId);
            })
            .catch((error) => {
                console.error('Error fetching "livré" colis:', error);
            });
    }, []);
    useEffect(() => {
        console.log('Fetching total amount from the backend API...');
        // Fetch total amount from the backend API
        axios
            .get('http://localhost:3000/LivreurAmount', {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            })
            .then((response) => {
                const calculatedTotalAmount = response.data.totalAmount;
                setTotalAmount(calculatedTotalAmount); // Update total amount
            })
            .catch((error) => {
                console.error('Error fetching total amount:', error);
            });
    }, []);
    const columnsLivred = [
        {
            field: "destination",
            headerName: "Destination",
            width: 220,
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
        {field: 'num_client', headerName: 'Client Number', width: 150},
        {field: 'nomClient', headerName: 'Firstname', width: 150},
        {field: 'prenomClient', headerName: 'Lastname', width: 150},
        {field: 'dateLivraison', headerName: 'dateLivraison', width: 150},
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const status = params.value;
                {
                    return <PayedAnimation/>;
                }
            }
        },
        {field: 'retourCount', headerName: 'RetourCount', width: 100},


    ];
    const columns = [
        {
            field: "destination",
            headerName: "Destination",
            width: 200,
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
        {field: 'num_client', headerName: 'Client Number', width: 180},
        {field: 'nomClient', headerName: 'Firstname', width: 180},
        {field: 'prenomClient', headerName: 'Lastname', width: 180},
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const status = params.value;
                {
                    return <MyLottieAnimation/>;
                }
            }
        },
        {field: 'retourCount', headerName: 'RetourCount', width: 200},
    ];
    useEffect(() => {
        console.log('Fetching data from the backend API...');
        // Fetch data from the backend API
        axios
            .get('http://localhost:3000/getLivreurColis', {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            }) // Replace with your backend API endpoint
            .then((response) => {
                const updatedRows = response.data;
                setRows(updatedRows);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const Div = styled('div')(({theme}) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
    }));
    return (
        <>
            <MiniDrawerLivreur/>
            <Div mt={2} sx={{marginBottom: '100px', position: 'static', marginLeft: '259px', marginRight: '100px',overflow: 'auto',backgroundColor:'#ECF2FF'}}>Liste de
                Colis en attente a livrer:</Div>
            <ColisEnAttenteLivreur />

            <Div mt={2} sx={{marginBottom: '100px', position: 'static', marginLeft: '259px', marginRight: '100px',overflow: 'auto',backgroundColor:'#ECF2FF'}}>Liste de
                Colis a livré :</Div>
            <Box sx={{
                position: 'static', marginLeft: '259px', overflow: 'auto', height: 500,
                width: 1000, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                />
            </Box>
            <Div mt={2} sx={{marginBottom: '100px', position: 'static', marginLeft: '259px',marginRight: '100px', overflow: 'auto',backgroundColor:'#ECF2FF'}}>Liste de
                Colis livré :</Div>
            <Box sx={{
                position: 'static', marginLeft: '259px', overflow: 'auto', height: 500,
                width: 1000, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '200px',
            }}>

                <DataGrid
                    rows={livredColis}
                    columns={columnsLivred}
                    pageSize={5}
                />
            </Box>
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

export default ConsulterColis;
