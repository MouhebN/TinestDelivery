import React, { useState } from 'react';
import axios from 'axios';
import ModifierColis from './ColisEdit';

const ColisImprimer = ({ colis }) => {
    const [editedColis, setEditedColis] = useState({ ...colis });

    const handleSubmitModification = async () => {
        try {
            // Make an API call to update the editedColis on the server
            const response = await axios.post(
                `http://localhost:3000//${editedColis._id}/modifierColis`,  editedColis, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    },
                });

            // Assuming the update is successful, update the editedColis state
            setEditedColis(response.data);

            // You can also show a success message if needed
            console.log('Colis mis à jour:', response.data);
        } catch (error) {
            console.error('Erreur lors de la modification du colis:', error);
        }
    };

    return (
        <div className="colis-imprimer">
            <h2>Modifier le colis pour impression</h2>
            <ModifierColis
                colis={editedColis}
                onSave={handleSubmitModification}
                onCancel={() => {
                    // Handle cancel action if needed
                }}
            />
        </div>
    );
};

export default ColisImprimer;