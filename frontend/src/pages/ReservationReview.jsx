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
  Button,
  Chip,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ShareIcon from '@mui/icons-material/Share';
import CancelIcon from '@mui/icons-material/Cancel';
import SportsIcon from '@mui/icons-material/Sports';
import PageContainer from '../components/layout/PageContainer';
import SectionLabel from '../components/common/SectionLabel';
import SportLabel from '../components/common/SportLabel';
import DateService from '../utils/dateService';
import dayjs from 'dayjs';
import { keyframes } from '@mui/system';

// Definir a animação fadeInUp
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ReservationReview = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [isCanceled, setIsCanceled] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const fetchReservationDetails = async () => {
    try {
      console.log('1. Buscando reserva:', reservationId);
      setLoading(true);
      
      const response = await axios.get(`/bookings/${reservationId}`);
      
      if (response.data?.success) {
        const reservationData = response.data.reservation;
        
        const formattedReservation = {
          ...reservationData,
          quadra: {
            id: reservationData.quadra_id,
            nome: reservationData.nome,
            imagem_url: reservationData.foto_principal
          },
          esporte: {
            nome: reservationData.esporte,
            icon: null
          },
          formattedDate: DateService.formatDisplay(reservationData.data),
          formattedTime: DateService.formatTimeInterval(
            reservationData.horario_inicio,
            reservationData.horario_fim
          )
        };

        console.log('4. Dados formatados final:', {
          quadra: formattedReservation.quadra,
          esporte: formattedReservation.esporte,
          completo: formattedReservation
        });

        setReservation(formattedReservation);
      }
    } catch (error) {
      console.error('ERRO:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reservationId) {
      fetchReservationDetails();
    }
  }, [reservationId]);

  useEffect(() => {
    if (reservation) {
      console.log('5. Estado final da reserva:', {
        quadra: {
          id: reservation.quadra?.id,
          nome: reservation.quadra?.nome,
          imagem_url: reservation.quadra?.imagem_url,
          completo: reservation.quadra
        },
        esporte: {
          id: reservation.esporte?.id,
          nome: reservation.esporte?.nome,
          icon: reservation.esporte?.icon,
          completo: reservation.esporte
        },
        dados_completos: reservation
      });
    }
  }, [reservation]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({ 
      open: true, 
      message: 'Link da reserva copiado para a área de transferência!' 
    });
  };

  const handleCancelClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleCancelConfirm = async () => {
    try {
      setIsCanceling(true);
      
      const response = await axios.patch(`/bookings/${reservationId}`, {
        status: 'cancelada'
      });
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Reserva cancelada com sucesso!',
          severity: 'success'
        });
        
        setReservation(prev => ({
          ...prev,
          status: 'cancelada'
        }));
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao cancelar reserva. Tente novamente.',
        severity: 'error'
      });
    } finally {
      setIsCanceling(false);
      setOpenConfirmDialog(false);
    }
  };

  const formatTimeToStart = (date, horarioInicio) => {
    if (!date || !horarioInicio) return '-';
    
    try {
      // Criar data/hora completa do início da reserva
      const [hora, minuto] = horarioInicio.split(':');
      const dataReserva = dayjs(date)
        .hour(parseInt(hora))
        .minute(parseInt(minuto))
        .second(0);
      
      // Data atual
      const agora = dayjs();

      if (dataReserva.isBefore(agora)) {
        return 'FINALIZADO';
      }

      // Calcular diferença em horas
      const horasRestantes = dataReserva.diff(agora, 'hours');
      
      if (horasRestantes < 24) {
        return `${horasRestantes} HORAS`;
      } else {
        const diasRestantes = Math.floor(horasRestantes / 24);
        return `${diasRestantes} DIAS`;
      }
    } catch (error) {
      return '-';
    }
  };

  const getTimeStatus = (reservationDate, horarioInicio, horarioFim) => {
    if (!reservationDate || !horarioInicio || !horarioFim) return '-';
    
    try {
      const now = new Date();
      const dataReserva = new Date(reservationDate);
      
      // Converter horários para Date
      const [horaInicio, minInicio] = horarioInicio.split(':');
      const [horaFim, minFim] = horarioFim.split(':');
      
      const dataHoraInicio = new Date(dataReserva);
      dataHoraInicio.setHours(parseInt(horaInicio), parseInt(minInicio), 0);
      
      const dataHoraFim = new Date(dataReserva);
      dataHoraFim.setHours(parseInt(horaFim), parseInt(minFim), 0);

      // Verificar se já passou
      if (now > dataHoraFim) {
        return 'JÁ REALIZADO';
      }

      // Verificar se está em andamento
      if (now >= dataHoraInicio && now <= dataHoraFim) {
        return 'Em andamento';
      }

      // Se não passou e não está em andamento, calcular tempo restante
      const diffHours = Math.ceil((dataHoraInicio - now) / (1000 * 60 * 60));
      
      if (diffHours < 24) {
        return `${diffHours} HORAS`;
      }
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays} DIAS`;
    } catch (error) {
      return '-';
    }
  };

  const formatFullDate = (date) => {
    if (!date) return '-';
    try {
      // Formata como "Segunda-feira, 21 de Novembro de 2024"
      return format(new Date(date), "EEEE',' dd 'de' MMMM 'de' yyyy", {
        locale: ptBR
      });
    } catch (error) {
      return '-';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    if (status === 'confirmada') return 'success';
    if (status === 'pendente') return 'warning';
    if (status === 'cancelada') return 'error';
    return 'default';
  };

  const formatWeekDay = (date) => {
    if (!date) return '-';
    try {
      // Formata apenas o dia da semana, primeira letra maiúscula
      return format(new Date(date), "EEEE", {
        locale: ptBR
      }).replace(/^\w/, (c) => c.toUpperCase());
    } catch (error) {
      return '-';
    }
  };

  const formatSimpleDate = (date) => {
    if (!date) return '-';
    try {
      // Usar o mesmo método de formatação do DateService
      return DateService.formatDisplay(date);
    } catch (error) {
      return '-';
    }
  };

  const renderRecurrenceInfo = () => {
    if (!reservation?.is_recorrente) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Agendamento Recorrente</Typography>
        <Box sx={{ mt: 1 }}>
          {reservation.recorrencia.horarios.map((horario, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                p: 1,
                borderBottom: '1px solid #eee'
              }}
            >
              <Typography>
                {format(new Date(horario.data), "dd/MM/yyyy")}
              </Typography>
              <Typography color={horario.status === 'confirmado' ? 'success.main' : 'error.main'}>
                {horario.status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <PageContainer withHeader={true}>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
          <Paper 
            sx={{ 
              overflow: 'hidden',
              animation: `${fadeInUp} 0.3s ease-out forwards`,
              opacity: 0
            }}
          >
            {/* Header Skeleton */}
            <Box sx={{ p: 2, bgcolor: 'primary.main' }}>
              <Skeleton 
                variant="text" 
                width={200} 
                height={40} 
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                animation="wave"
              />
            </Box>

            {/* Horário e Status Skeleton */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Skeleton variant="text" width={80} height={24} animation="wave" />
                  <Skeleton variant="text" width={120} height={32} animation="wave" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="rounded" width={100} height={32} animation="wave" />
                    <Skeleton variant="rounded" width={120} height={32} animation="wave" />
                    <Skeleton variant="rounded" width={100} height={32} animation="wave" />
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Imagem Skeleton */}
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={200}
              animation="wave"
              sx={{ bgcolor: 'rgba(0,0,0,0.1)' }}
            />

            {/* Pagamento Skeleton */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Skeleton variant="text" width={120} height={24} animation="wave" />
              <Skeleton variant="text" width={150} height={32} animation="wave" />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width={140} height={24} animation="wave" />
                <Skeleton variant="text" width={100} height={32} animation="wave" />
              </Box>
            </Box>

            {/* Botões Skeleton */}
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rounded" width="50%" height={40} animation="wave" />
                <Skeleton variant="rounded" width="50%" height={40} animation="wave" />
              </Box>
            </Paper>
          </Paper>
        </Box>
      </PageContainer>
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

  return (
    <PageContainer withHeader={true}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        {/* Main Card */}
        <Paper sx={{ overflow: 'hidden' }}>
          {/* Countdown */}
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                textTransform: 'uppercase',
                fontSize: '1rem',
                letterSpacing: '0.5px'
              }}
            >
              {getTimeStatus(reservation?.data, reservation?.horario_inicio, reservation?.horario_fim) === 'JÁ REALIZADO' ? 
                'Status:' : 
                'COMEÇA EM:'}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 550,
                fontSize: '1.5rem'
              }}
            >
              {formatTimeToStart(reservation?.data, reservation?.horario_inicio)}
            </Typography>
          </Box>

          {/* Horário e Status Container */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              {/* Horário */}
              <Grid item xs={12} sm={6}>
                <SectionLabel>Horário</SectionLabel>
                <Typography variant="h6">
                  {reservation?.horario_inicio} às {reservation?.horario_fim}
                </Typography>
              </Grid>

              {/* Status, Dia da Semana e Data */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  alignItems: 'center',
                  flexWrap: 'wrap' // Para caso a tela seja muito pequena
                }}>
                  <Chip
                    label={reservation?.status?.toUpperCase() || 'PENDENTE'}
                    color={getStatusColor(reservation?.status)}
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip
                    label={formatWeekDay(reservation?.data)}
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      fontWeight: 'bold',
                      '& .MuiChip-label': {
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                  <Chip
                    label={reservation?.formattedDate}
                    color="primary"
                    sx={{ 
                      fontWeight: 'bold',
                      '& .MuiChip-label': {
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Esporte Label com Blur */}
          <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
            <SportLabel 
              label={reservation?.esporte?.nome || '-'}
              sportData={reservation?.esporte}
            />
          </Box>

          {/* Quadra Card */}
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${reservation?.quadra?.imagem_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              backgroundColor: '#333',
            }}
          >
            {/* Esporte Label */}
            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
              <SportLabel 
                label={reservation?.esporte?.nome || '-'}
                sportData={reservation?.esporte}
              />
            </Box>

            {/* Nome da Quadra */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white',
                zIndex: 2
              }}
            >
              <Typography variant="h6">
                {reservation?.quadra?.nome || 'Quadra não disponível'}
              </Typography>
            </Box>
          </Box>

          {/* Pagamento Info */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <SectionLabel>Pagamento</SectionLabel>
            <Typography variant="h6" gutterBottom>
              {reservation?.pagamento || '-'}
            </Typography>
            <SectionLabel>Valor total da reserva</SectionLabel>
            <Typography variant="h6">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(reservation?.total || 0)}
            </Typography>
          </Box>

          {/* Actions */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              width: '100%'
            }}>
              <Button
                startIcon={<ShareIcon />}
                variant="outlined"
                onClick={handleShare}
                fullWidth
                sx={{ flex: 1 }}
              >
                Compartilhar
              </Button>
              <Button
                startIcon={<CancelIcon />}
                variant="contained"
                color="error"
                onClick={handleCancelClick}
                disabled={isCanceled || isCanceling || reservation?.status === 'cancelada'}
                fullWidth
                sx={{ flex: 1 }}
              >
                {isCanceling ? (
                  <CircularProgress size={24} color="inherit" />
                ) : reservation?.status === 'cancelada' ? (
                  'CANCELADO'
                ) : (
                  'Cancelar'
                )}
              </Button>
            </Box>
          </Paper>
        </Paper>

        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity || 'success'} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Modal de Confirmação */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirmar Cancelamento</DialogTitle>
          
          <DialogContent>
            <DialogContentText>
              Tem certeza de que deseja cancelar esta reserva?
            </DialogContentText>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleCancelConfirm} color="primary" autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {renderRecurrenceInfo()}
      </Box>
    </PageContainer>
  );
};

export default ReservationReview;