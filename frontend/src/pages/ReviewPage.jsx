import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const ReviewPage = () => {
  return (
    <Container>
      <Box>
        <Typography variant="h5" align="center">
          Revisão da Reserva
        </Typography>
        {/* Exibição dos detalhes da reserva */}
        <Typography>Nome da Quadra: Quadra X</Typography>
        <Typography>Data: 2024-11-17</Typography>
        <Typography>Horário: 14:00 - 15:00</Typography>
        <Typography>Esporte: Futebol</Typography>
        <Typography>Pagamento: Pagamento no Ato</Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary">
            Voltar ao Início
          </Button>
          <Button variant="outlined" color="secondary" sx={{ ml: 2 }}>
            Cancelar Reserva
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ReviewPage;