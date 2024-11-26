import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const CalendarSkeleton = () => {
  return (
    <Box sx={{ 
      width: '100%',
      maxHeight: { xs: '300px', md: '343px' },
      p: 2
    }}>
      {/* Header do Calendário */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Skeleton variant="text" width={120} height={32} animation="wave" />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="circular" width={32} height={32} animation="wave" />
          <Skeleton variant="circular" width={32} height={32} animation="wave" />
        </Box>
      </Box>

      {/* Dias da Semana */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        mb: 2,
        px: 1
      }}>
        {[...Array(7)].map((_, i) => (
          <Skeleton 
            key={i}
            variant="text" 
            width={32} 
            height={32}
            animation="wave"
          />
        ))}
      </Box>

      {/* Grid de Dias */}
      {[...Array(6)].map((_, weekIndex) => (
        <Box 
          key={weekIndex}
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            px: 1
          }}
        >
          {[...Array(7)].map((_, dayIndex) => (
            <Skeleton 
              key={dayIndex}
              variant="circular"
              width={32}
              height={32}
              animation="wave"
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const BookingCalendar = ({ selectedDate, onDateChange, quadraId, loading = false }) => {
  if (loading) {
    return <CalendarSkeleton />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DateCalendar
        value={selectedDate}
        onChange={onDateChange}
        disablePast
        sx={{
          width: '100%',
          height: '100%',
          '& .MuiPickersCalendarHeader-root': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px',
            marginTop: 0,
            marginBottom: 0,
          },
          '& .MuiDateCalendar-root': {
            width: '100%',
            maxHeight: { xs: '300px', md: '343px' },
          },
          '& .MuiDayCalendar-monthContainer': {
            width: '100%',
          },
          '& .MuiDayCalendar-weekContainer': {
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0 auto',
            width: '100%',
          },
          '& .MuiPickersDay-root': {
            margin: '2px',
            width: { xs: '32px', md: '36px' },
            height: { xs: '32px', md: '36px' },
          },
          '& .MuiDayCalendar-header': {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            paddingLeft: '8px',
            paddingRight: '8px',
          },
          '& .MuiDayCalendar-weekDayLabel': {
            width: { xs: '32px', md: '36px' },
            height: { xs: '32px', md: '36px' },
            margin: '2px',
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default BookingCalendar;