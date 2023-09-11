// import React from 'react';
// import Typography from '@mui/material/Typography';
// import QRCode from 'react-qr-code';
// import { Button } from '@mui/material';

// const Facture = ({ client, colis, qrCodeImage }) => {
//   const handlePrintFacture = () => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.close();
//     printWindow.print();
//   };


//     return (
//       <div style={{ marginTop: 20, border: '2px solid #ccc', padding: '20px', borderRadius: '10px' }}>
//         <Typography variant="h5" gutterBottom>
//           Facture
//         </Typography>
//         {/* Afficher les informations du client */}
//         <Typography variant="subtitle1">Paramètres du client:</Typography>
//         <Typography>Nom & prénom: {client.nomprenom}</Typography>
//         <Typography>Adresse: {client.adresse}</Typography>
//         <Typography>Code postal: {client.codepostale}</Typography>
//         <Typography>Gouvernorat: {client.Gouvernorate}</Typography>

//         {/* Afficher les informations du colis */}
//         <Typography variant="subtitle1" style={{ marginTop: 10 }}>
//           Informations du colis:
//         </Typography>
//         <Typography>Prix: {colis.prix}</Typography>
//         <Typography>Type de paiement: {colis.typeDePayment}</Typography>
//         <Typography>Hauteur: {colis.hauteur}</Typography>
//         <Typography>Largeur: {colis.largeur}</Typography>

//         {/* Afficher le QR code */}
//         <Typography variant="subtitle1" style={{ marginTop: 10 }}>
//           QR Code:
//         </Typography>
//         <QRCode value={qrCodeImage} />

//         <Button variant="contained" style={{ marginTop: 20 }} onClick={handlePrintFacture}>
//           Imprimer la facture
//         </Button>
//       </div>
//     );
//   };

//   export default Facture;