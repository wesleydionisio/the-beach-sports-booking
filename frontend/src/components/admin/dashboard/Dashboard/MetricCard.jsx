import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  position: 'relative',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const MetricCard = ({ title, value, icon: Icon, loading, trend, color = 'primary' }) => {
  return (
    <StyledCard>
      <CardContent sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Typography variant="h4" sx={{ mt: 1 }}>
                {value}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            <Icon sx={{ fontSize: 40 }} />
          </Box>
        </Box>
        {trend && (
          <Typography
            variant="caption"
            sx={{
              color: trend > 0 ? 'success.main' : 'error.main',
              display: 'flex',
              alignItems: 'center',
              mt: 1,
            }}
          >
            {trend}% em relação ao mês anterior
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default MetricCard; 