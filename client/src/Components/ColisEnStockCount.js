import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {TbPackages} from "react-icons/tb";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FaBox} from "react-icons/fa";

const ColisEnStockCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Fetch the number of colis en stock from the backend API
        axios
            .get('http://localhost:3000/getNumberColisEnStock',{
                headers: {
                    "x-access-token": localStorage.getItem('token')
                },
            })
            .then((response) => {
                setCount(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={2} backgroundColor="#fff" borderRadius={8} boxShadow={2} >
            <Typography variant="h6" gutterBottom>
                Nombre de colis en Stock:
            </Typography>
            <Box display="flex" alignItems="center">
                <FaBox size={30} style={{ marginRight: '8px',margin : '16px' }} />
                <Typography variant="h4">{count}</Typography>
            </Box>
        </Box>
    );
};

export default ColisEnStockCount;
