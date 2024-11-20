import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const BookingSummary = ({ selectedDate, selectedSlot, court, onEdit }) => {
  const formattedDate = dayjs(selectedDate)
    .locale('pt-br')
    .format('dddd, DD [de] MMMM [de] YYYY');
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <Box sx={{ backgroundColor: '#f1f1f1', borderRadius: 1 }}>
      {/* Horário */}
      <Box sx={{ 
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Horário
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {selectedSlot.horario_inicio}h às {selectedSlot.horario_fim}h
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Data */}
      <Box sx={{ 
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Data
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
          {capitalizedDate}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Quadra */}
      <Box sx={{ 
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Quadra
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {court?.nome || 'Carregando...'}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Editar */}
      <Box sx={{ 
        p: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Ajustar reserva
        </Typography>
        <Button
          size="small"
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          onClick={onEdit}
          sx={{
            color: '#666',
            textTransform: 'none',
            fontSize: '0.875rem',
            p: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#333',
            }
          }}
        >
          Editar
        </Button>
      </Box>
    </Box>
  );
};

export default BookingSummary; 