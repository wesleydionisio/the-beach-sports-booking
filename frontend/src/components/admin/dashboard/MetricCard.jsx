import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%'
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: `${color}15`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MetricCard; 