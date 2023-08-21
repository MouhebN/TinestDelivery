import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomHorizontalBarChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nom" type="category" />
                <Tooltip />
                <Bar dataKey="volume" fill="#8884d8" />
                {data.map((entry, index) => (
                    <div
                        key={`line-${index}`}
                        sx={{
                            position: 'relative',
                            backgroundColor: '#f0f0f0',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '12px',
                            color: '#8884d8',
                            opacity: 0.7,
                            transition: 'height 1s ease',
                            height: `${100 / data.length}%`
                        }}
                    >
                        {entry.volume}
                    </div>
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

const ColisVolumeByFournisseurChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/getColisVolumeByFournisseur', {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
        })
            .then(response => {
                setChartData(response.data);
            })
            .catch(error => {
                console.error('Error fetching colis volume by fournisseur data:', error);
            });
    }, []);

    return <CustomHorizontalBarChart data={chartData} />;
};

export default ColisVolumeByFournisseurChart;


