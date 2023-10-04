// import React, { useState } from 'react';
// import '../../App.css';

// function ModifierColis({ colis, onSave, onCancel }) {
//     const [editedColis, setEditedColis] = useState({ ...colis });

//     const handleSave = () => {
//         onSaveChanges(editedColis);
//     };
    

//     return (
        
//         <div className="modifier-colis-section" style={{ padding: 1, left: 300, position: 'relative', width: 800 }}>
//             <h2>Modifier le colis</h2>
//             <label htmlFor="status">Status :</label>
//             <select
//                 id="status"
//                 value={editedColis.status}
//                 onChange={(event) => setEditedColis({ ...editedColis, status: event.target.value })}
//             >
//                 {/* options here */}
//             </select>

//             <label htmlFor="nomClient">Nom client :</label>
//             <input
//                 type="text"
//                 id="nomClient"
//                 value={editedColis.nomClient}
//                 onChange={(event) => setEditedColis({ ...editedColis, nomClient: event.target.value })}
//             />

//             <label htmlFor="prenomClient">Prenom client :</label>
//             <input
//                 type="text"
//                 id="nomClient"
//                 value={editedColis.prenomClient}
//                 onChange={(event) => setEditedColis({ ...editedColis, prenomClient: event.target.value })}
//             />

//             <br /><br />

//             <label htmlFor="telClient">Téléphone client :</label>
//             <br />
//             <input
//                 type="tel"
//                 id="telClient"
//                 value={editedColis.num_client}
//                 onChange={(event) => setEditedColis({ ...editedColis, num_client: event.target.value })}
//             />

//             <br /><br />

//             <label htmlFor="dateCreation" className="date-picker">Date de création :</label>
//             <input
//                 type="date"
//                 id="dateCreation"
//                 value={editedColis.date_creation}
//                 onChange={(event) => setEditedColis({ ...editedColis, date_creation: event.target.value })}
//             />

//             <br /><br />

//             <label htmlFor="nomArticle">Nom article :</label>
//             <input
//                 type="text"
//                 id="nomArticle"
//                 value={editedColis.nomArticle}
//                 onChange={(event) => setEditedColis({ ...editedColis, nomArticle: event.target.value })}
//             />

//             {/* Save and Cancel buttons */}
//             <button onClick={() => onSaveChanges(editedColis)}>Enregistrer</button>
//             <button onClick={onCancel} style={{ marginLeft: '10px' }}>Annuler</button>
//             <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
//             </div>
//         </div>
//     );
// }

// export default ModifierColis;