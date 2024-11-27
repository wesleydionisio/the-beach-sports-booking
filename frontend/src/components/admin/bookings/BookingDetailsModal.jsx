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
import DateService from '../../../utils/dateService';

const BookingDetailsModal = ({ booking, open, onClose }) => {
  if (!booking) return null;

  const getStatusColor = (status) => {
    const statusMap = {
      'confirmada': 'success',
      'pendente': 'warning',
      'cancelada': 'error'
    };
    return statusMap[status] || 'default';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalhes do Agendamento</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={booking.status}
                color={getStatusColor(booking.status)}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Cliente
            </Typography>
            <Typography variant="body1">
              {booking.usuario_id?.nome || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {booking.usuario_id?.email || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Quadra
            </Typography>
            <Typography variant="body1">
              {booking.quadra_id?.nome || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Esporte
            </Typography>
            <Typography variant="body1">
              {booking.esporte?.nome || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data
            </Typography>
            <Typography variant="body1">
              {DateService.formatDisplay(booking.data)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Horário
            </Typography>
            <Typography variant="body1">
              {`${booking.horario_inicio} - ${booking.horario_fim}`}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Valor Total
            </Typography>
            <Typography variant="body1">
              {`R$ ${booking.total?.toFixed(2) || '0.00'}`}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Método de Pagamento
            </Typography>
            <Typography variant="body1">
              {booking.metodo_pagamento?.nome || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailsModal; 