import React from 'react';
import { Page, Text, Document, StyleSheet, View,Image  } from '@react-pdf/renderer';
// Create styles
const styles = StyleSheet.create({
    logo: {
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        alignSelf: 'flex-end',
        marginTop: 20,
    },
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    section: {
        margin: 10,
    },
    factureHeader: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    factureDetails: {
        fontSize: 14,
        marginBottom: 10,
    },
    tableHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        width: '33%',
        padding: 5,
        border: '1px solid black',
    },
    tableRow: {
        fontSize: 10,
        width: '33%',
        padding: 5,
        border: '1px solid black',
    },
});

const FacturePdf = ({ facture }) => (
    <Document>

        <Page size="A4" style={styles.page}>
            <Image src="/logo.png" style={styles.logo} />
            <Text style={styles.factureHeader}>Facture</Text>
            <Text style={styles.factureDetails}>Facture ID: {facture._id}</Text>
            <Text style={styles.factureDetails}>Date: {facture.date}</Text>
            <Text style={styles.factureDetails}>Total Amount: {facture.totalAmount}</Text>
            <Text style={styles.factureDetails}>Etat: {facture.etat}</Text>

            <Text style={styles.section}>Purchases:</Text>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.tableHeader}>Product Name</Text>
                <Text style={styles.tableHeader}>Quantity</Text>
                <Text style={styles.tableHeader}>Unit Price</Text>
            </View>
            {facture.purchases.map((purchase, index) => (
                <View key={index} style={{ flexDirection: 'row' }}>
                    <Text style={styles.tableRow}>{purchase.productName}</Text>
                    <Text style={styles.tableRow}>{purchase.quantity}</Text>
                    <Text style={styles.tableRow}>{purchase.unitPrice}</Text>
                </View>
            ))}
        </Page>
    </Document>
);


export default FacturePdf;
