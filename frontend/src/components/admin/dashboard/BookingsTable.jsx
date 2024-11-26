import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  IconButton,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';

const getStatusColor = (status) => {
  const statusMap = {
    'confirmada': 'success',
    'pendente': 'warning',
    'cancelada': 'error',
    'concluida': 'info'
  };
  return statusMap[status] || 'default';
};

const getStatusLabel = (status) => {
  const statusMap = {
    'confirmada': 'Confirmada',
    'pendente': 'Pendente',
    'cancelada': 'Cancelada',
    'concluida': 'Concluída'
  };
  return statusMap[status] || status;
};

const BookingsTable = ({ bookings }) => {
  console.log('Dados recebidos na tabela:', bookings);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Últimas Reservas
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>Quadra</TableCell>
            <TableCell>Data da Reserva</TableCell>
            <TableCell>Horário da Reserva</TableCell>
            <TableCell>Data/Hora Criação</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id} hover>
              <TableCell>{booking.usuario_id?.nome || 'N/A'}</TableCell>
              <TableCell>{booking.quadra_id?.nome || 'N/A'}</TableCell>
              <TableCell>
                {dayjs(booking.data).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {`${booking.horario_inicio} - ${booking.horario_fim}`}
              </TableCell>
              <TableCell>
                {dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm')}
              </TableCell>
              <TableCell>
                <Chip 
                  label={getStatusLabel(booking.status)}
                  color={getStatusColor(booking.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {`R$ ${booking.total?.toFixed(2) || '0.00'}`}
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  size="small"
                  onClick={() => console.log('Editar reserva:', booking._id)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default BookingsTable; 