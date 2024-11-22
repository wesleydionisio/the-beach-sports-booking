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
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ShareIcon from '@mui/icons-material/Share';
import CancelIcon from '@mui/icons-material/Cancel';
import SportsIcon from '@mui/icons-material/Sports';
import PageContainer from '../components/layout/PageContainer';
import SectionLabel from '../components/common/SectionLabel';
import SportLabel from '../components/common/SportLabel';

const ReservationReview = () => {
  const { reservationId } = useParams(); // Mudado de id para reservationId para match com a rota
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
      console.log('1. Iniciando busca da reserva:', reservationId);
      const response = await axios.get(`/bookings/${reservationId}`);
      console.log('2. Resposta completa da API:', response.data);
      
      if (response.data && response.data.success) {
        const reservationData = response.data.reservation;
        console.log('3. Dados brutos da reserva:', reservationData);
        
        // Garantir que temos uma data de criação válida
        const created_at = reservationData.created_at || 
                          (reservationData._id ? new Date(parseInt(reservationData._id.substring(0, 8), 16) * 1000) : new Date());
        
        // Formatar os dados corretamente
        const formattedReservation = {
          ...reservationData,
          quadra_imagem: reservationData.foto_principal,
          cliente_nome: reservationData.cliente_nome || 'Cliente não identificado',
          created_at: created_at,
          esporte: typeof reservationData.esporte === 'string' 
            ? { nome: reservationData.esporte }
            : reservationData.esporte
        };

        console.log('4. Dados formatados:', {
          cliente_nome: formattedReservation.cliente_nome,
          created_at: formattedReservation.created_at,
          data_formatada: formatDate(formattedReservation.created_at)
        });

        setReservation(formattedReservation);
      } else {
        throw new Error('Dados da reserva não encontrados na resposta');
      }
    } catch (error) {
      console.error('5. Erro ao buscar reserva:', error);
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
      console.error('Erro ao cancelar reserva:', error);
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
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
      console.error('Erro ao calcular status do tempo:', error);
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
      console.error('Erro ao formatar data completa:', error);
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
      console.error('Erro ao formatar dia da semana:', error);
      return '-';
    }
  };

  const formatSimpleDate = (date) => {
    if (!date) return '-';
    try {
      // Formata como DD/MM/YYYY
      return format(new Date(date), "dd/MM/yyyy", {
        locale: ptBR
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '-';
    }
  };

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
              {getTimeStatus(reservation?.data, reservation?.horario_inicio, reservation?.horario_fim)}
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
                    label={formatSimpleDate(reservation?.data)}
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
              label={typeof reservation?.esporte === 'string' 
                ? reservation.esporte 
                : reservation?.esporte?.nome || '-'}
              sportData={typeof reservation?.esporte === 'string' 
                ? { nome: reservation.esporte }
                : reservation?.esporte}
            />
          </Box>

          {/* Quadra Card */}
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${reservation?.quadra_imagem || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              backgroundColor: '#333',
            }}
          >
            {console.log('7. Renderizando quadra card:', {
              imagem: reservation?.quadra_imagem,
              nome: reservation?.nome,
              esporte: reservation?.esporte
            })}
            
            {/* Esporte Label com Blur */}
            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
              {console.log('8. Renderizando sport label:', {
                nome: reservation?.esporte?.nome,
                icon: reservation?.esporte?.icon
              })}
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
              <SectionLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Quadra</SectionLabel>
              <Typography variant="h6">{reservation?.nome || 'Nome da quadra não disponível'}</Typography>
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
      </Box>
    </PageContainer>
  );
};

export default ReservationReview;