import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: '#f5f5f5', padding: '10px', textAlign: 'center' }}
    >
      <Typography variant="body2" color="textSecondary">
        &copy; 2024 Reservas de Quadras. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;