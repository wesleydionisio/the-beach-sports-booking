import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip
} from '@mui/material';

const bookings = [
  {
    id: 1,
    cliente: 'João Silva',
    quadra: 'Quadra 1',
    horario: '09:00',
    esporte: 'Beach Tennis',
    status: 'confirmed'
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    quadra: 'Quadra 2',
    horario: '10:00',
    esporte: 'Vôlei de Praia',
    status: 'pending'
  },
  {
    id: 3,
    cliente: 'Pedro Costa',
    quadra: 'Quadra 1',
    horario: '11:00',
    esporte: 'Futevôlei',
    status: 'confirmed'
  }
];

const statusConfig = {
  confirmed: { label: 'Confirmado', color: 'success' },
  pending: { label: 'Pendente', color: 'warning' },
  canceled: { label: 'Cancelado', color: 'error' }
};

const BookingsTable = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Próximos Agendamentos
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Quadra</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Esporte</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} hover>
                <TableCell>{booking.cliente}</TableCell>
                <TableCell>{booking.quadra}</TableCell>
                <TableCell>{booking.horario}</TableCell>
                <TableCell>{booking.esporte}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={statusConfig[booking.status].label}
                    color={statusConfig[booking.status].color}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BookingsTable; 