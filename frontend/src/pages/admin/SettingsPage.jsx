import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import GeneralSettings from '../../components/admin/settings/GeneralSettings';
import PaymentSettings from '../../components/admin/settings/PaymentSettings';
import BusinessHours from '../../components/admin/settings/BusinessHours';
import PeakHours from '../../components/admin/settings/PeakHours';

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie as configurações do sistema
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Geral" />
          <Tab label="Pagamentos" />
          <Tab label="Horário de Funcionamento" />
          <Tab label="Horários de Pico" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && <GeneralSettings />}
          {currentTab === 1 && <PaymentSettings />}
          {currentTab === 2 && <BusinessHours />}
          {currentTab === 3 && <PeakHours />}
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage; 