import React, {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AttribuerColisAuLivreur from "./Views/Magasinier/attribuerColisAuLivreur";
import AjoutColis from "./Views/Magasinier/ajoutColisScan";
import RetourColisAuStock from "./Views/Magasinier/retourColisAuStock";
import ConsulterStock from "./Views/Magasinier/consulterStock";
import ConsulterColis from "./Views/Livreur/consulterColis";
import PaymentColisClient from "./Views/Livreur/paiement";
import RetourAuFournisseurColis from "./Views/Livreur/retourFournisseur";
import ScanPickup from "./Views/Livreur/scanPickUp";
import SignInSide from "./Views/Login/logIn";
import GetLivreurAmount from "./Views/ChefAgence/LivreurAmount";
import ConsulterColisChef from "./Views/ChefAgence/consulterColis";
import ConsulterData from "./Views/ChefAgence/dataVisualization";
import SignUp from "./Views/ChefAgence/ajouterCompte";
import AjoutColisChef from "./Views/ChefAgence/ajouterAuStock";
import AttribuerColisAuLivreurChef from "./Views/ChefAgence/attribuerColis";
import RetourColisAuStockChef from "./Views/ChefAgence/scanRetour";
import Facture from "./Views/ChefAgence/facture";
import ListFactures from "./Components/listerFacturesChef";

function App() {
    const [userRole, setUserRole] = useState('');
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

                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={<SignInSide setUserRoleFromToken={setUserRoleFromToken}/>}
                        />
                        {userRole === 'chefAgence' && (
                            <>
                                <Route path="/getLivreurLivredColis" element={<GetLivreurAmount/>}/>
                                <Route path="/getColisEnAttente" element={<ConsulterColisChef/>}/>
                                <Route path="/getData" element={<ConsulterData/>}/>
                                <Route path="/signUp" element={<SignUp/>}/>
                                <Route path="/ajouterColisAuStock" element={<AjoutColisChef/>}/>
                                <Route path="/attribuerColis" element={<AttribuerColisAuLivreurChef/>}/>
                                <Route path="/retournerColis" element={<RetourColisAuStockChef/>}/>
                                <Route path="/ajouterFacture" element={<Facture/>}/>
                                <Route path="/listFactures" component={ListFactures} />
                            </>
                        )}
                        {userRole === 'magasinier' && (
                            <>
                                <Route path="/ajouterColisAuStock" element={<AjoutColis/>}/>
                                <Route path="/attribuerColis" element={<AttribuerColisAuLivreur/>}/>
                                <Route path="/retournerColis" element={<RetourColisAuStock/>}/>
                                <Route path="/getStockColis" element={<ConsulterStock/>}/>
                            </>
                        )}
                        {userRole === 'livreur' && (
                            <>
                                <Route path="/getLivreurColis" element={<ConsulterColis/>}/>
                                <Route path="/payementColis" element={<PaymentColisClient/>}/>
                                <Route path="/retourAuFournisseur" element={<RetourAuFournisseurColis/>}/>
                                <Route path="/scanPickup" element={<ScanPickup/>}/>
                            </>
                        )}
                    </Routes>
                </BrowserRouter>
        </>
    );
}

export default App;


