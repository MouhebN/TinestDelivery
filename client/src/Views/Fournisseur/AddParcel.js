import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {Button} from 'antd';
import axios from 'axios';
import XLSX from 'xlsx';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import PrintIcon from '@mui/icons-material/Print';
import HistoryIcon from '@mui/icons-material/History';
import {AppBar, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import qrcode from 'qrcode';
import Facture from './Facture';
import EditColis from './EditColis';
import DetailColis from './DetailColis';
import '../../App.css';
import {DataGrid} from "@mui/x-data-grid";
import MiniDrawerfourisseur from "../../Components/SideBar";
import {styled} from "@mui/material/styles";
import ImportExcel from './ImportExcel';
import ColisImprimer  from "./ImprimerColis";
const generateInvoiceHTML = (client, colis, qrCodeImage) => {
    const fraisLivraison = 8;
    const total = parseFloat(colis.prix) + fraisLivraison;


    const dateActuelle = new Date();
    const dateFormatted = dateActuelle.toLocaleString();

    };


const tableCellStyle = {
    padding: '8px',
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
};

const fragileCellStyle = {
    ...tableCellStyle,
    fontWeight: 'bold',
    color: 'red',
};

const App = () => {

    const [colisList, setColisList] = useState([]);
    const [showFacture, setShowFacture] = useState(false);
    const [svgQRCode, setSvgQRCode] = useState(null);
    const [agences, setAgences] = useState([]);
    const [selectedAgence, setSelectedAgence] = useState('');
    const [rows, setRows] = useState([]);
    const [importedData, setImportedData] = useState([]);
    const [selectedColisId, setSelectedColisId] = useState(null);
    const [fragile, setFragile] = useState(false);
    const [qrCodeImage, setQRCodeImage] = useState('');
    const [selectedColis, setSelectedColis] = useState(null); // State for selected colis
    const [showPdfContent, setShowPdfContent] = useState(false);
    const [editedColis, setEditedColis] = useState(null);
    const [showComponent, setShowComponent] = useState(true); // Définissez l'état initial à true ou false en fonction de vos bes
    const [showColisDetails, setShowColisDetails] = useState(false);

    

    const [client, setClient] = useState({
        nomClient: '',
        prenomClient: '',
        destination: '',
        num_client: '',
    });
    const [colis, setColis] = useState({
        prix: '',
        typeDePayment: '',
        largeur: '',
        hauteur: '',
        fournisseur: '',
    });
// afficher agences in colis form
    useEffect(() => {
        axios.get('http://localhost:3000/listerAgences', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                setAgences(response.data.agences);
            })
            .catch(error => {
                console.error('Error fetching agences:', error);
            });
    }, []);
    const handleAddColis = async () => {
        const newColis = {
            destination: client.destination,
            num_client: client.num_client,
            nomClient: client.nomClient,
            prenomClient: client.prenomClient,
            status: 'en attente', // Set default status
            date_creation: new Date(),
            prix: colis.prix,
            typeDePayment: colis.typeDePayment || "",
            hauteur: colis.hauteur || "",
            largeur: colis.largeur || "",
            agence: selectedAgence,
        };
        // Send new colis data to the backend and save in the database
        try {
            const postData = {
                destination: newColis.destination,
                num_client: newColis.num_client,
                nomClient: newColis.nomClient,
                prenomClient: newColis.prenomClient,
                status: newColis.status,
                date_creation: newColis.date_creation,
                prix: newColis.prix,
                typeDePayment: newColis.typeDePayment,
                largeur: newColis.largeur,
                hauteur: newColis.hauteur,
                agence: newColis.agence,

            };
            console.log("postData ::: ", postData)

            await axios.post('http://localhost:3000/ajouterColis', postData, {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            });

            // Update colisList with the newly created colis
            setColisList(prevColisList => [...prevColisList, newColis]);
            alert("Colis ajouté avec succès");

        
        setColis({
            prix: '',
            typeDePayment: '',
            largeur: '',
            hauteur: '',
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du colis:', error);
    }
    };
      

    
    const handleHistorique = (colisId) => {
        setSelectedColisId(colisId); // Mettez à jour l'ID du colis sélectionné
        setShowColisDetails(true); // Affichez le composant de détails du colis
      };

    const handleCloseColisDetails = () => {
        setSelectedColisId(null);
        setShowColisDetails(false);
      };
    
    const handleDelete = async (colisId) => {
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
    
    const handleFragileChange = (event) => {
        setFragile(event.target.checked);
    };
    const handleNumericInput = (e) => {
        const { value } = e.target;
        const numericValue = value.replace(/[^0-9]/g, '');
        setColis({ ...colis, prix: numericValue });
    };


    const generateQRCodeSVG = async (qrCodeData) => {
        const qrCodeString = JSON.stringify(qrCodeData);
        try {
            const svgString = qrcode.toString(qrCodeString, {type: 'svg'});
            return svgString;
        } catch (error) {
            throw new Error('Error generating QR code: ' + error.message);
        }
    };

    // Function to handle generating QR code for colis
    const handleGenerateQRCode = async (colisId) => {
        try {
            const svgQRCode = await generateQRCodeSVG(colisId);
            return svgQRCode;
        } catch (error) {
            console.error('Error generating QR code:', error);
            return '';
        }
    };

    

    // const handlePrintFacture = async (colisId, client) => {
    //     const qrCodeImage = await handleGenerateQRCode(colisId);
    //     const qrCodeData = JSON.stringify({
    //         id: colisId,
    //     });

    //     setQRCodeImage(qrCodeImage);
    //     const invoiceHTML = generateInvoiceHTML(client, colis, qrCodeImage);
    //     const printWindow = window.open('', '_blank');
    //     printWindow.document.write(invoiceHTML);
    //     printWindow.document.close();

    //     const qrCodeImageObj = new Image();
    //     qrCodeImageObj.onload = () => {
    //         printWindow.print();
    //     };
    //     qrCodeImageObj.src = qrCodeImage;
    // };

    useEffect(() => {
        axios.get('http://localhost:3000/listerColisFournisseur', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        }).then((response) => {
            const transformedResponse = response.data.colisList.map(colis => {
                return {
                    ...colis,
                    id: colis._id,

                };
            });
            setRows(transformedResponse);
        })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const columns = [

        {field: 'id', headerName: 'ID', minWidth: 120},
        {field: 'nomClient', headerName: 'Nom', minWidth: 100},
        {field: 'prenomClient', headerName: 'Prénom', minWidth: 100},
        {field: 'destination', headerName: 'Destination', minWidth: 200},
        {field: 'num_client', headerName: 'Téléphone', minWidth: 150},
        {field: 'prix', headerName: 'Prix', minWidth: 100},
        {field: 'status', headerName: 'Status', minWidth: 150},
        {field: 'date_creation', headerName: 'date_creation', minWidth: 150},
        {
            Field: 'actions',
            headerName: 'Actions',
            minWidth: 150,
            
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handlePrintClick(params.row)}>
                      <PrintIcon style={{ color: 'orange' }} />
                    </IconButton>
                    <IconButton onClick={() => handleHistorique(params.id)}>
                        <HistoryIcon style={{color: 'blue'}}/>
                    </IconButton>
                    <IconButton onClick={() => handleEditColis(params.row)}>
                      <EditIcon style={{ color: 'green' }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon style={{color: 'red'}}/>
                    </IconButton>
                </div>
            ),
        },
    ];

    const Div = styled('div')(({theme}) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
    }));

    const handleDataImport = (importedData) => {
        // Traitez les données importées, par exemple, mettez à jour votre état 'rows'.
        setRows(importedData);
      };
      
      const handlePrintClick = (colisItem) => {
        setSelectedColis(colisItem); // Update selected colis when print icon is clicked
        setShowPdfContent(true); // Affiche le composant ColisImprimer
      };

      const [isEditing, setIsEditing] = useState(false);

      const handleEditColis = (colis) => {
        setIsEditing(true);
        setEditedColis(colis); // Définir le colis en cours d'édition
          setSelectedColisId(colis.id); // Transmettez l'ID du colis sélectionné
      };

      const onClose = () => {
        // Code pour masquer le composant
        setShowComponent(false); // Mettre à jour l'état pour masquer le composant
      };
      
      const handleSaveColis = async (editedColis, colisId) => {
        try {
          // Envoyez une requête au serveur pour mettre à jour le colis avec les données modifiées
          const response = await axios.post(`http://localhost:3000/${colisId}/modifierColis`, editedColis, {
            headers: {
              'x-access-token': localStorage.getItem('token'),
            },
          });
      
          if (response.status === 200) {
            console.log('Colis mis à jour avec succès');
            // Mettez à jour la liste des colis localement si nécessaire
            // Par exemple, vous pouvez mettre à jour colisList avec les nouvelles données
            // En supposant que colisList est une liste de colis dans votre état
            const updatedColisList = colisList.map((colisItem) =>
              colisItem.id === colisId ? editedColis : colisItem
            );
            setColisList(updatedColisList);
            setIsEditing(false); // Sortez du mode d'édition
            onClose(); // Fermez le composant de modification
         // Affichez une alerte de succès
      alert('Colis mis à jour avec succès');
        } else {
            console.error('Erreur lors de la mise à jour du colis');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du colis :', error);
        }
      };
      
      
  
    return (
        <>  <MiniDrawerfourisseur/>

       <div className="App">
        <header>
          <h1></h1>
        </header>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '20px',
                padding: 1,
                left: 250,
                position: 'relative',
                width: 1600,
                marginBottom: '100px',
                marginLeft: '10px',

            }}>

                <Paper elevation={3} sx={{padding: 2, marginRight: 2}}>
                    <Typography variant="h5" gutterBottom>
                        Paramètres du client
                    </Typography>
                    <TextField
                        label="Nom"
                        type="text"
                        value={client.nomClient}
                        onChange={(e) => setClient({...client, nomClient: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Prénom"
                        type="text"
                        value={client.prenomClient}
                        onChange={(e) => setClient({...client, prenomClient: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Destination"
                        type="text"
                        value={client.destination}
                        onChange={(e) => setClient({...client, destination: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Téléphone"
                        type="tel"
                        value={client.num_client}
                        onChange={(e) => setClient({...client, num_client: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Paper>
                <Paper elevation={3} sx={{padding: 2, marginLeft: 2}}>
                    <Typography variant="h5" gutterBottom>
                        Informations du Colis
                    </Typography>

                    <TextField
                        label="Prix"
                        type="Number"
                        value={colis.prix}
                        onChange={(e) => setColis({...colis, prix: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Type de paiement"
                        type="text"
                        value={colis.typeDePayment}
                        onChange={(e) => setColis({...colis, typeDePayment: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Hauteur"
                        type="number"
                        value={colis.hauteur}
                        onChange={(e) => setColis({...colis, hauteur: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Largeur"
                        type="number"
                        value={colis.largeur}
                        onChange={(e) => setColis({...colis, largeur: e.target.value})}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Agence"
                        select
                        value={selectedAgence}
                        onChange={(e) => setSelectedAgence(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    >
                        {agences.map(agency => (
                            <MenuItem key={agency._id} value={agency._id}>
                                {agency.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={fragile} onChange={handleFragileChange}/>}
                            label="Fragile"
                        />
                    </FormGroup>
                </Paper>
                {/* Zone d'importation Excel à droite de la section "Informations du Colis" */}
     

            </Box>
            <Box sx={{
                display: 'relative',
                padding: 0,
                position: 'relative',
                marginBottom: '10px',
                marginLeft: '10px',
            }}>
                <Button className='rechercher-button' onClick={handleAddColis}>
                    Ajouter Colis
                </Button>
            </Box>
            
           
            <Div mt={2} >
                Liste Colis a crée :</Div>
            <Box sx={{
                position: 'relative', overflow: 'auto', height: 600,
                width: 1500, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination={true}
                />
            </Box>

            <div className="import-section">
      <Paper elevation={3} sx={{ padding: 2, marginLeft: 4 }}>
        <Typography variant="h5" gutterBottom>
          Importer depuis Excel
        </Typography>
        <ImportExcel onImport={handleDataImport} /> {/* Passer la fonction de gestion de l'importation */}
      </Paper>
      </div>
            <footer>
          <p>&copy; 2023 TinestDelivery</p>
        </footer>
</div>
            {showPdfContent && selectedColis && (
        <ColisImprimer colis={selectedColis} onClose={() => setShowPdfContent(false)} />
      )}
      {isEditing && (
        <EditColis colis={editedColis} onSaveChanges={handleSaveColis} onClose={() => setIsEditing(false)} />
      )}
      {showColisDetails && (
        <div>
          <DetailColis colisId={selectedColisId} onClose={handleCloseColisDetails} />
          <Button onClick={() => setShowColisDetails(false)}>Fermer les détails</Button>
        </div>
      )}
            </>
    );
};

export default App;