import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Criar Conta
          </Typography>
          <RegisterForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage; 