import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import MetricCard from './MetricCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TodayIcon from '@mui/icons-material/Today';

const MetricsOverview = ({ metrics }) => {
  useEffect(() => {
    console.log('8. MetricsOverview recebeu props:', metrics);
  }, [metrics]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Total de Reservas"
          value={metrics?.totalReservas || 0}
          icon={<CalendarMonthIcon />}
          color="#4CAF50"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Receita Total"
          value={`R$ ${(metrics?.receitaTotal || 0).toFixed(2)}`}
          icon={<AttachMoneyIcon />}
          color="#2196F3"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Reservas Hoje"
          value={metrics?.reservasHoje || 0}
          icon={<TodayIcon />}
          color="#9C27B0"
        />
      </Grid>
    </Grid>
  );
};

export default MetricsOverview; 