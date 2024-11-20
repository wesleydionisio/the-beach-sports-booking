import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const BookingCalendar = ({ selectedDate, onDateChange, quadraId }) => {
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