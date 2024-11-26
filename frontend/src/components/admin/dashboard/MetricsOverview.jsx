import React from 'react';
import { Grid } from '@mui/material';
import MetricCard from './MetricCard';
import {
  People,
  SportsTennis,
  EventNote,
  AttachMoney
} from '@mui/icons-material';

const metrics = [
  {
    title: 'Total de Usuários',
    value: '156',
    icon: <People />,
    color: '#1976d2'
  },
  {
    title: 'Quadras Ativas',
    value: '8',
    icon: <SportsTennis />,
    color: '#2e7d32'
  },
  {
    title: 'Agendamentos Hoje',
    value: '12',
    icon: <EventNote />,
    color: '#ed6c02'
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 15.680',
    icon: <AttachMoney />,
    color: '#9c27b0'
  }
];

const MetricsOverview = () => {
  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <MetricCard {...metric} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsOverview; 