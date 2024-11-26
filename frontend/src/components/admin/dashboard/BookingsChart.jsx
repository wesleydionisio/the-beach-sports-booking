import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { dia: 'Seg', agendamentos: 4 },
  { dia: 'Ter', agendamentos: 6 },
  { dia: 'Qua', agendamentos: 8 },
  { dia: 'Qui', agendamentos: 5 },
  { dia: 'Sex', agendamentos: 9 },
  { dia: 'Sáb', agendamentos: 12 },
  { dia: 'Dom', agendamentos: 7 },
];

const BookingsChart = () => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Agendamentos da Semana
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="agendamentos" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BookingsChart; 