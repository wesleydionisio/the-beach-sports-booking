import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import { Download } from '@mui/icons-material';
import RevenueChart from '../../components/admin/finance/RevenueChart';
import PaymentMethodsChart from '../../components/admin/finance/PaymentMethodsChart';
import TransactionsTable from '../../components/admin/finance/TransactionsTable';
import FinanceFilters from '../../components/admin/finance/FinanceFilters';

const FinancePage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Financeiro
      </Typography>
      <Box>
        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          <Tab label="Receitas" />
          <Tab label="Métodos de Pagamento" />
          <Tab label="Transações" />
          <Tab label="Filtros" />
        </Tabs>
        {currentTab === 0 && <RevenueChart />}
        {currentTab === 1 && <PaymentMethodsChart />}
        {currentTab === 2 && <TransactionsTable />}
        {currentTab === 3 && <FinanceFilters />}
      </Box>
    </Container>
  );
};

export default FinancePage; 