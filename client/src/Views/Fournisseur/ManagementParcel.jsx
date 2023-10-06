import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import MiniDrawerfourisseur from '../../Layouts/sideBarFournisseur';

const ManageParcels = () => {
  const [colisList, setColisList] = useState([]);
  const [selectedColis, setSelectedColis] = useState({});
  const [showRecap, setShowRecap] = useState(false);

  const [formData, setFormData] = useState({
    nomClient: '',
    prenomClient: '',
    destination: '',
    num_client: '',
    prix: '',
    typeDePayment: '',
    hauteur: '',
    largeur: '',
    agence: '',
    fragile: false,
  });

  useEffect(() => {
    // Récupérer la liste des colis depuis votre backend (à adapter)
    axios
      .get('http://localhost:3000/listerColisFournisseur', {
        headers: {
          'x-access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => {
        setColisList(response.data.colisList);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des colis : ', error);
      });
  }, []);

  
  const handleAddColis = async () => {
    // Préparez les données du colis à envoyer au serveur
    const postData = {
      destination: formData.destination,
      num_client: formData.num_client,
      nomClient: formData.nomClient,
      prenomClient: formData.prenomClient,
      status: 'en attente', // Set default status
      date_creation: new Date().toISOString(), // Date de création actuelle
      prix: formData.prix,
      typeDePayment: formData.typeDePayment || '',
      hauteur: formData.hauteur || '',
      largeur: formData.largeur || '',
      agence: formData.agence,
      fragile: formData.fragile,
    };

    // Envoie les données du colis au serveur pour ajout dans la base de données
    try {
      const response = await axios.post(
        'http://localhost:3000/ajouterColis',
        postData, // Les données du colis à ajouter
        {
          headers: {
            'x-access-token': localStorage.getItem('token'),
          },
        }
      );

      // Si la réponse du serveur est réussie, ajoutez le colis à la liste locale
      const newColis = response.data; // Les données du colis créé par le serveur
      setColisList((prevColisList) => [...prevColisList, newColis]);

      // Réinitialisez les champs du formulaire
      setFormData({
        nomClient: '',
        prenomClient: '',
        destination: '',
        num_client: '',
        prix: '',
        typeDePayment: '',
        hauteur: '',
        largeur: '',
        agence: '',
        fragile: false,
      });

      // Affichez un message de succès ou effectuez d'autres actions nécessaires
      alert('Colis ajouté avec succès');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du colis : ", error);
      // Affichez un message d'erreur ou effectuez d'autres actions en cas d'erreur
     }
  };

  const handleImportFromDatabase = (colis) => {
    // Remplir le formulaire avec les données du colis importé
    setSelectedColis(colis);
    setFormData({
      nomClient: colis.nomClient,
      prenomClient: colis.prenomClient,
      destination: colis.destination,
      num_client: colis.num_client,
      prix: colis.prix,
      typeDePayment: colis.typeDePayment,
      hauteur: colis.hauteur,
      largeur: colis.largeur,
      agence: colis.agence,
      fragile: colis.fragile,
    });
    setShowRecap(true);
  };

  const handleDeleteColis = async(colisId) => {
    const userConfirmed = window.confirm("Voulez-vous supprimer ce colis ?");
        
            if (userConfirmed){
                try {
            await axios.get(`http://localhost:3000/${colisId}/supprimerColis`, {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            });
            alert('Colis mis à jour avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression du colis : ', error);
        }
    }     else {
    }
    };

const handleEditColis = (colis) => {
  setSelectedColis(colis);
  setFormData({
    nomClient: colis.nomClient,
    prenomClient: colis.prenomClient,
    destination: colis.destination,
    num_client: colis.num_client,
    prix: colis.prix,
    typeDePayment: colis.typeDePayment,
    hauteur: colis.hauteur,
    largeur: colis.largeur,
    agence: colis.agence,
    fragile: colis.fragile,
  });
  setShowRecap(true);
};


  return (
    <>
      <MiniDrawerfourisseur />
      <div style={{ marginTop: 50, padding: 1, position: 'relative', width: 1300, marginLeft: '200px', left: 140 }}>
        {showRecap ? (
          <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h5" gutterBottom>
              Récapitulatif du Colis
            </Typography>
            <Typography>
              <strong>Nom du Client:</strong> {formData.nomClient}
            </Typography>
            <Typography>
              <strong>Prénom du Client:</strong> {formData.prenomClient}
            </Typography>
            <Typography>
              <strong>Numéro du Client:</strong> {formData.num_client}
            </Typography>
            <Typography>
              <strong>Destination:</strong> {formData.destination}
            </Typography>
            <Typography>
              <strong>Status:</strong> {formData.status}
            </Typography>
            <Typography>
              <strong>Fragile:</strong> {formData.fragile}
            </Typography>
            <Typography>
              <strong>Agence:</strong> {formData.agence}
            </Typography>
            <Typography>
              <strong>Type De Payment:</strong> {formData.typeDePayment}
            </Typography>
            <Typography>
              <strong>Hauteur:</strong> {formData.hauteur}
            </Typography>
            <Typography>
              <strong>Largeur:</strong> {formData.largeur}
            </Typography>
            {/* Ajoutez d'autres champs du client ici */}
            <Typography>
              <strong>Prix:</strong> {formData.prix}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setShowRecap(false)}
            >
              Modifier
            </Button>
          </Paper>
        ) : (
          <>
            {/* Formulaire d'ajout de colis */}
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
              <Typography variant="h5" gutterBottom>
                Ajouter un Colis
              </Typography>
              <TextField
                label="Nom du client"
                type="text"
                value={formData.nomClient}
                onChange={(e) =>
                  setFormData({ ...formData, nomClient: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Prénom du client"
                type="text"
                value={formData.prenomClient}
                onChange={(e) =>
                  setFormData({ ...formData, prenomClient: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Téléphone du client"
                type="number"
                value={formData.num_client}
                onChange={(e) =>
                  setFormData({ ...formData, num_client: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Destination"
                type="text"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Prix"
                type="number"
                value={formData.prix}
                onChange={(e) =>
                  setFormData({ ...formData, prix: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Agence"
                type="text"
                value={formData.agence}
                onChange={(e) =>
                  setFormData({ ...formData, agence: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="TypeDepayement"
                type="text"
                value={formData.typeDePayment}
                onChange={(e) =>
                  setFormData({ ...formData, typeDePayment: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Largeur"
                type="number"
                value={formData.largeur}
                onChange={(e) =>
                  setFormData({ ...formData, largeur: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Hauteur"
                type="number"
                value={formData.hauteur}
                onChange={(e) =>
                  setFormData({ ...formData, hauteur: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              {/* Ajoutez les autres champs du formulaire ici */}
              <Button variant="contained" onClick={handleAddColis}>
                Ajouter Colis
              </Button>
            </Paper>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h5" gutterBottom>
                Liste des Colis
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom du client</TableCell>
                      <TableCell>Prenom du client</TableCell>
                      <TableCell>Télephone</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>Prix</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {colisList.map((colis) => (
                      <TableRow key={colis._id}>
                        <TableCell>{colis.nomClient}</TableCell>
                        <TableCell>{colis.prenomClient}</TableCell>
                        <TableCell>{colis.num_client}</TableCell>
                        <TableCell>{colis.destination}</TableCell>
                        <TableCell>{colis.prix}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleImportFromDatabase(colis)}
                          >
                            Importer
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteColis(colis._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton onClick={() => handleEditColis(colis)}>
                             <EditIcon />
                          </IconButton>

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </div>
    </>
  );
};

export default ManageParcels;
