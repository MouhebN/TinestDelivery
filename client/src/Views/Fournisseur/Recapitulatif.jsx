import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Recapitulatif = ({ colisData }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Récapitulatif
                </Typography>
                {/* Affichez ici les données du colis à partir de l'objet colisData */}
                <Typography>Date de création : {colisData.profil.date_creation}</Typography>
                <Typography>Fournisseur : {colisData.profil.fournisseur}</Typography>
                <Typography>Livreur : {colisData.profil.livreur}</Typography>
                <Typography>Téléphone : {colisData.profil.num_client2}</Typography>
                <Typography>Adresse : {colisData.profil.adresse}</Typography>
                <Typography>Code Postale : {colisData.profil.codepostale}</Typography>
                <Typography>Gouvernorate : {colisData.profil.Gouvernorate}</Typography>
                <Typography>Destination : {colisData.profil.destination}</Typography>

                <Typography>Email client : {colisData.client.email}</Typography>
                <Typography>Adresse : {colisData.client.adresse}</Typography>
                <Typography>Code Postal : {colisData.client.codepostale}</Typography>
                <Typography>Gouvernorate : {colisData.client.Gouvernorate}</Typography>
                <Typography>Téléphone 1 : {colisData.client.num_client1}</Typography>
                <Typography>Téléphone 2 : {colisData.client.num_client2}</Typography>

                <Typography>Prix du colis : {colisData.colis.prix}</Typography>
                <Typography>Moyen de paiement : {colisData.colis.typeDePayment}</Typography>
                <Typography>Hauteur : {colisData.colis.hauteur}</Typography>
                <Typography>Largeur : {colisData.colis.largeur}</Typography>
                <Typography>Status : {colisData.colis.status}</Typography>
            </Paper>

            <Button variant="contained" onClick={handlePrint}>
                Imprimer
            </Button>
        </div>
    );
};

export default Recapitulatif;