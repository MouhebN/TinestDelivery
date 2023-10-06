import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TableCell} from '@mui/material';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import MiniDrawerfourisseur from '../../Layouts/sideBarColis';

const DetailColis = ({ colisId, onClose }) => {
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    if (colisId) {
      axios.get(`http://localhost:3000/historique-colis/${colisId}`, {
        headers: {
          "x-access-token": localStorage.getItem('token')
        }
      })
      .then(response => {
        setHistorique(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'historique du colis :', error);
      });
    }
  }, [colisId]);

  return (
    <>
    <MiniDrawerfourisseur/>

    <Dialog open={true} onClose={onClose}>
        <DialogTitle><h2>Historique du colis</h2></DialogTitle>
        <DialogContent>
        <div>
        <TableContainer>
      <Table>
      <TableHead>
      <TableRow>
            <TableCell>Date</TableCell>
            <TableCell> Statut</TableCell>
      </TableRow>
      </TableHead>      
      <TableBody>
          {historique.map(item => (
            <TableRow key={item._id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.statut}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </DialogContent>
          <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          </DialogActions>
          <footer>
          <p>&copy; 2023 TinestDelivery</p>
        </footer>
    </Dialog>
</>    
  );
};

export default DetailColis;
