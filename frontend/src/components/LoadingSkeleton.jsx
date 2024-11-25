import React from 'react';
import { Box, Stack, Skeleton, Paper } from '@mui/material';

export const LoadingSkeleton = () => (
  <Box sx={{ mt: 1 }}>
    {/* Container de Review */}
    <Paper sx={{ p: 2, mb: 1, boxShadow: 'none', bgcolor: 'grey.50' }}>
      <Stack spacing={0.5}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} display="flex" justifyContent="space-between">
            <Skeleton 
              width={80} 
              height={24} 
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
            <Skeleton 
              width={120} 
              height={24} 
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>
        ))}
      </Stack>
    </Paper>

    {/* Alert Skeleton */}
    <Skeleton 
      variant="rectangular" 
      height={48} 
      animation="wave"
      sx={{ 
        mb: 1,
        borderRadius: 1,
        bgcolor: 'grey.200'
      }} 
    />

    {/* Lista de Horários Skeleton */}
    <Stack spacing={1}>
      {[...Array(5)].map((_, index) => (
        <Paper 
          key={index}
          sx={{ 
            p: 1.5,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Skeleton 
                width={120} 
                height={24} 
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
              <Skeleton 
                width={160} 
                height={20} 
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
            </Box>
            <Skeleton 
              width={80} 
              height={24} 
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>
        </Paper>
      ))}
    </Stack>
  </Box>
);

export default LoadingSkeleton; 