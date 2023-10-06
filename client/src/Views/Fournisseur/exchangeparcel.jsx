import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MiniTiroirFournisseur from "../../Layouts/sideBarFournisseur";
import axios from 'axios';

const EchangeColis = () => {
    const [colisIds, setColisIds] = useState({
        colisId1: '',
        colisId2: '',
    });

    const [echangeReussi, setEchangeReussi] = useState('');
    const [detailsEchange, setDetailsEchange] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setColisIds({ ...colisIds, [name]: value });
    };

    const handleEchangeColis = () => {
        // Effectuez la requête POST vers le serveur pour effectuer l'échange de colis
        axios.post('http://localhost:3000/echangerColis', colisIds, {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
        .then((response) => {
            // Traitez la réponse du serveur
            console.log('Échange de colis réussi !');
    
            // Vérifiez si "details" existe dans la réponse
            if (response.data.details) {
                // Mise à jour de l'état avec les détails de l'échange réussi
                setEchangeReussi('Échange de colis réussi !');
                setDetailsEchange(response.data.details);
                // Affichez une alerte avec le message
                alert('Colis échangé');
            }
            else {
                // Si la réponse ne contient pas de détails, affichez une alerte générique
                alert('Échange de colis réussi !');
            }

        })
        .catch((error) => {
            // Traitez les erreurs
            console.error('Erreur lors de l\'échange de colis :', error);
    
            // Réinitialisez l'état en cas d'erreur
            setEchangeReussi('');
            setDetailsEchange([]);
        });
    };

    return (
        <>
            <MiniTiroirFournisseur />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: 1, left: 250, position: 'relative', width: 1500 }}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Détails Colis 1
                    </Typography>
                    <TextField
                        label="Colis 1 ID"
                        name="colisId1"
                        value={colisIds.colisId1}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Paper>

                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Détails Colis 2
                    </Typography>
                    <TextField
                        label="Colis 2 ID"
                        name="colisId2"
                        value={colisIds.colisId2}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Paper>

                <Paper elevation={3} sx={{ padding: 2, gridColumn: 'span 3' }}>
                    <Typography variant="h5" gutterBottom>
                        Description du Colis
                    </Typography>
                    {/* Vous pouvez ajouter ici d'autres champs pour la description du colis si nécessaire */}
                    <Button variant="contained" onClick={handleEchangeColis}>
                        Échanger le Colis
                    </Button>
                </Paper>

                {echangeReussi && (
                    <Paper elevation={3} sx={{ padding: 2, gridColumn: 'span 3' }}>
                        <Typography variant="h5" gutterBottom>
                            Détails de l'échange
                        </Typography>
                        <table>
                            <thead>
                                <tr>
                                    <th>Colis 1</th>
                                    <th>Colis 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailsEchange.map((detail, index) => (
                                    <tr key={index}>
                                        <td>{detail.colis1Detail}</td>
                                        <td>{detail.colis2Detail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Paper>
                )}
            </Box>
            
        </>
    );
};

export default EchangeColis;
