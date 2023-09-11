import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import axios from 'axios';
import { FaTimes, FaPrint, FaEdit } from 'react-icons/fa';

import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import TablePagination from '@mui/material/TablePagination';
import ModifierColis from './ColisModif';
import ModifierColisModal from './ModierColisModal';

import ImprimerColis from './ColisImprimer';
import ReactToPrint from 'react-to-print'; // Import the react-to-print library
import '../../App.css';
import MiniDrawerfourisseur from "../../Components/SideBar";

Modal.setAppElement(document.body);

function App() {
    const [recherche, setRecherche] = useState('');
    const [editingColis, setEditingColis] = useState(null);
    const [colis, setColis] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedParcelForPrint, setSelectedParcelForPrint] = useState(null);


    const [nouveauColis, setNouveauColis] = useState({
        status: '',
        nomClient: '',
        prenomClient:'',
        num_client: '',
        date_creation: '',
        qrcode: '',
        nomArticle: '',
    });

    const fetchData = () => {
        axios
            .get('http://localhost:3000/listerColisFournisseur')
            .then((response) => {
                setColis(response.data);
                const colisData = response.data.colisList;

                const formattedColisData = colisData.map((colisItem) => ({
                    ...colisItem,
                    articles: [
                        {
                            description: 'Article 1',
                            prixUnitaireHT: 10,
                            quantite: 2,
                            tva: 0.20,
                            prixTotalHT: 20,
                        },
                        // ... other article objects
                    ],
                }));
                setColis(formattedColisData);

            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const ajouterColis = async () => {
        try {
            if (window.confirm("Voulez-vous vraiment ajouter ce colis ?")) {
                await axios.post('http://localhost:3000/ajouterColis', nouveauColis,{
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                });
                //const confirmed= window.confirm('votre colis a été enregistré avec succés');
                setShowModal(true);

                setNouveauColis({
                    status: '',
                    nomClient: '',
                    prenomClient:'',
                    num_client: '',
                    date_creation: '',
                    qrcode: '',
                    nomArticle: '',
                });

                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(colis);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Colis');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(data, 'colis.xlsx');
    };

    const handleHistorique = (colisId) => {};
    const handleSupprimer = async (colisId) => {
        const shouldDelete = window.confirm("Voulez-vous vraiment supprimer ce colis ?");
        if (shouldDelete) {
            try {
                await axios.delete(`http://localhost:3000/${colisId}/supprimerColis`,{
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                });
                fetchData();
            } catch (error) {
                console.error('Erreur lors de la suppression du colis : ', error);
            }
        }
    };
    const handleModifier = (colisId) => {
        console.log(`Modifier le colis avec l'ID : ${colisId}`);
        // Find the parcel to be edited
        const colisAModifier = colis.find((colisItem) => colisItem._id === colisId);
        setEditingColis(colisAModifier); // Utilisez editingColis au lieu de colisAModifier
        setShowModal(true); // Open the modal for editing
    };


    const handleImprimer = (colisItem) => {
        setSelectedParcelForPrint(colisItem);
        setShowModal(true);
    };


    const handleSubmitModification = async (editedColis) => {
        try {
            const response = await axios.post(`http://localhost:3000/${editedColis._id}/modifierColis`,
                editedColis,
                {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                }
            );
            console.log('Colis mis à jour :', response.data);
            setShowModal(false);
            setEditingColis(null); // Réinitialisez editingColis à null
            fetchData();
        } catch (error) {
            console.error('Erreur lors de la modification du colis : ', error);
        }
    };
    const rechercherColis = () => {
        axios.get(`http://localhost:3000/colis/rechercher-colis?q=${recherche}`)
            .then(response => {
                const filteredColis = response.data.filter(colisItem =>
                    colisItem.nomprenom.toLowerCase().includes(recherche.toLowerCase()) ||
                    colisItem.nomArticle.toLowerCase().includes(recherche.toLowerCase())
                );
                setColis(filteredColis);
            })
            .catch(error => console.error(error));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    return (
        <>
            <MiniDrawerfourisseur/>
        <div style={{ marginTop: 50, padding: 1, position: 'relative', width:1000,marginRight:50,left :140}} >
            <h1>Gestion des colis</h1>

            <form>
                <label htmlFor="status">Status :</label>
                <select
                    id="status"
                    value={nouveauColis.status}
                    onChange={event => setNouveauColis({ ...nouveauColis, status: event.target.value })}
                >
                    <option value="">Tout</option>
                    <option value="En attente">En attente</option>
                    <option value="En stock">En stock</option>
                    <option value="En cours">En cours</option>
                    <option value="Retour en stock">Retour en stock</option>
                    <option value="Retour définitif">Retour définitif</option>
                    <option value="Livrés">Livrés</option>
                    <option value="Livrés payés">Livrés payés</option>
                    <option value="Pickup">Pickup</option>
                    <option value="annulé">Annulé</option>
                    <option value="Echange crée">Échange créé</option>
                    <option value="Echange livré">Échange livré</option>
                </select>


                <label htmlFor="nomClient">Nom client :</label>
                <input
                    type="text"
                    id="nomClient"
                    value={nouveauColis.nomClient}
                    onChange={event => setNouveauColis({ ...nouveauColis, nomClient: event.target.value })}
                />

                <label htmlFor="nomClient">Prenom client :</label>
                <input
                    type="text"
                    id="prenomClient"
                    value={nouveauColis.prenomClient}
                    onChange={event => setNouveauColis({ ...nouveauColis, prenomClient: event.target.value })}
                />

                <label htmlFor="telClient">Téléphone client :</label>
                <br />
                <input
                    type="tel"
                    id="telClient"
                    value={nouveauColis.num_client}
                    onChange={event => setNouveauColis({ ...nouveauColis, num_client: event.target.value })}
                />


                <label htmlFor="dateCreation" className="date-picker">Date de création :</label>
                <input
                    type="date"
                    id="dateCreation"
                    value={nouveauColis.date_creation}
                    onChange={event => setNouveauColis({ ...nouveauColis, date_creation: event.target.value  })}
                />


                <label htmlFor="nomArticle">Nom article :</label>
                <input
                    type="text"
                    id="nomArticle"
                    value={nouveauColis.nomArticle}
                    onChange={event => setNouveauColis({ ...nouveauColis, nomArticle: event.target.value })}
                />

                <button type="button" style={{ marginTop: 20 }} onClick={ajouterColis}>Ajouter</button>

                <label htmlFor='rechercher'>Rechercher</label>
                <input
                    type="text"
                    id="recherche"
                    placeholder="Nom client / Nom article"
                    value={recherche}
                    onChange={event => setRecherche(event.target.value)}
                />


                <button className="rechercher-button" onClick={rechercherColis}>Rechercher</button>
                <button className="action-button"  onClick={exportToExcel}>Export to Excel</button>
                <br /><br />
            </form>


            <table className="colis-table" >
                <thead>
                <tr>
                    <th>Status</th>
                    <th>Nom client</th>
                    <th>Prenom client</th>
                    <th>Téléphone client</th>
                    <th>Date de création</th>
                    <th>Nom article</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {colis.map(colisItem => (
                    <tr key={colisItem._id}>
                        <td>{colisItem.status}</td>
                        <td>{colisItem.nomClient}</td>
                        <td>{colisItem.prenomClient}</td>
                        <td>{colisItem.num_client}</td>
                        <td>{colisItem.date_creation}</td>
                        <td>{colisItem.nomArticle}</td>
                        <td>
                            <button onClick={() => handleHistorique(colisItem._id)}>Historique</button>
                            <FaPrint
                                className="print-icon"
                                style={{ marginLeft: '10px', fontSize: '1.2rem', color: '#007bff', cursor: 'pointer' }}
                                onClick={() => handleImprimer(colisItem)}  // Pass the whole colisItem object
                            />
                            <FaEdit
                                className="edit-icon"
                                style={{ marginLeft: '10px', fontSize: '1.2rem', color: 'green', cursor: 'pointer' }}
                                onClick={() => handleModifier(colisItem._id)} // Open the modal for editing
                            />
                            <FaTimes
                                className="delete-icon"
                                style={{ color: 'red', fontWeight: 'bold' }}
                                onClick={() => handleSupprimer(colisItem._id)}
                            />

                        </td>
                    </tr>
                ))}
                </tbody>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={colis.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </table>
            <Modal
                isOpen={showModal}
                onRequestClose={() => {
                    setShowModal(false);
                    setEditingColis(null);
                    setSelectedParcelForPrint(null); // Reset selected parcel

                }}
            >
                {editingColis && (
                    <ModifierColis
                        colis={editingColis}
                        onSave={handleSubmitModification}
                        onCancel={() => setEditingColis(null)}    />
                )}
                {selectedParcelForPrint && (

                    <ImprimerColis
                        colis={selectedParcelForPrint}
                        onClose={() => {
                            setSelectedParcelForPrint(null);
                            setShowModal(false);
                        }}
                    />

                )}

            </Modal>

            <ModifierColisModal
                isOpen={Boolean(editingColis)}
                colis={editingColis}
                onSave={handleSubmitModification}
                onCancel={() => setEditingColis(null)}
            />
        </div>
            </>
    );
}
class ImprimerColisModal extends React.Component {
    render() {
        return (
            <Modal
                isOpen={true} // Ensure the modal is open when printing
                onRequestClose={this.props.onClose}
            >
                <ImprimerColis colis={this.props.colis} />
                {/* Use the ReactToPrint component to handle printing */}
                <ReactToPrint
                    trigger={() => <button>Print</button>}
                    content={() => this.componentRef}
                />
            </Modal>

        );
    }
}
export default App;