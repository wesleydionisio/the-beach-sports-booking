// src/components/booking/PaymentButtons.jsx
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import axios from '../../api/apiService';
import PaymentIcon from '@mui/icons-material/Payment';
import { blue, red, purple, indigo } from '@mui/material/colors';

const PaymentButtons = ({ onPaymentSelect, selectedPayment }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [icons, setIcons] = useState({});

  const sanitizeSvg = async (url) => {
    try {
      const response = await fetch(url);
      const svgText = await response.text();
      
      // Remove todos os fills e strokes existentes e adiciona fill="currentColor"
      const sanitized = svgText
        .replace(/fill="[^"]*"/g, '')
        .replace(/stroke="[^"]*"/g, '')
        .replace(/style="[^"]*"/g, '')
        .replace(/<svg/, '<svg fill="' + blue[500] + '"');
      
      return `data:image/svg+xml,${encodeURIComponent(sanitized)}`;
    } catch (error) {
      console.error('Erro ao sanitizar SVG:', error);
      return null;
    }
  };

  const loadIcons = async (methods) => {
    const loadedIcons = {};
    for (const method of methods) {
      if (method.icon) {
        try {
          const iconUrl = require(`../../assets/icons/${method.icon}`);
          const sanitizedUrl = await sanitizeSvg(iconUrl);
          loadedIcons[method.label] = sanitizedUrl;
        } catch (error) {
          console.log(`Ícone não encontrado para ${method.label}:`, error);
          loadedIcons[method.label] = null;
        }
      }
    }
    setIcons(loadedIcons);
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        console.log('Buscando métodos de pagamento...');
        const response = await axios.get('/payment-methods');
        
        if (response.data.success) {
          const sortedMethods = response.data.data
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .filter(method => method.active);
          
          console.log('Métodos de pagamento:', sortedMethods);
          setPaymentMethods(sortedMethods);
          await loadIcons(sortedMethods);
        }
      } catch (error) {
        console.error('Erro ao carregar métodos de pagamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        paymentMethods.map((method) => {
          const isSelected = selectedPayment === method._id;
          
          return (
            <Button
              key={method._id}
              variant={isSelected ? "contained" : "outlined"}
              color="primary"
              onClick={() => onPaymentSelect(method._id)}
              startIcon={
                icons[method.label] ? (
                  <Box
                    component="span"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& img': {
                        width: 24,
                        height: 24,
                        filter: isSelected ? 'brightness(0) invert(1)' : 'none'
                      }
                    }}
                  >
                    <img 
                      src={icons[method.label]} 
                      alt={method.label}
                    />
                  </Box>
                ) : (
                  <PaymentIcon color="inherit" />
                )
              }
              sx={{ 
                justifyContent: 'flex-start',
                '& .MuiSvgIcon-root': {
                  color: 'inherit'
                }
              }}
            >
              {method.label}
            </Button>
          );
        })
      )}
    </Box>
  );
};

export default PaymentButtons;