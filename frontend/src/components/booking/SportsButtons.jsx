// src/components/booking/SportsButtons.jsx
import React from 'react';
import { Button, Box } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';

const SportsButtons = ({ sports, selectedSport, onSportSelect }) => {
  // Mapa de ícones para cada esporte
  const sportIcons = {
    'Tênis': <SportsTennisIcon />,
    'Vôlei': <SportsVolleyballIcon />,
    'Basquete': <SportsBasketballIcon />,
    'Futebol': <SportsFootballIcon />
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {sports.map((sport) => (
        <Button
          key={sport._id} // Assumindo que cada esporte tem um _id
          variant={selectedSport === sport._id ? "contained" : "outlined"}
          onClick={() => onSportSelect(sport._id)}
          startIcon={sportIcons[sport.nome]} // Usando o nome do esporte para pegar o ícone
          sx={{
            minWidth: '120px',
            py: 1,
          }}
        >
          {sport.nome} {/* Usando o nome do esporte */}
        </Button>
      ))}
    </Box>
  );
};

export default SportsButtons;