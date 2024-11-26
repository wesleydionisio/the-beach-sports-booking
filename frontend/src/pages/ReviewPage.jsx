import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent,
  Button,
  Chip,
  Stack,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SportsIcon from '@mui/icons-material/Sports';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from '../api/apiService';

const ReviewPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isCanceled, setIsCanceled] = useState(false);

  // Status styles
  const getStatusColor = (status) => {
    const statusMap = {
      'confirmado': 'success',
      'pendente': 'warning',
      'cancelado': 'error'
    };
    return statusMap[status.toLowerCase()] || 'default';
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({
      open: true,
      message: 'Link copiado para a área de transferência!',
      severity: 'success'
    });
  };

  const handleCancel = async () => {
    try {
      await axios.post(`/bookings/${id}/cancel`);
      setIsCanceled(true);
      setSnackbar({
        open: true,
        message: 'Reserva cancelada com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao cancelar reserva',
        severity: 'error'
      });
    }
  };

  // Função para redirecionar para login
  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        redirectTo: window.location.pathname // Salvar URL atual para retornar depois
      } 
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
          Agendamento
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          ID: {id}
        </Typography>
      </Box>

      {/* Info do Cliente */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body1">
          Solicitado por <strong>João Silva</strong> em:{' '}
          {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </Typography>
      </Box>

      {/* Card Principal */}
      <Card sx={{ mb: 3, position: 'relative' }}>
        {/* Tempo até o início */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTimeIcon color="action" />
            <Typography>
              Começa em: {formatDistanceToNow(new Date(), { locale: ptBR })}
            </Typography>
          </Stack>
        </Box>

        {/* Horário e Status */}
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Quinta-feira, 15:00 - 16:00
          </Typography>
          <Chip 
            label="Confirmado" 
            color={getStatusColor('confirmado')}
            sx={{ mb: 2 }}
          />
          
          {/* Esporte */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <SportsIcon />
            <Typography>Futebol</Typography>
          </Stack>
        </Box>

        {/* Card da Quadra */}
        <Card sx={{ mx: 2, mb: 2, position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image="/path/to/court/image.jpg"
            alt="Quadra"
            sx={{
              filter: 'brightness(0.7)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
            }}
          >
            <Typography variant="h6" color="white">
              Quadra Principal
            </Typography>
          </Box>
        </Card>

        {/* Info de Pagamento */}
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Pagamento:
          </Typography>
          <Typography variant="h6">
            Valor total da reserva: R$ 120,00
          </Typography>
        </Box>
      </Card>

      {/* Ações */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={handleShare}
          fullWidth
        >
          Compartilhar
        </Button>
        
        {user ? (
          // Usuário logado - mostrar botão de cancelar
          <Button
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={isCanceled}
            fullWidth
          >
            {isCanceled ? 'Cancelado' : 'Cancelar'}
          </Button>
        ) : (
          // Usuário não logado - mostrar botão de login
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mb: 1 
              }}
            >
              Entre para poder editar
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginRedirect}
              fullWidth
            >
              Entrar
            </Button>
          </Box>
        )}
      </Stack>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewPage;