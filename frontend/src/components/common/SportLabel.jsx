import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import SportsIcon from '@mui/icons-material/Sports';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

const SPORT_ICONS = {
  'Futebol': SportsSoccerIcon,
  'Basquete': SportsBasketballIcon,
  'Vôlei': SportsVolleyballIcon,
  'Tênis': SportsTennisIcon,
  'default': SportsIcon
};

const SportLabel = ({ icon: CustomIcon, label, sportData }) => {
  console.log('1. SportLabel recebeu:', { CustomIcon, label, sportData });
  
  const [customIconUrl, setCustomIconUrl] = useState(null);

  const sanitizeSvg = async (url) => {
    try {
      console.log('2. Tentando sanitizar SVG:', url);
      const response = await fetch(url);
      const svgText = await response.text();
      
      const sanitized = svgText
        .replace(/fill="[^"]*"/g, '')
        .replace(/stroke="[^"]*"/g, '')
        .replace(/style="[^"]*"/g, '')
        .replace(/<svg/, '<svg fill="white"');
      
      console.log('3. SVG sanitizado com sucesso');
      return `data:image/svg+xml,${encodeURIComponent(sanitized)}`;
    } catch (error) {
      console.error('4. Erro ao sanitizar SVG:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadCustomIcon = async () => {
      if (sportData?.icon) {
        try {
          console.log('5. Tentando carregar ícone:', sportData.icon);
          const iconUrl = require(`../../assets/icons/sports/${sportData.icon}`);
          console.log('6. URL do ícone:', iconUrl);
          const sanitizedUrl = await sanitizeSvg(iconUrl);
          setCustomIconUrl(sanitizedUrl);
        } catch (error) {
          console.error('7. Erro ao carregar ícone:', error);
          setCustomIconUrl(null);
        }
      }
    };

    if (sportData?.icon) {
      loadCustomIcon();
    }
  }, [sportData]);

  const renderIcon = () => {
    if (customIconUrl) {
      return (
        <img 
          src={customIconUrl} 
          alt={label}
          style={{
            width: 20,
            height: 20,
            filter: 'brightness(0) invert(1)'
          }}
        />
      );
    }

    if (CustomIcon) {
      return <CustomIcon sx={{ fontSize: 20 }} />;
    }

    const FallbackIcon = SPORT_ICONS[label] || SPORT_ICONS.default;
    return <FallbackIcon sx={{ fontSize: 20 }} />;
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '6px 12px',
        borderRadius: '4px',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {renderIcon()}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default SportLabel; 