// src/components/booking/SportsButtons.jsx
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import axios from '../../api/apiService';
import SportsIcon from '@mui/icons-material/Sports';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { blue } from '@mui/material/colors';

const SPORT_ICONS = {
  'Futebol': SportsSoccerIcon,
  'Basquete': SportsBasketballIcon,
  'Vôlei': SportsVolleyballIcon,
  'Tênis': SportsTennisIcon,
  'default': SportsIcon
};

const SportsButtons = ({ onSportSelect, selectedSport }) => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [icons, setIcons] = useState({});

  const sanitizeSvg = async (url) => {
    try {
      const response = await fetch(url);
      const svgText = await response.text();
      
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

  const loadIcons = async (sportsList) => {
    const loadedIcons = {};
    for (const sport of sportsList) {
      if (sport.icon) {
        try {
          const iconUrl = require(`../../assets/icons/sports/${sport.icon}`);
          const sanitizedUrl = await sanitizeSvg(iconUrl);
          loadedIcons[sport.nome] = sanitizedUrl;
        } catch (error) {
          console.log(`Usando ícone fallback para ${sport.nome}`);
          loadedIcons[sport.nome] = null;
        }
      }
    }
    setIcons(loadedIcons);
  };

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get('/sports');
        
        if (response.data.success) {
          const sortedSports = response.data.data
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .filter(sport => sport.active);
          
          setSports(sortedSports);
          await loadIcons(sortedSports);
        }
      } catch (error) {
        console.error('Erro ao carregar esportes:', error);
        // Em caso de erro, carrega alguns esportes padrão
        const defaultSports = [
          { _id: '1', name: 'Futebol', active: true },
          { _id: '2', name: 'Basquete', active: true },
          { _id: '3', name: 'Vôlei', active: true },
          { _id: '4', name: 'Tênis', active: true }
        ];
        setSports(defaultSports);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  const getFallbackIcon = (sportName) => {
    const IconComponent = SPORT_ICONS[sportName] || SPORT_ICONS.default;
    return <IconComponent />;
  };

  const handleSportSelect = (sport) => {
    console.log('Esporte selecionado:', sport);
    onSportSelect(sport);
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2 
      }}>
        {loading ? (
          <CircularProgress />
        ) : (
          sports.map((sport) => {
            const isSelected = selectedSport?._id === sport._id;
            
            const iconBox = (IconComponent) => (
              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isSelected ? 'transparent' : blue[500],
                  borderRadius: '4px 0 0 4px',
                  minWidth: 48,
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                {IconComponent}
              </Box>
            );

            return (
              <Button
                key={sport._id}
                variant={isSelected ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleSportSelect(sport)}
                sx={{ 
                  height: 40,
                  p: 0,
                  pl: 6,
                  pr: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  '& .MuiButton-startIcon': {
                    display: 'none'
                  }
                }}
              >
                {icons[sport.nome] ? 
                  iconBox(
                    <img 
                      src={icons[sport.nome]} 
                      alt={sport.nome}
                      style={{
                        width: 24,
                        height: 24,
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                  ) : 
                  iconBox(
                    <Box sx={{
                      '& .MuiSvgIcon-root': {
                        color: isSelected ? 'inherit' : 'white',
                        fontSize: 24
                      }
                    }}>
                      {getFallbackIcon(sport.nome)}
                    </Box>
                  )
                }
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 2,
                    mr: 1
                  }}
                >
                  {sport.nome}
                </Box>
              </Button>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default SportsButtons;