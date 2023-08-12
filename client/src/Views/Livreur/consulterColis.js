import {useEffect, useState} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import * as React from "react";
import {DataGrid} from "@mui/x-data-grid";
import MyLottieAnimation from "../../Components/CarAnimation";
import Typography from "@mui/material/Typography";
import MapAnimation from "../../Components/MapAnimation";
import MiniDrawerLivreur from "../../Layouts/sideBarLivreur";

const constructGoogleMapsUrl = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

function ConsulterColis() {

    const [rows, setRows] = useState([]);

    const columns = [
        {
            field: "destination",
            headerName: "Destination",
            width: 200,
            renderCell: (params) => {
                const address = params.value;
                return (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MapAnimation
                            onClick={() => window.open(constructGoogleMapsUrl(address), "_blank")}
                            sx={{ cursor: "pointer", marginRight: "10px" }} // Add a pointer cursor to indicate it's clickable
                        />
                        <Typography>{address}</Typography>
                    </Box>
                );
            },
        },
        { field: 'num_client', headerName: 'Client Number', width: 180 },
        { field: 'nomClient', headerName: 'Firstname', width: 180 },
        { field: 'prenomClient', headerName: 'Lastname', width: 180 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const status = params.value;
                {
                    return <MyLottieAnimation />;
                }}},
        { field: 'retourCount', headerName: 'RetourCount', width: 200 },
    ];
    useEffect(() => {
        console.log('Fetching data from the backend API...');
        // Fetch data from the backend API
        axios
            .get('http://localhost:3000/getLivreurColis',{
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }}) // Replace with your backend API endpoint
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
            <MiniDrawerLivreur/>
        <Box sx={{
            position: 'static', marginLeft: '259px', overflow: 'auto', height: 500,
            width: 1000, boxShadow: 3, backgroundColor: '#F5F5F5'
        }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
            />
        </Box>
        </>
    );
}

export default ConsulterColis;
