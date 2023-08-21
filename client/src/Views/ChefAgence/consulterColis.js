import MiniDrawerChefAgence from "../../Layouts/sideBarChefAgence";
import React from "react";
import ColisEnAttenteChef from "../../Components/getColisEnAttenteChef";
import ColisAgenceChef from "../../Components/getColisAgence";
import {styled} from "@mui/material/styles";

function ConsulterColisChef() {
    const StyledDiv = styled('div')({
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '10px',
    });
    return (
        <>
            <MiniDrawerChefAgence/>
            <StyledDiv mt={2} sx={{
                marginBottom: '100px',
                position: 'static',
                marginLeft: '259px',
                marginRight: '100px',
                overflow: 'auto',
                backgroundColor: '#ECF2FF'
            }}>Liste de
                Colis en attente :</StyledDiv>

            <ColisEnAttenteChef/>
            <StyledDiv mt={2} sx={{
                marginBottom: '100px',
                position: 'static',
                marginLeft: '259px',
                marginRight: '100px',
                overflow: 'auto',
                backgroundColor: '#ECF2FF'
            }}>Liste de
                Colis :</StyledDiv>


            <ColisAgenceChef/>
        </>
    )
}

export default ConsulterColisChef;