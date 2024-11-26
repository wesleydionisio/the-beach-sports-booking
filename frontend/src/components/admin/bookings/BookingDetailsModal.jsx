import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  AccessTime,
  SportsTennis,
  Person,
  AttachMoney,
  Phone,
  Email
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  confirmed: { label: 'Confirmado', color: 'success' },
  pending: { label: 'Pendente', color: 'warning' },
  canceled: { label: 'Cancelado', color: 'error' }
};

const BookingDetailsModal = ({ open, onClose, booking, onEdit }) => {
  if (!booking) return null;

  const formatDate = (dateStr) => {
    return format(new Date(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatTime = (dateStr) => {
    return format(new Date(dateStr), 'HH:mm');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes do Agendamento</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AccessTime />
          <Typography variant="body1">
            {formatDate(booking.start)} - {formatTime(booking.start)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SportsTennis />
          <Typography variant="body1">{booking.title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Person />
          <Typography variant="body1">{booking.courtId}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AttachMoney />
          <Typography variant="body1">{statusConfig[booking.status].label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Phone />
          <Typography variant="body1">{booking.phone}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Email />
          <Typography variant="body1">{booking.email}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onEdit}>Editar</Button>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsModal; 