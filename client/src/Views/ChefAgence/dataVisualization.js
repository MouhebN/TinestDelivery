import MiniDrawerChefAgence from "../../Layouts/sideBarChefAgence";
import React from "react";
import ColisStatusCounts from "../../Components/StatusCountBoxes";
import StatusDistributionChart from "../../Components/pieChartStatus";
import Box from "@mui/material/Box";
import TimeDifferenceChart from "../../Components/averageTimeData";
import LivredEtPayeColisCountOverTimeChart from "../../Components/livredColisChart";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TopLivreurChart from "../../Components/topLivreur";
import ColisVolumeByFournisseurChart from "../../Components/FournsissseurVolume";


function ConsulterData() {
    return (
        <>
            <MiniDrawerChefAgence/>
            <Box sx={{ mx: '3%', mt: '3%', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', textAlign: 'center' ,marginLeft:'100px'}}>
                <Grid item xs={12} sx={{ p: 3 }}>
                    <ColisStatusCounts />
                </Grid>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{padding: '20px', marginLeft: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{padding: '30px', width: '60%', marginRight: '15px',boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <ColisVolumeByFournisseurChart />
                </Box>
                <Box sx={{ padding: '30px',width: '30%', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <TimeDifferenceChart />
                </Box>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{padding: '20px', marginLeft: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ padding: '30px',width: '60%', marginRight: '15px' ,boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <LivredEtPayeColisCountOverTimeChart />
                </Box>
                <Box sx={{padding: '30px', width: '30%', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <StatusDistributionChart />
                </Box>
            </Box >
            <Divider sx={{ my: 3 }} />
            <Box sx={{padding: '20px', marginLeft: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ padding: '30px',width: '60%', marginRight: '15px' ,boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <TopLivreurChart />
                </Box>
            </Box >
        </>
    );
}

export default ConsulterData;
