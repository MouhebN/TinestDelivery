import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Paper from "@mui/material/Paper";

const TopLivreurChart = () => {
    const [topLivreurs, setTopLivreurs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/getTopLivreur', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                setTopLivreurs(response.data);
            })
            .catch(error => {
                console.error('Error fetching top livreur data:', error);
            });
    }, []);
    return (
        <Paper elevation={3} style={{ width: '100%', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2>Top Livreurs</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topLivreurs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default TopLivreurChart;
