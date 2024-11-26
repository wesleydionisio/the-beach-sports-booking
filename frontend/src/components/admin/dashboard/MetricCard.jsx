import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
          transition: 'all 0.3s ease'
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 2,
          color: `${color}40`
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 48 } })}
      </Box>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="h4" component="div" sx={{ mt: 'auto', color }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default MetricCard; 