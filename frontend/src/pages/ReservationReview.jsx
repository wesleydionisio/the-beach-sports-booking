import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../context/AuthContext';
import StandardSkeleton from '../components/common/StandardSkeleton';
import PixPaymentModal from '../components/PixPaymentModal';

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

const ReservationReview = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [isCanceled, setIsCanceled] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(reservation?.status || 'pending');

  const fetchReservationDetails = async () => {
    try {
      console.log('1. Buscando reserva:', id);
      setLoading(true);
      
      const endpoint = user ? `/bookings/${id}` : `/bookings/${id}/public`;
      console.log('2. Endpoint utilizado:', endpoint);
      
      const response = await axios.get(endpoint);
      console.log('3. Resposta da API:', response.data);
      
      if (response.data?.success) {
        const reservationData = response.data.reservation;
        
        console.log('4. Dados do pagamento:', {
          pagamento: reservationData.pagamento,
          status: reservationData.status,
          payment_status: reservationData.payment_status
        });

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

        console.log('5. Dados formatados:', formattedReservation);
        setReservation(formattedReservation);

        console.log('6. Condição do modal PIX:', {
          isPix: reservationData.pagamento?.toUpperCase() === 'PIX',
          isPending: reservationData.status === 'pendente',
          isNotApproved: reservationData.payment_status !== 'approved',
          shouldOpenModal: 
            reservationData.pagamento?.toUpperCase() === 'PIX' && 
            reservationData.status === 'pendente' &&
            reservationData.payment_status !== 'approved'
        });

        if (reservationData.pagamento?.toUpperCase() === 'PIX' && 
            reservationData.status === 'pendente' &&
            reservationData.payment_status !== 'approved') {
          console.log('7. Abrindo modal PIX');
          setPixModalOpen(true);
        }
      }
    } catch (error) {
      console.error('❌ ERRO:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('0. ID da reserva:', id);
    if (id) {
      fetchReservationDetails();
    }
  }, [id]);

  useEffect(() => {
    if (reservation) {
      console.log('9. Estado atual da reserva:', reservation);
    }
  }, [reservation]);

  useEffect(() => {
    console.log('8. Estado do modal PIX:', { pixModalOpen });
  }, [pixModalOpen]);

  useEffect(() => {
    // Verifica se deve abrir o modal do PIX automaticamente
    const shouldOpenPixModal = 
      reservation?.pagamento === 'PIX' && 
      reservation?.status === 'pending' &&
      !pixModalOpen;
    
    if (shouldOpenPixModal) {
      setPixModalOpen(true);
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
      
      const response = await axios.patch(`/bookings/${id}`, {
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

  const renderLoadingSkeleton = () => (
    <PageContainer withHeader={true}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Paper 
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            animation: `${fadeInUp} 0.3s ease-out forwards`,
            opacity: 0
          }}
        >
          {/* Status Skeleton */}
          <Box sx={{ 
            p: 2, 
            bgcolor: '#2196F3',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Skeleton 
                variant="text" 
                width={120} 
                height={32} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
              <Skeleton 
                variant="text" 
                width={150} 
                height={32} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            </Box>
          </Box>

          {/* Horário e Status Skeleton */}
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Skeleton 
                  variant="text" 
                  width={80} 
                  height={24} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                />
                <Skeleton 
                  variant="text" 
                  width={150} 
                  height={32} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[100, 120, 100].map((width, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={width}
                      height={32}
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Imagem Skeleton */}
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={200}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
          />

          {/* Pagamento Skeleton */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Skeleton 
              variant="text" 
              width={120} 
              height={24} 
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            />
            <Skeleton 
              variant="text" 
              width={150} 
              height={32} 
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            />
            <Box sx={{ mt: 2 }}>
              <Skeleton 
                variant="text" 
                width={140} 
                height={24} 
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
              />
              <Skeleton 
                variant="text" 
                width={100} 
                height={32} 
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
              />
            </Box>
          </Box>

          {/* Botões Skeleton */}
          <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
            <Skeleton 
              variant="rounded" 
              width="50%" 
              height={40} 
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            />
            <Skeleton 
              variant="rounded" 
              width="50%" 
              height={40} 
              sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
            />
          </Box>
        </Paper>
      </Box>
    </PageContainer>
  );

  const handlePaymentSuccess = () => {
    setPaymentStatus('approved');
    setPixModalOpen(false);
    // Atualizar o estado da reserva se necessário
    if (onClose) onClose();
  };

  if (loading) {
    return renderLoadingSkeleton();
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
      {/* Background preto */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: '#000000', // Fundo preto
          zIndex: -2
        }}
      />

      {/* Imagem com 100% de opacidade */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(https://www.recreiodajuventude.com.br/oficial/2023/userfiles/redacao/posts/quadra-areia-noticia-1.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          opacity: 1, // Opacidade total
          zIndex: -1
        }}
      />

      {/* Overlay escuro para melhor contraste */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Overlay escuro
          zIndex: -1
        }}
      />

      <Box sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: 2,
        position: 'relative',
        zIndex: 1
      }}>
        <Paper 
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            color: 'white',
            overflow: 'hidden',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            '& .MuiPaper-root': { // Para papers internos
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            },
            '& .MuiTypography-root': { // Para todos os textos
              color: 'white'
            },
            '& .MuiChip-root': { // Para os chips
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            },
            '& .MuiSectionLabel-root': { // Para os labels de seção
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }}
        >
          {/* Countdown */}
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: '#2196F3', // Azul mais vivido
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                0 0 20px rgba(33, 150, 243, 0.3),
                0 0 40px rgba(33, 150, 243, 0.2),
                0 0 60px rgba(33, 150, 243, 0.1)
              `, // Efeito glow suave com múltiplas camadas
              position: 'relative',
              zIndex: 2,
              '& .MuiTypography-root': {
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' // Glow suave no texto
              }
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                textTransform: 'uppercase',
                fontSize: '1rem',
                letterSpacing: '0.5px',
                fontWeight: 500
              }}
            >
              {getTimeStatus(reservation?.data, reservation?.horario_inicio, reservation?.horario_fim) === 'JÁ REALIZADO' ? 
                'Status:' : 
                'COMEÇA EM:'}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.5rem'
              }}
            >
              {formatTimeToStart(reservation?.data, reservation?.horario_inicio)}
            </Typography>
          </Box>

          {/* Main content */}
          <Paper 
            sx={{ 
              p: 2, 
              mb: 2,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            }}
          >
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
                    label={reservation?.status?.toUpperCase() || 'Pendente'}
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

          {/* Quadra Card - mantém o background da imagem */}
          <Box
            sx={{
              height: 200,
              backgroundImage: `url(${reservation?.quadra?.imagem_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              overflow: 'hidden'
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
          <Box 
            sx={{ 
              p: 2, 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
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
          <Paper 
            sx={{ 
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '& .MuiButton-root': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }
            }}
          >
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

        <PixPaymentModal 
          open={pixModalOpen}
          onClose={handlePaymentSuccess}
          bookingId={id}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </Box>
    </PageContainer>
  );
};

export default ReservationReview;