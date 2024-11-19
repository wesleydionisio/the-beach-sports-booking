// src/components/CourtCard.jsx

import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Button, Typography, Box, Chip } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsIcon from '@mui/icons-material/Sports';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CourtCard = ({ court }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Mapa de ícones por esporte
  const esporteIcons = {
    'Futebol': SportsSoccerIcon,
    'Vôlei': SportsVolleyballIcon,
    'Basquete': SportsBasketballIcon,
    'Tênis': SportsTennisIcon,
    // Adicione mais esportes conforme necessário
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
        mt: 2 
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
                backgroundColor: 'rgba(25, 118, 210, 0.08)', // Cor de fundo suave
                color: 'primary.main',
                '& .MuiChip-icon': {
                  color: 'primary.main',
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
      maxWidth: { xs: '100%', sm: 345 },
      minWidth: { xs: '100%', sm: 345 },
      borderRadius: 3, 
      boxShadow: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      mx: { xs: 0, sm: 'auto' },
    }}>
      {/* Área da Imagem */}
      {!imageLoaded && (
        <Skeleton 
          height={200} 
          width="100%" 
          style={{ display: 'block' }}
        />
      )}

      <CardMedia
        component="img"
        alt={court.nome}
        height="200"
        image={court.foto_principal || 'https://via.placeholder.com/300x200'}
        onLoad={() => setImageLoaded(true)}
        style={{
          ...(!imageLoaded && { display: 'none' }),
          objectFit: 'cover',
        }}
      />

      {/* Conteúdo do Card */}
      <CardContent sx={{ 
        flexGrow: 1,
        pb: 0, // Remove o padding bottom do CardContent
      }}>
        {!imageLoaded ? (
          <>
            <Skeleton height={30} width="80%" style={{ marginBottom: 6 }} />
            <Skeleton height={20} width="60%" />
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Skeleton width={80} height={32} />
              <Skeleton width={80} height={32} />
              <Skeleton width={80} height={32} />
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" component="div" gutterBottom>
              {court.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {court.endereco}
            </Typography>
            {renderEsportes(court.esportes_permitidos)}
          </>
        )}
      </CardContent>

      {/* Ações do Card */}
      <CardActions 
        sx={{ 
          p: 0, // Remove todo padding
          mt: 2, // Adiciona margem superior
          '& .MuiButton-root': { // Estiliza o botão
            borderRadius: 0, // Remove border radius
            py: 1.5, // Aumenta padding vertical
            textTransform: 'none', // Opcional: remove texto em maiúsculas
          }
        }}
      >
        {!imageLoaded ? (
          <Skeleton height={48} width="100%" style={{ margin: 0 }} />
        ) : (
          <Button 
            size="large"
            variant="contained" 
            color="primary" 
            href={`/booking/${court._id}`}
            fullWidth
          >
            Reservar
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CourtCard;