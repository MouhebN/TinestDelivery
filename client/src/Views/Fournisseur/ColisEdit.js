// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ColisEdit = ({ match }) => {
//   const colisId = match.params.id;
//   const [colisData, setColisData] = useState(null);

//   useEffect(() => {
//     fetchColisData();
//   }, []);

//   const fetchColisData = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:3000/colis/${colisId}`);
//       setColisData(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des détails du colis : ', error);
//     }
//   };

//   // Handler for form submission
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.put(`http://127.0.0.1:3000/colis/${colisId}`, colisData);
//       console.log('Colis mis à jour avec succès');
//       // Ajoutez ici la logique pour rediriger l'utilisateur vers la liste des colis ou afficher un message de succès
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du colis : ', error);
//     }
//   };

//   // Handler for form field changes
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setColisData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   return (
//     <div>
//       <h2>Modifier les détails du colis</h2>
//       {colisData ? (
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="destination">Destination:</label>
//             <input
//               type="text"
//               id="destination"
//               name="destination"
//               value={colisData.destination}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label htmlFor="adresse">Adresse:</label>
//             <input
//               type="text"
//               id="adresse"
//               name="adresse"
//               value={colisData.adresse}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label htmlFor="num_client">Numéro de client:</label>
//             <input
//               type="text"
//               id="num_client"
//               name="num_client"
//               value={colisData.num_client}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label htmlFor="livreur">Livreur:</label>
//             <input
//               type="text"
//               id="livreur"
//               name="livreur"
//               value={colisData.livreur}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <label htmlFor="status">Statut:</label>
//             <select id="status" name="status" value={colisData.status} onChange={handleChange}>
//               <option value="en attente">En attente</option>
//               <option value="en stock">En stock</option>
//               {/* Ajoutez d'autres options de statut ici */}
//             </select>
//           </div>
//           {/* Ajoutez d'autres champs pour les autres propriétés du modèle de données de colis */}
//           <button type="submit">Enregistrer</button>
//         </form>
//       ) : (
//         <p>Chargement des détails du colis...</p>
//       )}
//     </div>
//   );
// };

// export default ColisEdit;