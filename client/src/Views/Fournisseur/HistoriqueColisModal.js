import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoriqueColisModal = ({ colisId, onClose }) => {
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    // Chargez l'historique des colis en fonction de colisId
    if (colisId) {
      axios.get(`http://localhost:3000/historique-colis/${colisId}`)
        .then((response) => {
          setHistorique(response.data);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération de l\'historique des colis : ', error);
        });
    }
  }, [colisId]);

  return (
    <div className="historique-modal">
      {/* Affichez l'historique des colis ici */}
      <h2>Historique du colis</h2>
      <ul>
        {historique.map((item) => (
          <li key={item._id}>
            {item.statut} - {item.date}
          </li>
        ))}
      </ul>

      {/* Ajoutez un bouton ou un élément pour fermer la fenêtre modale */}
      <button onClick={onClose}>Fermer</button>
    </div>
  );
};

export default HistoriqueColisModal;
