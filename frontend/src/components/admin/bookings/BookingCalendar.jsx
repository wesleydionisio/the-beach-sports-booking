import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { useTheme } from '@mui/material/styles';

// Dados mockados de agendamentos
const mockBookings = [
  {
    id: 1,
    title: 'João Silva - Beach Tennis',
    start: '2024-03-20T09:00:00',
    end: '2024-03-20T10:00:00',
    courtId: 1,
    status: 'confirmed',
    backgroundColor: '#4caf50'
  },
  {
    id: 2,
    title: 'Maria Santos - Vôlei',
    start: '2024-03-20T10:00:00',
    end: '2024-03-20T11:00:00',
    courtId: 2,
    status: 'pending',
    backgroundColor: '#ff9800'
  },
  {
    id: 3,
    title: 'Pedro Costa - Futevôlei',
    start: '2024-03-20T14:00:00',
    end: '2024-03-20T15:00:00',
    courtId: 1,
    status: 'confirmed',
    backgroundColor: '#4caf50'
  }
];

const BookingCalendar = ({ view, onEventClick, onDateSelect }) => {
  const theme = useTheme();

  const handleEventClick = (info) => {
    // Encontra o agendamento completo nos dados mockados
    const booking = mockBookings.find(b => b.id === parseInt(info.event.id));
    onEventClick(booking);
  };

  const handleDateSelect = (selectInfo) => {
    onDateSelect(selectInfo);
  };

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      initialView={view}
      locale={ptBrLocale}
      theme={theme}
      events={mockBookings}
      eventClick={handleEventClick}
      dateClick={handleDateSelect}
    />
  );
};

export default BookingCalendar; 