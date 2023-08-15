import React, {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AttribuerColisAuLivreur from "./Views/Magasinier/attribuerColisAuLivreur";
import AjoutColis from "./Views/Magasinier/ajoutColisScan";
import RetourColisAuStock from "./Views/Magasinier/retourColisAuStock";
import ConsulterStock from "./Views/Magasinier/consulterStock";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import ConsulterColis from "./Views/Livreur/consulterColis";
import PaymentColisClient from "./Views/Livreur/paiement";
import RetourAuFournisseurColis from "./Views/Livreur/retourFournisseur";
import ScanPickup from "./Views/Livreur/scanPickUp";
import SignInSide from "./Views/Login/logIn";


const theme = createTheme({
    palette: {
        background: {
            default: '#F9F9F9', // Replace with your desired default background color
            paper: '#ffffff',   // Replace with your desired paper background color
        },
    },
});

function App() {
    const [userRole, setUserRole] = useState('');

    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // Set the user's role based on the token
    const setUserRoleFromToken = (token) => {
        try {
            const decodedToken = jwt_decode(token);
            const role = decodedToken.role;
            setUserRole(role);
        } catch (error) {
            console.error('Error decoding token:', error);
            setUserRole(''); // Set role to an empty string in case of error
        }
    };

    useEffect(() => {
        // Call the function with the retrieved token
        setUserRoleFromToken(token);
    }, [token]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={<SignInSide setUserRoleFromToken={setUserRoleFromToken} />}
                        />
                        {userRole === 'magasinier' && (
                            <>
                                <Route path="/ajouterColisAuStock" element={<AjoutColis />} />
                                <Route path="/attribuerColis" element={<AttribuerColisAuLivreur />} />
                                <Route path="/retournerColis" element={<RetourColisAuStock />} />
                                <Route path="/getStockColis" element={<ConsulterStock />} />
                            </>
                        )}
                        {userRole === 'livreur' && (
                            <>
                                <Route path="/getLivreurColis" element={<ConsulterColis />} />
                                <Route path="/payementColis" element={<PaymentColisClient />} />
                                <Route path="/retourAuFournisseur" element={<RetourAuFournisseurColis />} />
                                <Route path="/scanPickup" element={<ScanPickup />} />
                            </>
                        )}
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    );
}

export default App;


