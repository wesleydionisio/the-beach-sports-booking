import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados mockados
const data = [
  { mes: 'Jan', receita: 12400 },
  { mes: 'Fev', receita: 15600 },
  { mes: 'Mar', receita: 18900 },
  { mes: 'Abr', receita: 17800 },
  { mes: 'Mai', receita: 21200 },
  { mes: 'Jun', receita: 19500 },
];

const RevenueChart = () => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Receita Mensal
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip 
              formatter={(value) => [formatCurrency(value), 'Receita']}
              labelStyle={{ color: 'black' }}
            />
            <Bar dataKey="receita" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default RevenueChart; 