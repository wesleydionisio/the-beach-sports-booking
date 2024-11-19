// src/components/CourtCard.jsx

import React, { useState } from 'react';
import { Card, CardContent, Button, Typography, Box, Chip } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsIcon from '@mui/icons-material/Sports';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CourtCard = ({ court }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Pré-carregar a imagem
  React.useEffect(() => {
    const img = new Image();
    img.src = court.foto_principal;
    img.onload = () => setImageLoaded(true);
  }, [court.foto_principal]);

  // Mapa de ícones por esporte
  const esporteIcons = {
    'Futebol': SportsSoccerIcon,
    'Vôlei': SportsVolleyballIcon,
    'Basquete': SportsBasketballIcon,
    'Tênis': SportsTennisIcon,
  };

  const getEsporteIcon = (esporte) => {
    const EsporteIcon = esporteIcons[esporte] || SportsIcon;
    return <EsporteIcon sx={{ fontSize: 16 }} />;
  };

  const renderEsportes = (esportes) => {
    if (!esportes || !Array.isArray(esportes)) return null;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1,
        mt: 1
      }}>
        {esportes.map((esporte, index) => {
          const nomeEsporte = typeof esporte === 'object' ? esporte.nome : esporte;
          return (
            <Chip
              key={index}
              icon={getEsporteIcon(nomeEsporte)}
              label={nomeEsporte}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                '& .MuiChip-icon': {
                  color: 'white',
                },
                backdropFilter: 'blur(4px)',
                px: 1,
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          );
        })}
      </Box>
    );
  };

  return (
    <Card sx={{ 
      width: '100%',
      height: 240,
      position: 'relative',
      borderRadius: 6,
      overflow: 'hidden',
      backgroundImage: `url(${court.foto_principal})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#333', // Fallback enquanto a imagem carrega
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
        zIndex: 1,
      }
    }}>
      {!imageLoaded && (
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton 
            height="100%"
            width="100%" 
          />
        </Box>
      )}

      <CardContent sx={{ 
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white',
        p: 2,
        '&:last-child': {
          pb: 2
        },
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Conteúdo Superior */}
        <Box>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 500,
              textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
              mb: 1
            }}
          >
            {court.nome}
          </Typography>
          {renderEsportes(court.esportes_permitidos)}
        </Box>

        {/* Botão de Reserva */}
        <Button 
          variant="contained"
          href={`/booking/${court._id}`}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            mt: 'auto' // Isso empurra o botão para baixo
          }}
        >
          Reservar
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourtCard;