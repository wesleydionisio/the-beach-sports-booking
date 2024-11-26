import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Chip
} from '@mui/material';

// Dados mockados de quadras
const mockCourts = [
  { id: 1, nome: 'Quadra 1' },
  { id: 2, nome: 'Quadra 2' },
  { id: 3, nome: 'Quadra 3' }
];

const BookingFilters = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select label="Status" defaultValue="all">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="confirmed">Confirmados</MenuItem>
          <MenuItem value="pending">Pendentes</MenuItem>
          <MenuItem value="canceled">Cancelados</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        multiple
        id="court-select"
        options={mockCourts}
        getOptionLabel={(option) => option.nome}
        renderInput={(params) => <TextField {...params} label="Quadras" />}
        renderOption={(props, option) => (
          <li {...props}>{option.nome}</li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.nome}
              {...getTagProps(option)}
              key={index}
            />
          ))
        }
      />
    </Box>
  );
};

export default BookingFilters; 