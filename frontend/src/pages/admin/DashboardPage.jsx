import React, { useEffect, useState } from 'react';
import { Grid, Box, Alert } from '@mui/material';
import {
  CalendarToday,
  PendingActions,
  CheckCircle,
  Cancel,
  People,
  AttachMoney,
  Schedule
} from '@mui/icons-material';
import MetricCard from '../../components/admin/dashboard/components/MetricCard';
import PageHeader from '../../components/admin/common/PageHeader';
import { dashboardService } from '../../services/admin/dashboardService';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (error) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const dashboardMetrics = [
    {
      id: 'today',
      title: 'Agendamentos Hoje',
      value: metrics?.schedules?.today || 0,
      icon: CalendarToday,
      color: 'primary'
    },
    {
      id: 'pending',
      title: 'Agendamentos Pendentes',
      value: metrics?.schedules?.pending || 0,
      icon: PendingActions,
      color: 'warning'
    },
    {
      id: 'confirmed',
      title: 'Agendamentos Confirmados',
      value: metrics?.schedules?.confirmed || 0,
      icon: CheckCircle,
      color: 'success'
    },
    {
      id: 'canceled',
      title: 'Agendamentos Cancelados',
      value: metrics?.schedules?.canceled || 0,
      icon: Cancel,
      color: 'error'
    },
    {
      id: 'users',
      title: 'Usuários Cadastrados',
      value: metrics?.users?.total || 0,
      icon: People,
      color: 'info'
    },
    {
      id: 'payments',
      title: 'Pagamentos Pendentes',
      value: metrics?.payments?.pending || 0,
      icon: AttachMoney,
      color: 'secondary'
    },
    {
      id: 'slots',
      title: 'Horários Disponíveis Hoje',
      value: metrics?.slots?.available || 0,
      icon: Schedule,
      color: 'success'
    }
  ];

  return (
    <Box>
      <PageHeader 
        title="Dashboard" 
        subtitle="Visão geral do seu negócio"
      />

      <Grid container spacing={3}>
        {dashboardMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={metric.id}>
            <MetricCard
              {...metric}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Aqui virão os próximos componentes: gráficos e listas */}
    </Box>
  );
};

export default DashboardPage; 