import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BookingsChart = ({ data }) => {
  useEffect(() => {
    console.log('9. BookingsChart recebeu dados:', data);
  }, [data]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ocupação por Quadra
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalReservas" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default BookingsChart; 