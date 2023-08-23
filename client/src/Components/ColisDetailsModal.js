
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import IconButton from "@mui/material/IconButton";
import {MdOutlineClose} from "react-icons/md";

const ColisDetailsModal = ({ isOpen, onClose, colis }) => {
    const StyledDiv = styled('div')({
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '10px',
    });
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparent white background
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', // Shadow
                p: 3,
                overflow: 'auto',
                borderRadius: '5px', // Optional: Add rounded corners
                width: '800px',
            }}>
                <IconButton
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={onClose}
                >
                    <MdOutlineClose />
                </IconButton>
                {/* Display detailed information about the 'colis' */}
                {colis && (
                    <div style={{ padding: '20px' }}>
                        <h2 style={{ marginBottom: '10px' }}>Colis Details</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <StyledDiv><strong>ID:</strong> {colis.id}</StyledDiv>
                                <StyledDiv><strong>Fournisseur:</strong> {colis.fournisseur.nom}</StyledDiv>
                                <StyledDiv><strong>Fournisseur Numero:</strong> {colis.fournisseur.telephone}</StyledDiv>
                                <StyledDiv><strong>Fournisseur Adresse:</strong> {colis.fournisseur.address}</StyledDiv>
                                <StyledDiv><strong>Destination:</strong> {colis.destination}</StyledDiv>
                                <StyledDiv><strong>Num Client:</strong> {colis.num_client}</StyledDiv>
                                <StyledDiv><strong>Nom Client:</strong> {colis.nomClient}</StyledDiv>
                            </div>
                            <div>
                                <StyledDiv><strong>Prénom Client:</strong> {colis.prenomClient}</StyledDiv>
                                <StyledDiv><strong>Status:</strong> {colis.status}</StyledDiv>
                                <StyledDiv><strong>Date Entered Stock:</strong> {colis.dateEntredStock}</StyledDiv>
                                <StyledDiv><strong>Date Pickup:</strong> {colis.datePickup}</StyledDiv>
                                <StyledDiv><strong>Date Livraison:</strong> {colis.dateLivraison}</StyledDiv>
                                <StyledDiv><strong>Retour Count:</strong> {colis.retourCount}</StyledDiv>
                                <StyledDiv><strong>Livreur:</strong> {colis.livreur ? colis.livreur.nom : 'N/A'}</StyledDiv>
                                <StyledDiv><strong>Livreur Pickup:</strong> {colis.livreurPickup ? colis.livreurPickup.nom : 'N/A'}</StyledDiv>
                            </div>
                        </div>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

export default ColisDetailsModal;

