import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem  } from '@mui/material';

const EditColis = ({ colis, onSaveChanges, onClose }) => {  // Créez un état local pour gérer les modifications des champs du colis
  const [editedColis, setEditedColis] = useState({
    nomClient: colis.nomClient || '',
    prenomClient: colis.prenomClient || '',
    num_client: colis.num_client || '',
    fragile: colis.fragile || false, // Utilisation de false par défaut pour le champ fragile
    status: colis.status || '',
    prix: colis.prix || '',
    typeDePayment: colis.typeDePayment || '',
    hauteur: colis.hauteur || '',
    largeur: colis.largeur || '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Gérer les champs de formulaire de type 'checkbox' séparément
    const inputValue = type === 'checkbox' ? checked : value;
    setEditedColis({ ...editedColis, [name]: inputValue });
  };

  const handleSaveChanges = () => {
    onSaveChanges(editedColis, colis.id);
    onClose();
  };
  
  

  return (
    <div>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Modifier le colis</DialogTitle>
        <DialogContent>
        <TextField
            name="status"
            label="Statut"
            select // Utilisation de select pour un champ enum
            value={editedColis.status}
            onChange={handleInputChange}
            fullWidth
          >
            {[
              'en attente',
              'en stock',
              'en cours',
              'retour en stock',
              'livré',
              'en pickup',
              'annulé',
              'retour au fournisseur',
              'livré et payé',
              'payé fournisseur',
            ].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="nomClient"
            label="Nom"
            type="text"
            value={editedColis.nomClient}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="prenomClient"
            label="Prenom"
            type="text"
            value={editedColis.prenomClient}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="num_client"
            label="Numéro"
            type="number"
            value={editedColis.num_client}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="prix"
            label="Prix"
            type="number"
            value={editedColis.prix}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="typeDePayment"
            label="Type de paiement"
            value={editedColis.typeDePayment}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="hauteur"
            label="Hauteur"
            type="number"
            value={editedColis.hauteur}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            name="largeur"
            label="Largeur"
            type="number"
            value={editedColis.largeur}
            onChange={handleInputChange}
            fullWidth
          />
          <div>
            <label>
              Fragile
              <input
                name="fragile"
                type="checkbox"
                checked={editedColis.fragile}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleSaveChanges}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditColis;
