import React from 'react';
import { Box, Skeleton, Stack, Grid } from '@mui/material';
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

const LoadingSkeleton = () => (
  <Stack spacing={1}>
    {[...Array(4)].map((_, index) => (
      <Box
        key={index}
        sx={{
          p: 2,
          borderRadius: 1,
          border: '1px solid #f1f1f1',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          animation: `${fadeInUp} 0.3s ease-out forwards`,
          animationDelay: `${index * 0.05}s`,
          opacity: 0,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Coluna 1: Data e dia da semana */}
          <Grid item xs={6}>
            <Skeleton 
              variant="text" 
              width={120} 
              height={24}
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width={80} 
              height={20}
              animation="wave"
            />
          </Grid>

          {/* Coluna 2: Horário e status */}
          <Grid item xs={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 1
            }}>
              <Skeleton 
                variant="text" 
                width={100} 
                height={20}
                animation="wave"
              />
              <Skeleton 
                variant="rounded"
                width={100}
                height={24}
                animation="wave"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    ))}
  </Stack>
);

export default LoadingSkeleton; 