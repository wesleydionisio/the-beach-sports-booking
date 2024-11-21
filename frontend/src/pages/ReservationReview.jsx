import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/apiService';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReservationReview = () => {
  const { reservationId } = useParams(); // Mudado de id para reservationId para match com a rota
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservationDetails = async () => {
    try {
      console.log('Buscando reserva:', reservationId);
      const response = await axios.get(`/bookings/${reservationId}`);
      console.log('Resposta:', response.data);
      
      if (response.data && response.data.success) {
        setReservation(response.data.reservation || response.data.booking);
      } else {
        throw new Error('Dados da reserva não encontrados na resposta');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      console.log('Detalhes do erro:', error.response?.data);
      
      const errorMessage = error.response?.status === 404
        ? 'Reserva não encontrada'
        : error.response?.data?.message || 'Erro ao carregar os detalhes da reserva';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reservationId) {
      fetchReservationDetails();
    }
  }, [reservationId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/')}>
              Voltar para Home
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!reservation) {
    return (
      <Box p={3}>
        <Alert 
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/')}>
              Voltar para Home
            </Button>
          }
        >
          Nenhuma informação da reserva encontrada
        </Alert>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pendente': 'warning.main',
      'confirmada': 'success.main',
      'cancelada': 'error.main',
      'concluida': 'info.main'
    };
    return statusColors[status?.toLowerCase()] || 'text.primary';
  };

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
          Detalhes da Reserva
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box mb={2} p={2} bgcolor="background.default" borderRadius={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Status da Reserva
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: getStatusColor(reservation.status),
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                {reservation.status}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Quadra
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {reservation.nome}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(reservation.data)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Horário
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {reservation.horario_inicio} às {reservation.horario_fim}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Esporte
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {reservation.esporte}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Forma de Pagamento
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {reservation.pagamento}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Valor
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatCurrency(reservation.total)}
            </Typography>
          </Grid>

          {reservation.is_recorrente && (
            <Grid item xs={12}>
              <Box mt={2} p={2} bgcolor="primary.light" borderRadius={1}>
                <Typography variant="subtitle2" color="white">
                  Reserva Recorrente
                </Typography>
                <Typography variant="body2" color="white">
                  Esta é uma reserva recorrente com duração de {reservation.recorrencia?.duracao_meses} meses
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Voltar para Home
          </Button>
          {reservation.status === 'pendente' && (
            <Button
              variant="contained"
              color="primary"
              // Adicione aqui a função para confirmar pagamento
              onClick={() => {/* handleConfirmPayment() */}}
            >
              Confirmar Pagamento
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ReservationReview;