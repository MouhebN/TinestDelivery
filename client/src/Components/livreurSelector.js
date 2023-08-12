
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FormControl, InputLabel, MenuItem, Select,Box} from "@mui/material";

const LivreurSelector = ({ onLivreurSelect }) => {
    const [livreurs, setLivreurs] = useState([]);
    const [selectedLivreur, setSelectedLivreur] = useState('');

    // Fetch the list of livreurs from the backend API
    useEffect(() => {
        axios.get(`http://localhost:3000/listerLivreurAgence`, {
            headers: {
            "x-access-token": localStorage.getItem('token')
        }})
            .then((response) => {
                setLivreurs(response.data.livreurList);
            })
            .catch((error) => {
                console.error('Error fetching livreurs:', error);
            });
    }, []);

    // Handle the livreur selection
    const handleLivreurSelect = (event) => {
        setSelectedLivreur(event.target.value);
    };

    // Call the parent component's onLivreurSelect function with the selected livreur
    useEffect(() => {
        onLivreurSelect(selectedLivreur);
    }, [selectedLivreur, onLivreurSelect]);

    return (
        <Box>
        <div>
            <FormControl  sx={{ m: 2, width: 300, mt: 0 }} >
                <InputLabel id="livreur-select-label">Choisir un livreur</InputLabel>
                <Select
                    labelId="livreur-select-label"
                    id="livreur-select"
                    value={selectedLivreur}
                    onChange={handleLivreurSelect}
                >
                    <MenuItem value="">
                        <em>Select Livreur</em>
                    </MenuItem>
                    {livreurs.map((livreur) => (
                        <MenuItem key={livreur._id} value={livreur._id}>
                            {livreur.nom}  {livreur.prenom} {/* Assuming 'name' is the property that holds the name of the livreur */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
        </Box>
    );
};

export default LivreurSelector;
