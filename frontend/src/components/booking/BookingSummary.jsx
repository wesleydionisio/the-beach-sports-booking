import React from 'react';
import { Box, Typography, Divider, Button, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RepeatIcon from '@mui/icons-material/Repeat';
import DateService from '../../utils/dateService';

const BookingSummary = ({ selectedDate, selectedSlot, court, onEdit, recorrencia }) => {
  const formattedDate = DateService.formatDisplay(selectedDate);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

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
          {DateService.formatTimeInterval(
            selectedSlot?.horario_inicio,
            selectedSlot?.horario_fim
          )}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Data */}
      <Box sx={{ 
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Box sx={{ 
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

        {/* Informações de Recorrência */}
        {recorrencia && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Chip
              icon={<RepeatIcon sx={{ fontSize: '1rem' }} />}
              label={`${diasSemana[recorrencia.dia_semana]}s por ${recorrencia.duracao_meses} ${recorrencia.duracao_meses > 1 ? 'meses' : 'mês'}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ 
                height: '24px',
                '& .MuiChip-label': { 
                  fontSize: '0.75rem',
                  px: 1
                }
              }}
            />
          </Box>
        )}
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