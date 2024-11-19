import React, { useEffect, useState, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/pt-br';
import axios from '../../api/apiService';

dayjs.extend(isSameOrAfter);
dayjs.locale('pt-br');

const PASTEL_COLORS = {
  GREEN: '#a2ff99',
  YELLOW: '#ffe564',
  RED: '#FAA0A0'
};

// Componente personalizado para o dia com barra de disponibilidade
const StyledDay = styled(PickersDay)(({ theme, availability }) => {
  let backgroundColor = 'transparent';
  
  if (availability !== undefined) {
    if (availability >= 70) {
      backgroundColor = PASTEL_COLORS.GREEN;
    } else if (availability > 0) {
      backgroundColor = PASTEL_COLORS.YELLOW;
    } else {
      backgroundColor = PASTEL_COLORS.RED;
    }
  }

  return {
    position: 'relative',
    '&::after': availability !== undefined && {
      content: '""',
      position: 'absolute',
      bottom: '2px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '4px',
      backgroundColor,
      borderRadius: '2px',
      transition: 'all 0.2s ease',
    },
    '&:hover::after': availability !== undefined && {
      height: '6px',
      width: '85%',
    },
    // Ajustar padding para acomodar a barra
    padding: '0 0 6px 0',
  };
});

// Componente do dia com a barra de disponibilidade
function ServerDay(props) {
  const { highlightedDays = {}, day, outsideCurrentMonth, ...other } = props;
  
  const availability = !outsideCurrentMonth ? highlightedDays[day.format('YYYY-MM-DD')] : undefined;

  return (
    <StyledDay 
      {...other} 
      outsideCurrentMonth={outsideCurrentMonth} 
      day={day}
      availability={availability}
      sx={{
        ...props.sx,
        // Aumentar espaçamento vertical entre as semanas
        '&.MuiPickersDay-root': {
          marginBottom: '4px',
        },
      }}
    />
  );
}

const BookingCalendar = ({ selectedDate, onDateChange, quadraId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState({});
  const requestAbortController = useRef(null);

  const calculateAvailability = async (date) => {
    try {
      const controller = new AbortController();
      requestAbortController.current = controller;

      const formattedDate = date.format('YYYY-MM-DD');
      const response = await axios.get(`/bookings/${quadraId}/reserved-times`, {
        params: { data: formattedDate },
        signal: controller.signal
      });

      const reservas = response.data.horarios_agendados || [];
      
      // Gerar todos os slots do dia (assumindo horário de 8h às 22h)
      const totalSlots = 14; // 14 slots de 1 hora (8h às 22h)
      const slotsDisponiveis = totalSlots - reservas.length;
      
      // Calcular porcentagem de disponibilidade
      const availabilityPercentage = (slotsDisponiveis / totalSlots) * 100;

      setHighlightedDays(prev => ({
        ...prev,
        [formattedDate]: availabilityPercentage
      }));

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao buscar disponibilidade:', error);
      }
    }
  };

  // Buscar disponibilidade para o mês atual
  const fetchMonthAvailability = async (date) => {
    setIsLoading(true);
    const startOfMonth = date.startOf('month');
    const daysInMonth = date.daysInMonth();
    
    // Limpar dados do mês anterior
    setHighlightedDays({});
    
    // Buscar disponibilidade para cada dia do mês
    const promises = [];
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = startOfMonth.add(i, 'day');
      if (currentDate.isSameOrAfter(dayjs(), 'day')) {
        promises.push(calculateAvailability(currentDate));
      }
    }
    
    await Promise.all(promises);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMonthAvailability(dayjs());
    return () => requestAbortController.current?.abort();
  }, [quadraId]);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    fetchMonthAvailability(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DateCalendar
        value={selectedDate}
        onChange={onDateChange}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
        disablePast
        sx={{
          width: '100%',
          '& .MuiPickersDay-root': {
            fontSize: '0.875rem',
            height: '40px', // Aumentar altura para acomodar a barra
          },
          '& .MuiDayCalendar-weekDayLabel': {
            fontSize: '0.875rem',
          },
          '& .MuiPickersDay-today': {
            borderColor: 'primary.main',
          },
          // Aumentar espaçamento entre as semanas
          '& .MuiDayCalendar-monthContainer': {
            rowGap: '8px',
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default BookingCalendar;