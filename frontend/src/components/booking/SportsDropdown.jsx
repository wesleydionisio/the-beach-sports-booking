// src/components/booking/SportsDropdown.jsx
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SportsDropdown = ({ sports, onSportSelect, selectedSport }) => {
  const handleSelect = (event) => {
    onSportSelect(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
      <InputLabel id="sport-select-label">Esporte</InputLabel>
      <Select
        labelId="sport-select-label"
        id="sport-select"
        value={selectedSport || ''}
        onChange={handleSelect}
        label="Esporte"
      >
        {sports.length > 0 ? (
          sports.map((sport) => (
            <MenuItem key={sport._id} value={sport._id}>
              {sport.nome}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            Nenhum esporte disponível
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default SportsDropdown;