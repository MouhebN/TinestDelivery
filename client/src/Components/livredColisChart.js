import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const LivredEtPayeColisCountOverTimeChart = () => {
    const [colisCountData, setColisCountData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/getLivredEtPayeColisCountOverTime', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                setColisCountData(response.data);
            })
            .catch(error => {
                console.error('Error fetching livré et payé colis count over time:', error);
            });
    }, []);

    return (
        <Paper elevation={3} sx={{ width: '100%', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2>Livré et Payé Colis Count Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={colisCountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={['auto', 'auto']}
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="colisCount" stroke="#8884d8" name="Livré et Payé" />
                    {/* Add more Line components for other status types */}
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default LivredEtPayeColisCountOverTimeChart;
