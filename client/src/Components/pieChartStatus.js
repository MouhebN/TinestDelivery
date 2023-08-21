import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Paper from '@mui/material/Paper';

const StatusDistributionChart = () => {
    const [statusDistribution, setStatusDistribution] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/getStatusData',{
            headers: {
                "x-access-token": localStorage.getItem('token')
            }})
            .then(response => {
                setStatusDistribution(response.data);
            })
            .catch(error => {
                console.error('Error fetching status distribution:', error);
            });
    }, []);

    const COLORS = [
        '#0088FE',
        '#00C49F',
        '#FFBB28',
        '#FF8042',
        '#FF6868',
        '#8884D8',
        '#82CA9D',
        '#FFD700',
        '#FF6347',
        '#7B68EE',
    ];

    return (
      <Paper elevation={3} style={{ width: '100%', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <ResponsiveContainer width="100%" height={300} marginLeft={500}>
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={Object.entries(statusDistribution).map(([status, value]) => ({ status, value }))}
                        cx="50%"
                        cy="50%"
                        startAngle={0}
                        endAngle={360}
                        outerRadius={80}
                        fill="#8884d8"
                        labelLine={false}
                        label={false}
                    >
                        {Object.keys(statusDistribution).map((status, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${(props.payload.percent * 100).toFixed(2)}%`, name]} />
                </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '20px' }}>
                {Object.entries(statusDistribution).map(([status, value], index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: COLORS[index % COLORS.length], marginRight: '10px', borderRadius: '50%' }}></div>
                        <div>{status} - {`${(value * 100 / Object.values(statusDistribution).reduce((a, b) => a + b, 0)).toFixed(2)}%`}</div>
                    </div>
                ))}
            </div>
        </Paper>
    );
};

export default StatusDistributionChart;




