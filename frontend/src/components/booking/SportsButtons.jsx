// src/components/booking/SportsButtons.jsx
import React from 'react';
import { Button, Box } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';

const SportsButtons = ({ sports, selectedSport, onSportSelect }) => {
  const sportIcons = {
    'Tênis': <SportsTennisIcon />,
    'Vôlei': <SportsVolleyballIcon />,
    'Basquete': <SportsBasketballIcon />,
    'Futebol': <SportsFootballIcon />
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 2 
    }}>
      {sports.map((sport) => (
        <Button
          key={sport._id}
          variant={selectedSport === sport._id ? "contained" : "outlined"}
          color="primary"
          onClick={() => onSportSelect(sport._id)}
          startIcon={sportIcons[sport.nome]}
          sx={{ 
            justifyContent: 'flex-start',
            minWidth: 'auto',
            flex: '0 0 auto',
            '& .MuiSvgIcon-root': {
              color: 'inherit',
              width: 20,
              height: 20
            }
          }}
        >
          {sport.nome}
        </Button>
      ))}
    </Box>
  );
};

export default SportsButtons;