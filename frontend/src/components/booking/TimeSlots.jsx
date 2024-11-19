// src/components/booking/TimeSlots.jsx
import React from 'react';
import { Grid, Button, Box } from '@mui/material';

const TimeSlots = ({ slots, onSlotSelect, selectedSlot }) => {
  return (
    <Grid container spacing={1}>
      {slots.map((slot) => {
        const horario = slot.horario_inicio;
        const isSelected = selectedSlot && selectedSlot.horario_inicio === slot.horario_inicio;

        return (
          <Grid item xs={3} md={3} key={`${slot.horario_inicio}-${slot.horario_fim}`}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                borderRadius: 1,
                '&::after': !slot.available ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(to left top, 
                    transparent calc(50% - 0.5px), 
                    rgba(0, 0, 0, 0.2) calc(50% - 0.5px), 
                    rgba(0, 0, 0, 0.2) calc(50% + 0.5px), 
                    transparent calc(50% + 0.5px))`,
                  pointerEvents: 'none',
                  zIndex: 1,
                  borderRadius: 1,
                } : {}
              }}
            >
              <Button
                variant="contained"
                onClick={() => onSlotSelect(slot)}
                disabled={!slot.available}
                fullWidth
                sx={{
                  height: '45px',
                  backgroundColor: isSelected ? 'primary.main' : '#f1f1f1',
                  color: isSelected ? '#fff' : 'text.primary',
                  '&:hover': {
                    backgroundColor: slot.available ? 'primary.main' : '#f1f1f1',
                    color: slot.available ? '#fff' : 'text.primary',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#e0e0e0',
                    color: 'rgba(0, 0, 0, 0.38)',
                  },
                  minWidth: 0,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: 'none',
                  borderRadius: 1,
                }}
              >
                {horario}
              </Button>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TimeSlots;