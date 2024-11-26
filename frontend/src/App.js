import React from 'react';
import AppRoutes from './routes';
import { ThemeProvider } from '@mui/material';
import { adminTheme } from './theme/adminTheme';

const App = () => {
  return (
    <ThemeProvider theme={adminTheme}>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;