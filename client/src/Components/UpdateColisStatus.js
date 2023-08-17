import axios from 'axios';
export async function updateColisStatus (colisIds)  {
    try {
        const response = await axios.put('http://localhost:3000/updateColisStatus', { colisIds }, {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        });


        console.log(response.data.message); // Success message
    } catch (error) {
        console.error('Error updating colis statuses:', error);
    }
};
