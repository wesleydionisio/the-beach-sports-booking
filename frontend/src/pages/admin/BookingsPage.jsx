import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from '../../api/apiService';
import DateService from '../../utils/dateService';
import BookingDetailsModal from '../../components/admin/bookings/BookingDetailsModal';

const BookingsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/bookings/admin/list', {
        params: {
          page: page + 1,
          limit: rowsPerPage
        }
      });
      
      setBookings(response.data.bookings);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      enqueueSnackbar('Erro ao carregar agendamentos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'warning',
      confirmada: 'success',
      cancelada: 'error'
    };
    return colors[status] || 'default';
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
    setDetailsModalOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Agendamentos
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Quadra</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} hover>
                  <TableCell>{booking.usuario_id?.nome}</TableCell>
                  <TableCell>{booking.quadra_id?.nome}</TableCell>
                  <TableCell>
                    {DateService.formatDisplay(booking.data)}
                  </TableCell>
                  <TableCell>
                    {`${booking.horario_inicio} - ${booking.horario_fim}`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {`R$ ${booking.total.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenDetails(booking)}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página"
        />
      </Paper>

      <BookingDetailsModal
        booking={selectedBooking}
        open={detailsModalOpen}
        onClose={handleCloseDetails}
      />
    </Container>
  );
};

export default BookingsPage; 