// totalAmountCalculator.js

import axios from 'axios';

export async function calculateTotalAmountForLivreur(selectedLivreur) {
    try {
        const response = await axios.get('http://localhost:3000/getLivreurTotal', {
            params: { livreurId: selectedLivreur },
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        });

        return response.data.totalAmount;
    } catch (error) {
        console.error('Error fetching total amount:', error);
        return 0;
    }
}
