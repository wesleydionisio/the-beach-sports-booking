// src/components/booking/TimeSlots.jsx
import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const TimeSlots = ({ slots, onSlotSelect, selectedSlot }) => {
  const [showShadow, setShowShadow] = React.useState(true);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    setShowShadow(!isAtBottom);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '400px', md: '350px' },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
          opacity: showShadow ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: 'none',
          zIndex: 1
        }
      }}
    >
      <Stack 
        spacing={1} 
        onScroll={handleScroll}
        sx={{ 
          height: '100%',
          overflowY: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            background: 'transparent'
          },
          pb: 0,
        }}
      >
        {slots.map((slot) => {
          const isSelected = selectedSlot && selectedSlot.horario_inicio === slot.horario_inicio;
          
          return (
            <Button
              key={`${slot.horario_inicio}-${slot.horario_fim}`}
              onClick={() => onSlotSelect(slot)}
              disabled={!slot.available}
              fullWidth
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                backgroundColor: isSelected 
                  ? 'primary.main' 
                  : '#ffffff',
                border: isSelected 
                  ? 'none' 
                  : '1px solid #f1f1f1',
                color: isSelected ? '#fff' : 'text.primary',
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: slot.available 
                    ? isSelected 
                      ? 'primary.dark'
                      : 'primary.light'
                    : '#ffffff',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f1f1f1',
                  border: '1px solid #f1f1f1',
                  opacity: 1,
                  textDecoration: 'none',
                  '& .MuiTypography-root': {
                    color: 'rgba(0, 0, 0, 0.15)'
                  }
                },
                position: 'relative',
                overflow: 'hidden',
                height: '56px'
              }}
            >
              {/* Horários */}
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  flex: '0 0 auto',
                  minWidth: '120px'
                }}
              >
                {slot.horario_inicio} - {slot.horario_fim}
              </Typography>

              {/* Label Nobre */}
              {slot.available && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: isSelected 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 237, 213, 1)',
                  borderRadius: '8px',
                  padding: '3px 8px',
                  ml: 2,
                  height: '18px'
                }}>
                  <LocalFireDepartmentIcon sx={{ 
                    fontSize: 12,
                    color: isSelected 
                      ? '#fff' 
                      : '#FF6B00'
                  }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isSelected 
                        ? '#fff' 
                        : '#FF6B00',
                      fontWeight: 600,
                      fontSize: 10,
                      lineHeight: 1
                    }}
                  >
                    Nobre!
                  </Typography>
                </Box>
              )}

              {/* Preço */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5,
                ml: 'auto'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: isSelected 
                      ? '#fff' 
                      : slot.available 
                        ? '#000' // Preto para slots disponíveis
                        : 'rgba(0, 0, 0, 0.15)' // Cinza claro para indisponíveis
                  }}
                >
                  R$ 120,00
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isSelected 
                      ? '#fff' 
                      : slot.available 
                        ? '#000' // Preto para slots disponíveis
                        : 'rgba(0, 0, 0, 0.15)' // Cinza claro para indisponíveis
                  }}
                >
                  /h
                </Typography>
              </Box>

              {/* Overlay para slots indisponíveis */}
              {!slot.available && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(45deg, 
                    transparent calc(50% - 1px), 
                    rgba(0, 0, 0, 0.1) calc(50% - 1px), 
                    rgba(0, 0, 0, 0.1) calc(50% + 1px), 
                    transparent calc(50% + 1px))`,
                  pointerEvents: 'none'
                }} />
              )}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default TimeSlots;