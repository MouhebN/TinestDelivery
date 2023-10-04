import MiniDrawerChefAgence from "../../Layouts/sideBarChefAgence";
import React from "react";
import AjouterFacture from "../../Components/ajouterFacture";
import Box from "@mui/material/Box";
import ListFactures from "../../Components/listerFacturesChef";
import Divider from "@mui/material/Divider";


function Facture() {
    return (
        <Box>
            <MiniDrawerChefAgence/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 64px)', // Adjust the value to leave space for the app bar
                    padding: 2,
                    width: 800,
                    marginLeft: 25
                }}
            >
                <AjouterFacture/>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2,
                    width: 900,
                    marginLeft: 25
                }}
            >
                <ListFactures />
            </Box>
        </Box>
    );
}

export default Facture;
