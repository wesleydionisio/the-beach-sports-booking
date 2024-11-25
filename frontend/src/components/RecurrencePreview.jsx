import React from 'react';
import { Box, Typography, Stack, Fade, Chip, Grid, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fadeInUp } from '../styles/animations';
import ListSkeleton from './common/ListSkeleton';

const RecurrencePreview = ({ selectedSlot, selectedOption, previewDates, loading }) => {
  if (loading) {
    return <ListSkeleton items={4} />;
  }

  // Verifica se todos os horários estão disponíveis
  const allAvailable = previewDates.every(date => date.disponivel);

  return (
    <Fade in timeout={300}>
      <Stack spacing={1} sx={{ p: 1 }}>
        {/* Box de notificação */}
        <Box 
          sx={{ 
            mb: 2,
            display: 'flex',
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: allAvailable ? '#edf7ed' : '#fff4e5',
          }}
        >
          {/* Ícone Container */}
          <Box 
            sx={{ 
              width: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: allAvailable ? '#2e7d32' : '#ed6c02',
            }}
          >
            {allAvailable 
              ? <CheckCircleIcon sx={{ color: '#fff', fontSize: '28px' }} />
              : <WarningIcon sx={{ color: '#fff', fontSize: '28px' }} />
            }
          </Box>

          {/* Mensagem Container */}
          <Box 
            sx={{ 
              flex: 1,
              p: 2,
            }}
          >
            <Typography>
              {allAvailable 
                ? "Todos os horários estão disponíveis."
                : "Um ou mais horários não está disponível, o restante dos agendamentos será feito normalmente."
              }
            </Typography>
          </Box>
        </Box>

        {/* Lista de datas */}
        {previewDates.map((date, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: date.disponivel ? '#e0e0e0' : '#fff3e0',
              backgroundColor: date.disponivel ? 'transparent' : '#fff8e1',
              animation: `${fadeInUp} 0.3s ease-out forwards`,
              animationDelay: `${index * 0.05}s`,
              opacity: 0,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ lineHeight: 1.2 }}>
                  {format(new Date(date.data), "dd 'de' MMMM", { locale: ptBR })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                  {format(new Date(date.data), "EEEE", { locale: ptBR })}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1
                }}>
                  <Typography variant="body2">
                    {date.horario_inicio} às {date.horario_fim}
                  </Typography>
                  <Chip
                    icon={date.disponivel ? <CheckCircleIcon /> : <WarningIcon />}
                    label={date.disponivel ? "Disponível" : "Indisponível"}
                    size="small"
                    color={date.disponivel ? "success" : "warning"}
                    sx={{ 
                      '& .MuiChip-icon': { 
                        fontSize: 16,
                        marginLeft: '8px',
                        color: '#fff'
                      },
                      '& .MuiChip-label': {
                        px: 1.5,
                        py: 0.75,
                        color: '#fff'
                      },
                      height: '32px',
                      backgroundColor: date.disponivel ? '#2e7d32' : '#ed6c02',
                      '&:hover': {
                        backgroundColor: date.disponivel ? '#1b5e20' : '#e65100'
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Fade>
  );
};

export default RecurrencePreview; 