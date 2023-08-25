import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Grid, Paper } from '@mui/material';

const AjouterFacture = () => {
    const [purchases, setPurchases] = useState([{ productName: '', quantity: 0, unitPrice: 0 }]);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleAddPurchase = () => {
        setPurchases(prevPurchases => [...prevPurchases, { productName: '', quantity: 0, unitPrice: 0 }]);
    };
    const handleRemovePurchase = index => {
        // Remove a purchase from the purchases array
        const updatedPurchases = purchases.filter((_, i) => i !== index);
        setPurchases(updatedPurchases);
    };

    const handlePurchaseChange = (index, field, value) => {
        const updatedPurchases = [...purchases];
        updatedPurchases[index][field] = value;
        setPurchases(updatedPurchases);
        updateTotalAmount(updatedPurchases);
    };

    const updateTotalAmount = (updatedPurchases) => {
        const calculatedTotal = updatedPurchases.reduce((total, purchase) => {
            const { quantity, unitPrice } = purchase;
            return total + (quantity * unitPrice);
        }, 0);
        setTotalAmount(calculatedTotal);
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:3000/ajouterFacture', {
                purchases,
                totalAmount,
            }, {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            });
            setPurchases([{ productName: '', quantity: 0, unitPrice: 0 }]);
            setTotalAmount(0);
            alert('Facture created successfully');
        } catch (error) {
            console.error('Error creating facture:', error);
            alert('Error creating facture. Please try again.');
        }
    };

    return (
        <div>
            <Typography variant="h4" variant="h4" sx={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: 2 }} gutterBottom>Ajouter Facture</Typography>
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Grid container spacing={2}>
                    {purchases.map((purchase, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <TextField
                                label="Product Name"
                                fullWidth
                                value={purchase.productName}
                                onChange={e => handlePurchaseChange(index, 'productName', e.target.value)}
                            />
                            <TextField
                                label="Quantity"
                                type="number"
                                fullWidth
                                value={purchase.quantity}
                                onChange={e => handlePurchaseChange(index, 'quantity', e.target.value)}
                            />
                            <TextField
                                label="Unit Price"
                                type="number"
                                fullWidth
                                value={purchase.unitPrice}
                                onChange={e => handlePurchaseChange(index, 'unitPrice', e.target.value)}
                            />
                            <Button variant="outlined" color="error" onClick={() => handleRemovePurchase(index)}>Remove</Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            <Button onClick={handleAddPurchase} variant="outlined">Add Purchase</Button>
            <Typography variant="h6" gutterBottom>Total Amount: {totalAmount}</Typography>
            <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </div>
    );
};

export default AjouterFacture;


