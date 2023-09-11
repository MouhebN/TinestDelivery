import React from 'react';
import Typography from '@mui/material/Typography';

const ColisInfo = ({ data }) => {
    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Profil
            </Typography>
            <Typography variant="body1">
                Date de création: {data.profil.date_creation}
            </Typography>
            <Typography variant="body1">Fournisseur: {data.profil.fournisseur}</Typography>
            {/* Add other profile fields as needed */}
            <br />
            <Typography variant="h5" gutterBottom>
                Client
            </Typography>
            <Typography variant="body1">Email: {data.client.email}</Typography>
            <Typography variant="body1">Adresse: {data.client.adresse}</Typography>
            {/* Add other client fields as needed */}
            <br />
            <Typography variant="h5" gutterBottom>
                Colis
            </Typography>
            <Typography variant="body1">Prix: {data.colis.prix}</Typography>
            <Typography variant="body1">Moyen de paiement: {data.profil.typeDePayment}</Typography>
            {/* Add other colis fields as needed */}
        </div>
    );
};

export default ColisInfo;