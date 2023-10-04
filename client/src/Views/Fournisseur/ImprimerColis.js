import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  MenuItem,
  Grid,
} from '@mui/material';

import qrcode from 'qrcode';
export let fragile = false;
export const handleFragileChange = () => {
  fragile = !fragile;
};

const ColisImprimer = ({ colis, onClose }) => {
  const [showContent, setShowContent] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [colisTable, setColisTable] = useState([]);
  const [showPdfContent, setShowPdfContent] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [currentDate, setCurrentDate] = useState(''); // Déplacez la déclaration ici
  const [colisData, setColisData] = useState({
    fragile: false,
    nomClient: colis.nomClient || '',
    prenomClient: colis.prenomClient || '',
    destination: colis.destination || '',
    num_client: colis.num_client || '',
    prix: colis.prix || '', // Ajout du prix
    typeDePayment: colis.typeDePayment || '', // Ajout du type de paiement
    hauteur: colis.hauteur || '', // Ajout de la hauteur
    largeur: colis.largeur || '', // Ajout de la largeur
    status: colis.status || '', // Ajout du statut
  });
  useEffect(() => {
    if (showPdfContent) {
      handlePrint();
    }
  }, [showPdfContent]);

  const generateBonDeLivraisonNumero = () => {
    // Générer un numéro de bon de livraison unique
    const numero = Math.floor(Math.random() * 1000000);
    return numero.toString();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setColisData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFragileChange = (event) => {
    const { checked } = event.target;
    setColisData((prevData) => ({
      ...prevData,
      fragile: checked,
    }));
  };

  const generateQRCode = async () => {
    try {
      const qrCodeData = {
        id: colis._id,
        prix: colisData.prix,
        typeDePayment: colisData.typeDePayment,
        hauteur: colisData.hauteur,
        largeur: colisData.largeur,
        idAgence: colisData.idAgence, // Assurez-vous d'avoir idAgence dans colisData
      };
  
      const qrCodeDataURL = await qrcode.toDataURL(JSON.stringify(qrCodeData));
      return qrCodeDataURL;
    } catch (error) {
      console.error('Erreur lors de la génération du QR code :', error);
      return null;
    }
  };
  

  const handlePrint = async () => {
    try {

      const colisDataArray = [
        ['Prix', colisData.prix],
        ['Type de paiement', colisData.typeDePayment],
        ['Hauteur', colisData.hauteur],
        ['Largeur', colisData.largeur],
        ['Statut', colisData.status],
        ['Fragilité', colisData.fragile ? 'Oui' : 'Non'],
      ];

      

      const qrCodeData = {
        id: colis._id,
        prix: colis.prix,
        typeDePayment: colis.typeDePayment,
        idFournisseur: colis.fournisseur,
        livreur: colis.livreur,
        hauteur: colis.hauteur,
        largeur: colis.largeur,
      };

      const qrCodeImage = await generateQRCode(qrCodeData);

      if (qrCodeImage) {
        
        const doc = new jsPDF();
        doc.setFontSize(12);
        
        
          // Ajoutez l'image du code QR
          doc.addImage(qrCodeImage, 'JPEG', doc.internal.pageSize.getWidth() - 40, 15, 30, 30);
          
        //   // Extrait les 6 derniers chiffres de l'ID
        //   const lastSixDigits = qrCodeData.id.slice(-6);

        //   // Ajoutez les 6 derniers chiffres sous le code QR
        //   doc.text(`ID: ${lastSixDigits}`, doc.internal.pageSize.getWidth() - 40, 55);
    // Ajouter le titre "zedDelivery" à gauche avec un style similaire à WordArt
    doc.setTextColor('');
    doc.setFont('helvetica', 'Gras');
    doc.setFontSize(14);
    doc.text('TinestDelivery', 10, 20);
  
    
  
    const numeroBon = generateBonDeLivraisonNumero();

// Titre avec numéro de bon de livraison
const title = `Bon de Livraison: ${numeroBon} `;

doc.setTextColor('black');
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);

// Obtenez la largeur du titre
const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;

// Calculez la position horizontale pour centrer le titre
const centerX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;

// Affichez le titre au centre avec le numéro de bon de livraison
doc.text(title, centerX, 14);


  
    const currentDate = new Date().toLocaleDateString();
    doc.setTextColor('black');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 15, doc.internal.pageSize.getHeight() - 15);
  
    // Informations du colis
    const colisInfoY = 60;
    const colisInfoX = 10;
    doc.text('Informations du Colis', colisInfoX, colisInfoY);
doc.autoTable({
  body: colisDataArray,
  startY: colisInfoY + 10,
  columnStyles: { 0: { fontStyle: 'bold' } },
});
// Afficher le mot "Fragile" uniquement si colisData.fragile est vrai
// Afficher le mot "Fragile" uniquement si colisData.fragile est vrai
if (colisData.fragile) {
  const fragileWord = 'Fragile';
  const letterWidth = 18; // Largeur approximative d'une lettre
  const fragileX = colisInfoX + 5; // Position horizontale de départ pour "F"
  const fragileY = colisInfoY + 10 + colisDataArray.length * 10 + 5; // Position verticale

  // Définir l'épaisseur de la ligne rouge
  doc.setLineWidth(0.5);

  // Définir la couleur du texte et des points en rouge
  doc.setTextColor(255, 0, 0);
  doc.setDrawColor(255, 0, 0);

  // Ajouter un point rouge avant le mot "Fragile"
  doc.text('.', fragileX - 3, fragileY + 2);

  for (let i = 0; i < fragileWord.length; i++) {
    const letter = fragileWord[i];
    
    // Augmenter la taille du texte pour simuler le texte en gras
    doc.setFontSize(14);
    doc.text(letter, fragileX + i * letterWidth, fragileY);
    doc.setFontSize(12); // Rétablir la taille du texte normale après l'ajout du texte en gras
    
    // Ajouter un point rouge après chaque lettre
    doc.text('.', fragileX + (i + 1) * letterWidth, fragileY + 2);
  }
  
  // Ajouter un point rouge après le mot "Fragile"
  doc.text('.', fragileX + fragileWord.length * letterWidth, fragileY + 2);

  // Ajouter le soulignement en rouge
  doc.line(
    fragileX, fragileY + 2, 
    fragileX + fragileWord.length * letterWidth, fragileY + 2
  );
}

// À l'intérieur de la fonction handlePrint, ajoutez ce code après la création de doc
const checkboxX = doc.internal.pageSize.getWidth() - 50;
const checkboxY = doc.internal.pageSize.getHeight() - 30;
const checkboxSize = 6;

// Dessiner la case à cocher
doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize);
doc.setTextColor(0, 0, 0); // Couleur du texte en noir
doc.setFontSize(8);
doc.text('Livré', checkboxX + checkboxSize + 5, checkboxY + checkboxSize - 2);

// Cochez la case à cocher si nécessaire (par exemple, si le colis est livré)
if (colisData.status === 'Livré') {
  doc.setDrawColor(0); // Couleur du contour de la case (0 pour noir)
  doc.setLineWidth(1); // Largeur du trait
  doc.line(checkboxX, checkboxY, checkboxX + checkboxSize, checkboxY + checkboxSize);
  doc.line(checkboxX, checkboxY + checkboxSize, checkboxX + checkboxSize, checkboxY);
}

  
    // Informations du client
    const data = [
      ['Nom', colisData.nomClient],
      ['Prénom', colisData.prenomClient],
      ['Adresse', colisData.adresse],
      ['Code Postal', colisData.codepostale],
      ['Destination', colisData.destination],
      ['Numéro Client', colisData.num_client],
    ];
  
    
  
    const total = parseFloat(colisData.prix);
    const tva = 0.19 * total;
    const montantTTC = total + tva;
  
    const colisTable = [
      ['Description', 'Valeur'],
      ['Prix', colisData.prix],
      ['TVA', '19%'],
      ['Montant TVA', tva.toFixed(2)],
      ['Montant TTC', montantTTC.toFixed(2)],
    ];

    
  
    // Encadrer l'interface
    doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, 'S');
  
    // Ajouter le QR Code
    if (qrCodeImage) {
      doc.addImage(qrCodeImage, 'JPEG', doc.internal.pageSize.getWidth() - 40, 15, 30, 30);
    }
  
    doc.autoTable({
      body: data,
      startY: colisInfoY + 100, // Position sous les informations du colis et du client
    });
  
    doc.autoTable({
      head: [['Description', 'Valeur']],
      body: colisTable,
      startY: doc.autoTable.previous.finalY + 10,
    });
  
    // Afficher le contenu PDF dans une nouvelle fenêtre
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
    doc.output('dataurlnewwindow');
  }
} catch (error) {
  console.error('Erreur lors de la génération du PDF :', error);
}
  };
  


  const doc = new jsPDF({
    format: 'a2',
    orientation: 'portrait', // Ajustez l'orientation selon vos besoins
  });

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Imprimer Bon de Livraison</DialogTitle>
      <DialogContent>
        <Box>
          <div>
            <Typography variant="h5" gutterBottom>
              Bon de Livraison
            </Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {/* Attributs du client à gauche */}
                  <Typography variant="h6">Informations du Client</Typography>
                  <div>
                    <label>Nom:</label>
                    <label>{colisData.nomClient}</label>
                  </div>
                  <div>
                    <label>Prénom:</label>
                    <label>{colisData.prenomClient}</label>
                  </div>
                  <div>
                    <label>Adresse:</label>
                    <label>{colisData.adresse}</label>
                  </div>
                  <div>
                    <label>Code Postal:</label>
                    <label>{colisData.codepostale}</label>
                  </div>
                  <div>
                    <label>Destination:</label>
                    <label>{colisData.destination}</label>
                  </div>
                  <div>
                    <label>Numéro Client:</label>
                    <label>{colisData.num_client}</label>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  {/* Attributs du colis à droite */}
                  <Typography variant="h6">Informations du Colis</Typography>
                  <div>
                    <label>Prix:</label>
                    <label>{colisData.prix}</label>
                  </div>
                  <div>
                    <label>Type de paiement:</label>
                    <label>{colisData.typeDePayment}</label>
                  </div>
                  <div>
                    <label>Hauteur:</label>
                    <label>{colisData.hauteur}</label>
                  </div>
                  <div>
                    <label>Largeur:</label>
                    <label>{colisData.largeur}</label>
                  </div>
                  <div>
                    <label>Statut:</label>
                    <label>{colisData.status}</label>
                  </div>
                  <div>
                    <label>Fragilité:</label>
                    <label>{colisData.fragile ? 'Oui' : 'Non'}</label>
                  </div>
                </Grid>
              </Grid>
  
              <div>
                <label>
                  Fragile:
                  <input
                    type="checkbox"
                    name="fragile"
                    checked={colisData.fragile}
                    onChange={handleFragileChange}
                  />
                </label>
              </div>
              <TextField
                label="Statut"
                select
                name="status"
                value={colisData.status}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {['en attente', 'en stock', 'en cours', 'retour en stock', 'livré', 'en pickup',
                'annulé', 'retour au fournisseur', 'livré et payé', 'payé fournisseur'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </form>
          </div>
          // ...

{showPdfContent && (
  <div>
    <Typography variant="subtitle2">Date: {currentDate}</Typography> {/* Déplacez cette ligne */}
    <Typography variant="subtitle1">tinestDelivery</Typography>
    <Typography variant="subtitle2">Locale: Default</Typography>
    {colisTable.map((row, index) => (
      <div key={index}>
        <Typography>{row[0]}</Typography>
        <Typography>{row[1]}</Typography>
      </div>
    ))}
    {qrCodeImage && (
      <img
        src={qrCodeImage}
        alt="QR Code"
        style={{ position: 'absolute', bottom: '10px', left: '10px' }}
      />
    )}
  </div>
)}

// ...

  
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Imprimer
            </Button>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Annuler
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ColisImprimer;
