import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Alert 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RecurrencePreview = ({ selectedSlot, selectedOption, previewDates }) => {
  const startDate = new Date(selectedSlot.data);
  const allAvailable = previewDates.every(date => date.disponivel);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Paper 
        sx={{ 
          p: 2, 
          mb: 1,
          boxShadow: 'none',
          bgcolor: 'grey.50'
        }}
      >
        <Stack spacing={0.5}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Dia da semana
            </Typography>
            <Typography variant="body2">
              {capitalizeFirstLetter(format(startDate, 'EEEE', { locale: ptBR })) + 's'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Horário
            </Typography>
            <Typography variant="body2">
              {selectedSlot.horario_inicio} às {selectedSlot.horario_fim}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Começa em
            </Typography>
            <Typography variant="body2">
              {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Durante
            </Typography>
            <Typography variant="body2">
              {selectedOption} {selectedOption === 1 ? 'mês' : 'meses'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Valor final
            </Typography>
            <Typography variant="subtitle2" color="success.main">
              R$ {(selectedSlot.valor * previewDates.length).toFixed(2).replace('.', ',')}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Alert 
        icon={allAvailable ? <CheckCircleIcon /> : <WarningIcon />}
        severity={allAvailable ? "success" : "warning"}
        sx={{ mb: 1 }}
      >
        <Box>
          {allAvailable 
            ? "Todos os horários estão disponíveis"
            : (
              <>
                <Typography variant="body2">
                  Alguns horários não estão disponíveis
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    mt: 0.5,
                    color: 'text.secondary',
                    fontSize: '0.7rem'
                  }}
                >
                  O restante dos seus agendamentos será feito normalmente
                </Typography>
              </>
            )
          }
        </Box>
      </Alert>

      <Stack spacing={1}>
        {previewDates.map((date, index) => (
          <Paper 
            key={index}
            sx={{ 
              p: 1.5,
              opacity: date.disponivel ? 1 : 0.6,
              bgcolor: date.disponivel ? 'background.paper' : 'action.disabledBackground',
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ gap: 0 }}>
              <Box>
                <Typography variant="body2">
                  {selectedSlot.horario_inicio} às {selectedSlot.horario_fim}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(date.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </Typography>
              </Box>
              <Typography variant="subtitle2" color="success.main">
                R$ {selectedSlot.valor.toFixed(2).replace('.', ',')}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default RecurrencePreview; 