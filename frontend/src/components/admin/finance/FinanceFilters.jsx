import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const FinanceFilters = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <TextField
        size="small"
        type="date"
        label="Data Inicial"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 200 }}
      />
      
      <TextField
        size="small"
        type="date"
        label="Data Final"
        InputLabelProps={{ shrink: true }}
        sx={{ width: 200 }}
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Método de Pagamento</InputLabel>
        <Select label="Método de Pagamento" defaultValue="all">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="pix">PIX</MenuItem>
          <MenuItem value="credit">Cartão de Crédito</MenuItem>
          <MenuItem value="cash">Dinheiro</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select label="Status" defaultValue="all">
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="completed">Concluído</MenuItem>
          <MenuItem value="pending">Pendente</MenuItem>
          <MenuItem value="failed">Falhou</MenuItem>
          <MenuItem value="refunded">Reembolsado</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FinanceFilters; 