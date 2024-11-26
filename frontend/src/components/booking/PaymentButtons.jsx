// src/components/booking/PaymentButtons.jsx
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography, Skeleton } from '@mui/material';
import axios from '../../api/apiService';
import PaymentIcon from '@mui/icons-material/Payment';
import { blue, red, purple, indigo } from '@mui/material/colors';

const PaymentButtons = ({ onPaymentSelect, selectedPayment, loading = false }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
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
          loadedIcons[method.label] = null;
        }
      }
    }
    setIcons(loadedIcons);
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('/payment-methods');
        
        if (response.data.success) {
          const sortedMethods = response.data.data
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .filter(method => method.active);
          
          setPaymentMethods(sortedMethods);
          await loadIcons(sortedMethods);
        }
      } catch (error) {
        console.error('Erro ao carregar métodos de pagamento:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Componente de Skeleton
  if (loading) {
    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 2 
        }}>
          {[1, 2, 3].map((index) => (
            <Skeleton
              key={index}
              variant="rounded"
              sx={{
                height: 40,
                width: 140,
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                borderRadius: 1
              }}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2 
      }}>
        {loadingData ? (
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
                          width: 20,
                          height: 20,
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
                  minWidth: 'auto',
                  flex: '0 0 auto',
                  px: 2,
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
    </Box>
  );
};

export default PaymentButtons;