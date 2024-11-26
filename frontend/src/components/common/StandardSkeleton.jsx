import React from 'react';
import { Box, Stack, Skeleton, Fade } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StandardSkeleton = ({ 
  items = 8, // número de itens
  height = 72, // altura de cada item
  variant = 'default', // default, compact, custom
  customContent, // função para renderizar conteúdo personalizado
  spacing = 1, // espaçamento entre itens
  padding = 1, // padding do container
  maxHeight = '343px', // altura máxima do container com scroll
}) => {
  const renderSkeletonContent = (index) => {
    if (customContent) {
      return customContent(index);
    }

    switch (variant) {
      case 'compact':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="text" width={80} height={24} animation="wave" />
            <Skeleton variant="text" width={60} height={24} animation="wave" />
          </Box>
        );

      case 'default':
      default:
        return (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: '100%',
            gap: 2 
          }}>
            <Skeleton variant="text" width={80} height={24} animation="wave" />
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              ml: 'auto' 
            }}>
              <Skeleton variant="text" width={60} height={24} animation="wave" />
              <Skeleton variant="text" width={20} height={24} animation="wave" />
            </Box>
          </Box>
        );
    }
  };

  return (
    <Fade in timeout={300}>
      <Box sx={{ 
        height: '100%',
        maxHeight,
        overflow: 'auto',
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': { background: '#666' },
        },
      }}>
        <Stack spacing={spacing} sx={{ p: padding }}>
          {[...Array(items)].map((_, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                height: height,
                borderRadius: 1,
                border: '1px solid #f1f1f1',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                animation: `${fadeInUp} 0.3s ease-out forwards`,
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {renderSkeletonContent(index)}
            </Box>
          ))}
        </Stack>
      </Box>
    </Fade>
  );
};

export default StandardSkeleton; 