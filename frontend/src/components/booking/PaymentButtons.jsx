// src/components/booking/PaymentButtons.jsx
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import axios from '../../api/apiService';

// Componente de loading para os botões
const PaymentButtonsSkeleton = () => (
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
    <CircularProgress size={24} />
  </Box>
);

const PaymentButtons = ({ selectedPayment, onPaymentSelect, showGlow }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('/payment-methods');
        // Assumindo que a API retorna { success: true, data: [...métodos] }
        setPaymentMethods(response.data.data.filter(method => method.active));
      } catch (error) {
        console.error('Erro ao carregar métodos de pagamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  if (loading) return <PaymentButtonsSkeleton />;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        ...(showGlow && {
          padding: 2,
          borderRadius: 1,
          boxShadow: (theme) => `0 0 15px ${theme.palette.primary.main}40`
        })
      }}
    >
      {paymentMethods.map((method) => (
        <Button
          key={method._id}
          variant={selectedPayment === method._id ? "contained" : "outlined"}
          onClick={() => onPaymentSelect(method._id)}
          sx={{
            minWidth: '120px',
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <img 
            src={method.icon} 
            alt={method.label}
            style={{ width: 24, height: 24 }}
          />
          {method.label}
        </Button>
      ))}
    </Box>
  );
};

export default PaymentButtons;