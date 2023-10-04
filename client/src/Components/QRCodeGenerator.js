import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import axios from 'axios';

const QRCodeGenerator = () => {
  const [colisData, setColisData] = useState(null);

  useEffect(() => {
    // Remplacez l'URL par l'URL correcte pour obtenir les détails du colis depuis votre backend
    axios.get('http://localhost:3000/colis/listerColis')
      .then(response => {
        setColisData(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données du colis :", error);
      });
  }, []);

  useEffect(() => {
    if (colisData) {
      const qrCodeData = JSON.stringify(colisData);
      QRCode.toCanvas(document.getElementById('qrcode'), qrCodeData, function (error) {
        if (error) {
          console.error('Erreur lors de la génération du QR code :', error);
        }
      });
    }
  }, [colisData]);

  return (
    <div>
      <h2>QR Code</h2>
      <canvas id="qrcode"></canvas>
    </div>
  );
};

export default QRCodeGenerator;
