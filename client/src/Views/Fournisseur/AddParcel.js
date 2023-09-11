import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {Button} from 'antd';
import axios from 'axios';
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
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import qrcode from 'qrcode';
import Facture from './Facture';
import '../../App.css';
import {DataGrid} from "@mui/x-data-grid";
import MiniDrawerfourisseur from "../../Components/SideBar";
import {styled} from "@mui/material/styles";
const generateInvoiceHTML = (client, colis, qrCodeImage) => {
    const fraisLivraison = 8;
    const total = parseFloat(colis.prix) + fraisLivraison;


    const dateActuelle = new Date();
    const dateFormatted = dateActuelle.toLocaleString();

    const template = `<!DOCTYPE html>
    <html>
    <head>
      <title>Colis Facture</title>
      <style>
        /* Ajouter les styles CSS ici */
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .facture-container {
          border: 2px solid #ccc;
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }
        .facture-header {
          display: flex;
          justify-content: space-between;
        }
        .facture-title {
          font-size: 24px;
          padding:30px 20px;
          text-align: center;
        }
        .facture-date {
          font-size: 14px;
        }
        .facture-info {
          margin-top: 10px;
          font-size: 14px;
        }
        .facture-table {
          border-collapse: collapse;
          margin-top: 20px;
          
        }
        .facture-table th,
        .facture-table td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: center;
        }
        .facture-table th {
          background-color: #f0f0f0;
        }
        .qr-code-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        .qr-code-id {
          font-size: 12px;
          text-align: center;
        }
      </style>
    </head>
    <body>
     <div class="facture-container">
     <div class="facture-header">
     <div class="facture-title" text-align: center;>TinestDelivery</div>
     <div class="facture-date">Date de création: ${dateFormatted}</div>
     </div>
     <div class="facture-info">
      <p>Nom: ${client.nomClient}</p>
      <p>Prenom: ${client.prenomClient}</p>
      <p>Adresse: ${client.adresse}</p>
      <p>Code postal: ${client.codepostale}</p>
      <p>Destination: ${client.destination}</p>
      <p>Téléphone: ${client.num_client}</p>
      <table class="facture-table">
      <tr>
            <th>Prix</th>
            <th>Frais de livraison</th>
            <th>Total</th>
          </tr>  
          <tr>       
            <td>${colis.prix}</td>
            <td>${fraisLivraison}</td>
            <td>${total.toFixed(2)}</td>
          </tr>
      </table>   
      <table class="facture-table"> 
         <tr>
              <th>Type de paiement</th>
              <th>Hauteur</th>
              <th>Largeur</th>
         </tr>
         <tr>
            <td>${colis.typeDePayment}</td>
            <td>${colis.hauteur}</td>
            <td>${colis.largeur}</td>
         </tr>
      </table>
        
      <div class="qr-code-container">
        <img src="${qrCodeImage}" style="padding: 20px; margin-top: 50px;" />
      </div>
      <div class="qr-code-id">
        <p>ID: ${colis.qrCode}</p>
      </div>
      </div>
    </body>
    </html>`;
    return template;
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
    const [client, setClient] = useState({
        nomClient: '',
        prenomClient: '',
        adresse: '',
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
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du colis:', error);
        }
        setColis({
            prix: '',
            typeDePayment: '',
            largeur: '',
            hauteur: '',
        });
    };
    const handleHistorique = () => {
        console.log("Afficher l'historique des colis");
    };
    const handleDelete = async (colisId) => {
        try {
            console.log("colisId  : ",colisId);
            await axios.get(`http://localhost:3000/${colisId}/supprimerColis`,{
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            });
            console.log('colis supprimé');
        } catch (error) {
            console.error('Erreur lors de la suppression du colis : ', error);
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

    const handleDataImport = (data) => {
        setImportedData(data);
    };

    const handlePrintFacture = async (colisId, client) => {
        const qrCodeImage = await handleGenerateQRCode(colisId);
        const qrCodeData = JSON.stringify({
            id: colisId,
        });
        setQRCodeImage(qrCodeImage);
        const invoiceHTML = generateInvoiceHTML(client, colis, qrCodeImage);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();

        const qrCodeImageObj = new Image();
        qrCodeImageObj.onload = () => {
            printWindow.print();
        };
        qrCodeImageObj.src = qrCodeImage;
    };

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
                    <IconButton onClick={() => handlePrintFacture(params.row.id)}>
                        <PrintIcon style={{color: 'orange'}}/>
                    </IconButton>
                    <IconButton onClick={() => handleHistorique(params.row)}>
                        <HistoryIcon style={{color: 'blue'}}/>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.qrCode)}>
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
    return (
        <>  <MiniDrawerfourisseur/>

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

                <Paper elevation={3} sx={{padding: 2, marginRight: 4}}>
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
                <Paper elevation={3} sx={{padding: 2, marginLeft: 4}}>
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

            </Box>
            <Box sx={{
                display: 'relative',
                padding: 1,
                position: 'relative',
                marginBottom: '100px',
                marginLeft: '400px',
            }}>
                <Button className='rechercher-button' onClick={handleAddColis}>
                    Ajouter Colis
                </Button>
            </Box>


            {/*/////////////////////////////////////////////////////////////*/}

            <Div mt={2} sx={{
                marginBottom: '100px',
                position: 'static',
                marginLeft: '259px',
                marginRight: '100px',
                overflow: 'auto',
                backgroundColor: '#ECF2FF'
            }}>Liste de
                Liste Colis a crée :</Div>
            <Box sx={{
                position: 'static', marginLeft: '130px', overflow: 'auto', height: 600,
                width: 1300, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination={true}
                />
            </Box>

            {/* Affichage de la facture */}
            {showFacture && colis.qrCode && qrCodeImage && (
                <div style={{ marginTop: 50 }}>
                    <Facture client={client} colis={colis} qrCodeImage={qrCodeImage} />


                </div>
            )}
            </>
    );
};

export default App;