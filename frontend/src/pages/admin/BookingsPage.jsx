import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Button
} from '@mui/material';
import {
  ViewDay,
  ViewWeek,
  ViewModule,
  Add
} from '@mui/icons-material';
import BookingCalendar from '../../components/admin/bookings/BookingCalendar';
import BookingFormModal from '../../components/admin/bookings/BookingFormModal';
import BookingDetailsModal from '../../components/admin/bookings/BookingDetailsModal';
import BookingFilters from '../../components/admin/bookings/BookingFilters';
import { useSnackbar } from 'notistack';

const BookingsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [view, setView] = useState('timeGridWeek');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleOpenModal = (date = null) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setModalOpen(false);
  };

  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
    setDetailsModalOpen(false);
  };

  const handleSubmitBooking = async (values) => {
    try {
      console.log('Dados do agendamento:', values);
      enqueueSnackbar(
        `Agendamento ${values.isEditing ? 'atualizado' : 'criado'} com sucesso!`,
        { variant: 'success' }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      enqueueSnackbar('Erro ao salvar agendamento', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Agendamentos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie os agendamentos das quadras
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2 
            }}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                size="small"
              >
                <ToggleButton value="timeGridDay">
                  <ViewDay />
                </ToggleButton>
                <ToggleButton value="timeGridWeek">
                  <ViewWeek />
                </ToggleButton>
                <ToggleButton value="dayGridMonth">
                  <ViewModule />
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenModal()}
              >
                Novo Agendamento
              </Button>
            </Box>

            <BookingFilters />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 'calc(100vh - 300px)' }}>
            <BookingCalendar
              view={view}
              onEventClick={handleOpenDetails}
              onDateSelect={handleOpenModal}
            />
          </Paper>
        </Grid>
      </Grid>

      <BookingFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBooking}
        initialDate={selectedDate}
      />

      <BookingDetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetails}
        booking={selectedBooking}
        onEdit={() => {
          handleCloseDetails();
          handleOpenModal();
          setSelectedBooking(selectedBooking);
        }}
      />
    </Container>
  );
};

export default BookingsPage; 