import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'PIX', value: 60 },
  { name: 'Cartão de Crédito', value: 30 },
  { name: 'Dinheiro', value: 10 },
];

const COLORS = ['#2196f3', '#4caf50', '#ff9800'];

const PaymentMethodsChart = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Métodos de Pagamento
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default PaymentMethodsChart; 