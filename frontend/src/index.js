// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css' // Adicione esta linha
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <AppRoutes />
      </SnackbarProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);