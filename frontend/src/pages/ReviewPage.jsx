import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/apiService';

const ReviewPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        console.log('Buscando reserva com ID:', reservationId);
        const response = await axios.get(`/bookings/${reservationId}`);
        console.log('Resposta completa da API:', response.data);
        
        if (response.data.success) {
          console.log('Dados da reserva:', response.data.reservation);
          setReservation(response.data.reservation);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da reserva:', error);
        console.log('Detalhes do erro:', error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  // Log quando o estado reservation é atualizado
  useEffect(() => {
    console.log('Esta reservation atualizado:', reservation);
  }, [reservation]);

  const handleCancelReservation = async () => {
    try {
      const response = await axios.post(`/bookings/${reservationId}/cancel`);
      if (response.data.success) {
        alert('Reserva cancelada com sucesso!');
        navigate('/'); // Redireciona para a página inicial
      } else {
        alert('Não foi possível cancelar a reserva.');
      }
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      alert(error.response?.data?.message || 'Erro ao cancelar reserva.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box>
        <Typography variant="h5" align="center" gutterBottom>
          Revisão da Reserva
        </Typography>
        {reservation && (
          <>
            <Typography>Nome da Quadra: {reservation.nome}</Typography>
            <Typography>Data: {reservation.data}</Typography>
            <Typography>
              Horário: {reservation.horario_inicio} - {reservation.horario_fim}
            </Typography>
            <Typography>Esporte: {reservation.esporte}</Typography>
            <Typography>
              Forma de Pagamento: {reservation.pagamento}
            </Typography>
            <Typography>
              Total: R$ {reservation.total.toFixed(2)}
            </Typography>
            <Box mt={2}>
              <Button 
                variant="contained" 
                color="primary"
                href="/"
              >
                Voltar ao Início
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                sx={{ ml: 2 }}
                onClick={handleCancelReservation}
              >
                Cancelar Reserva
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ReviewPage;