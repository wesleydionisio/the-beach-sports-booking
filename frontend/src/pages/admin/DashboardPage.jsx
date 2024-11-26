import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography,
  CircularProgress
} from '@mui/material';
import axios from '../../api/apiService';
import { useSnackbar } from 'notistack';
import MetricsOverview from '../../components/admin/dashboard/MetricsOverview';
import BookingsChart from '../../components/admin/dashboard/BookingsChart';
import BookingsTable from '../../components/admin/dashboard/BookingsTable';
import PeakHoursChart from '../../components/admin/dashboard/PeakHoursChart';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log('1. Iniciando busca de métricas...');
        const response = await axios.get('/dashboard/metrics');
        console.log('2. Resposta da API:', response.data);
        
        if (response.data.success && response.data.metrics) {
          console.log('3. Métricas recebidas:', response.data.metrics);
          setMetrics(response.data.metrics);
        } else {
          throw new Error('Formato de resposta inválido');
        }
        
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          response: error.response?.data
        });
        enqueueSnackbar('Erro ao carregar métricas do dashboard', { 
          variant: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [enqueueSnackbar]);

  // Log quando as métricas são atualizadas no estado
  useEffect(() => {
    if (metrics) {
      console.log('4. Estado de métricas atualizado:', metrics);
    }
  }, [metrics]);

  if (loading) {
    console.log('5. Dashboard em loading...');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Visão geral das métricas */}
      <MetricsOverview metrics={metrics} />

      {/* Gráfico de Horários de Pico */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <PeakHoursChart 
              data={metrics?.horariosPico || []} 
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Tabela de últimas reservas */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <BookingsTable 
          bookings={metrics?.ultimasReservas || []} 
          onDataLoad={(bookings) => console.log('7. Dados da tabela:', bookings)}
        />
      </Paper>
    </Box>
  );
};

export default DashboardPage; 