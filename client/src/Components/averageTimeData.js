import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Paper from '@mui/material/Paper';

const TimeDifferenceChart = () => {
    const [timeDifferences, setTimeDifferences] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/getAverageDelivery', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                setTimeDifferences(response.data.timeDifferences);
            })
            .catch(error => {
                console.error('Error fetching time differences:', error);
            });
    }, []);

    const data = [{ name: 'Time Difference', value: timeDifferences[0] }];

    return (
        <Paper elevation={3} style={{ width: '100%', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2>Delivery Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '20px' }}>
                {timeDifferences.length > 0 && (
                    <div>
                        Average Delivery Time : {timeDifferences[0].toFixed(2)} hours
                    </div>
                )}
            </div>
        </Paper>
    );
};

export default TimeDifferenceChart;

