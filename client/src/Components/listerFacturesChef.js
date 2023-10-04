import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FacturePdf from './facturePdf';

const ListFactures = () => {
    const [factures, setFactures] = useState([]);
    const [selectedFacture, setSelectedFacture] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/listFactures', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })
            .then(response => {
                setFactures(response.data);
            })
            .catch(error => {
                console.error('Error fetching factures data:', error);
            });
    }, []);
    const filteredFactures = factures.filter(facture => {
        const query = searchQuery.toLowerCase();
        return (
            facture._id.toLowerCase().includes(query) ||
            facture.date.toLowerCase().includes(query) ||
            facture.totalAmount.toString().includes(query) ||
            facture.etat.toLowerCase().includes(query)
        );
    });

    return (
        <Box sx={{ marginTop: 4 }}>
            <Typography variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: 2 }}>
                Facture List
            </Typography>
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                sx={{ marginTop: 2 }}
            />
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Facture ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFactures.map(facture => (
                            <React.Fragment key={facture._id}>
                                <TableRow>
                                    <TableCell>{facture._id}</TableCell>
                                    <TableCell>{facture.date}</TableCell>
                                    <TableCell>{facture.totalAmount}</TableCell>
                                    <TableCell>{facture.etat}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => setSelectedFacture(selectedFacture === facture ? null : facture)}>
                                            {selectedFacture === facture ? 'Hide Details' : 'Show Details'}
                                        </Button>
                                        <PDFDownloadLink document={<FacturePdf facture={facture} />}
                                                         fileName={`Facture_${facture._id}.pdf`}>
                                            {({ loading }) => (loading ? 'Generating PDF...' : 'Print')}
                                        </PDFDownloadLink>
                                    </TableCell>
                                </TableRow>
                                {selectedFacture === facture && (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Product Name</TableCell>
                                                            <TableCell>Quantity</TableCell>
                                                            <TableCell>Unit Price</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {facture.purchases.map((purchase, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{purchase.productName}</TableCell>
                                                                <TableCell>{purchase.quantity}</TableCell>
                                                                <TableCell>{purchase.unitPrice}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ListFactures;

