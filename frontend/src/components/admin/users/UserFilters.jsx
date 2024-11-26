import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const UserFilters = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <TextField
        size="small"
        placeholder="Buscar por nome ou email"
        sx={{ flexGrow: 1 }}
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Tipo</InputLabel>
        <Select label="Tipo" defaultValue="all">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="client">Cliente</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select label="Status" defaultValue="all">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="active">Ativos</MenuItem>
          <MenuItem value="inactive">Inativos</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserFilters; 