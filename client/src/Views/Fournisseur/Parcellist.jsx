import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MiniDrawerfourisseur from "../../Components/SideBar";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import {styled} from "@mui/material/styles";

const Parcellist = () => {
    const [colisList, setColisList] = useState([]);
    const [rows, setRows] = useState([]);

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
    const columns = [

        {field: 'id', headerName: 'ID', minWidth: 120},
        {field: 'nomClient', headerName: 'Nom', minWidth: 100},
        {field: 'prenomClient', headerName: 'Prénom', minWidth: 100},
        {field: 'destination', headerName: 'Destination', minWidth: 200},
        {field: 'num_client', headerName: 'Téléphone', minWidth: 120},
        {field: 'prix', headerName: 'Prix', minWidth: 100},
        {field: 'status', headerName: 'Status', minWidth: 120},
        {field: 'date_creation', headerName: 'date_creation', minWidth: 150},
        {
            Field: 'actions',
            headerName: 'Actions',
            minWidth: 100,
            renderCell: (params) => (
                <div>
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
    return (
        <>
            <MiniDrawerfourisseur/>
            <Div sx={{marginLeft: '200px',}}> Liste des colis</Div>
            <Box sx={{
                position: 'static', marginLeft: '200px', overflow: 'auto', height: 600,
                width: 1100, boxShadow: 3, backgroundColor: '#F5F5F5', marginBottom: '100px',
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    pagination={true}
                />
            </Box>
            </>
    );
};

export default Parcellist;