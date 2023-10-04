import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MiniDrawerfourisseur from "../../Components/SideBar";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History"; // Nouvelle icône pour l'historique
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import DetailColis from './DetailColis';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Modal from 'react-modal'; // Ajoutez cette ligne


const ParcelList = () => {
    const [colisList, setColisList] = useState([]);
    const [rows, setRows] = useState([]);
    const [selectedColisHistory, setSelectedColisHistory] = useState(null); // État pour stocker l'historique du colis
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);


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
    }, [colisList]);

    const handleDelete = async (colisId) => {
        try {
            const colis = rows.find(row => row.id === colisId);
            if (colis && !["livré", "livré et payé", "payé fournisseur", "en cours"].includes(colis.status)) {
                console.log("colisId  : ", colisId);
                await axios.get(`http://localhost:3000/${colisId}/supprimerColis`, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                });
                console.log('colis supprimé');
                // Rafraîchissez la liste des colis si nécessaire
                setColisList(prevColisList => prevColisList.filter(colis => colis.id !== colisId));
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du colis : ', error);
        }
    };

    

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Colis');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(data, 'colis.xlsx');
    };

    // Fonction pour afficher l'historique du colis
    const showColisHistory = (colis) => {
        setSelectedColisHistory(colis);
        setOpenHistoryDialog(true);
    };

    const handleCloseHistoryDialog = () => {
        setOpenHistoryDialog(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 120 },
        { field: 'nomClient', headerName: 'Nom', minWidth: 100 },
        { field: 'prenomClient', headerName: 'Prénom', minWidth: 100 },
        { field: 'destination', headerName: 'Destination', minWidth: 200 },
        { field: 'num_client', headerName: 'Téléphone', minWidth: 120 },
        { field: 'prix', headerName: 'Prix', minWidth: 100 },
        { field: 'status', headerName: 'Status', minWidth: 120 },
        { field: 'date_creation', headerName: 'Date de création', minWidth: 150 },
        {
            Field: 'actions',
            headerName: 'Actions',
            minWidth: 200,
            renderCell: (params) => (
                <div>
                    <IconButton
                        onClick={() => handleDelete(params.row.id)}
                        disabled={["livré", "livré et payé", "payé fournisseur"].includes(params.row.status)}
                    >
                        <DeleteIcon style={{ color: ["livré", "livré et payé", "payé fournisseur"].includes(params.row.status) ? 'grey' : 'red' }} />
                    </IconButton>
                    {/* <IconButton
                        onClick={() => showColisHistory(params.row)}
                        disabled={["livré", "livré et payé", "payé fournisseur", "en cours"].includes(params.row.status)}
                    >
                        <HistoryIcon style={{ color: ["livré", "livré et payé", "payé fournisseur", "en cours"].includes(params.row.status) ? 'grey' : 'blue' }} />
                    </IconButton> */}
                </div>
            ),
        },
    ];

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
    }));

    return (
        <>
            <MiniDrawerfourisseur />
            <Div sx={{ marginLeft: '200px', position: 'relative', width: 1300, left: 140, fontSize: 20, fontWeight: 'bold' }}> Liste des colis</Div>
            <Box sx={{
                position: 'static', marginLeft: '200px', overflow: 'auto', height: 600, position: 'relative', width: 1300, marginLeft: '200px', left: 140,
                width: 1300, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination={true}
                />
            </Box>

            {/* Dialogue pour afficher l'historique */}
            <Dialog open={openHistoryDialog} onClose={handleCloseHistoryDialog}>
                <DialogTitle>Histoire du colis</DialogTitle>
                <DialogContent>
                    {selectedColisHistory && selectedColisHistory.history && selectedColisHistory.history.map((item, index) => (
                        <div key={index}>
                            <p><strong>Date: </strong>{item.date}</p>
                            <p><strong>Statut: </strong>{item.status}</p>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHistoryDialog} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ marginLeft: '200px', position: 'relative', width: 1300, left: 140, fontSize: 20, fontWeight: 'bold' }}>
            <button className="action-button"  onClick={exportToExcel}>Export to Excel</button>
            </div>

        </>
    );
};

export default ParcelList;
