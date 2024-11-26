import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import MetricsOverview from '../../components/admin/dashboard/MetricsOverview';
import BookingsTable from '../../components/admin/dashboard/BookingsTable';
import BookingsChart from '../../components/admin/dashboard/BookingsChart';

const DashboardPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Bem-vindo ao painel administrativo
        </Typography>
      </Box>

      <MetricsOverview />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BookingsChart />
        </Grid>
        <Grid item xs={12}>
          <BookingsTable />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 