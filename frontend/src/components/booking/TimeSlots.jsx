// src/components/booking/TimeSlots.jsx
import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const TimeSlots = ({ slots, onSlotSelect, selectedSlot }) => {
  const handleSlotClick = (slot) => {
    onSlotSelect(slot);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      maxHeight: '343px',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
        '&:hover': {
          background: '#666',
        },
      },
    }}>
      {(!slots || slots.length === 0) ? (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
          Nenhum horário disponível para esta data
        </Typography>
      ) : (
        <Stack spacing={1} sx={{ p: 1 }}>
          {slots.map((slot, index) => {
            const isSelected = selectedSlot && 
                             selectedSlot.horario_inicio === slot.horario_inicio;
            const isNobre = slot.is_horario_nobre;
            
            return (
              <Button
                key={index}
                onClick={() => handleSlotClick(slot)}
                disabled={!slot.disponivel}
                variant={isSelected ? "contained" : "outlined"}
                fullWidth
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 2,
                  backgroundColor: isSelected 
                    ? 'primary.main' 
                    : !slot.disponivel 
                      ? '#f5f5f5'
                      : '#ffffff',
                  border: isSelected 
                    ? 'none' 
                    : '1px solid #f1f1f1',
                  borderRadius: 1,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: !slot.disponivel 
                      ? '#f5f5f5'
                      : isSelected 
                        ? 'primary.dark'
                        : 'primary.light',
                  },
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  width: '100%',
                  gap: 2
                }}>
                  {/* Horário */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: isSelected ? '#fff' : 
                             !slot.disponivel ? 'rgba(0, 0, 0, 0.38)' : '#000'
                    }}
                  >
                    {slot.horario_inicio} - {slot.horario_fim}
                  </Typography>

                  {/* Label Em alta! */}
                  {isNobre && slot.disponivel && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 0.5,
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : '#fff8e1',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      <LocalFireDepartmentIcon 
                        sx={{ 
                          fontSize: 16,
                          color: isSelected ? '#fff' : '#ffa000'
                        }} 
                      />
                      <Typography 
                        variant="caption"
                        sx={{ 
                          color: isSelected ? '#fff' : '#ffa000',
                          fontWeight: 600
                        }}
                      >
                        Em alta!
                      </Typography>
                    </Box>
                  )}

                  {/* Status de indisponível */}
                  {!slot.disponivel && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                      }}
                    >

                    </Typography> 
                  )}

                  {/* Preço */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: isSelected ? '#fff' : 
                               slot.disponivel ? '#000' : 'rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      {slot.valor ? `R$ ${slot.valor.toFixed(2)}` : 'Preço indisponível'}
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{
                        color: isSelected ? '#fff' : 
                               slot.disponivel ? '#000' : 'rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      /h
                    </Typography>
                  </Box>
                </Box>
              </Button>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default TimeSlots;