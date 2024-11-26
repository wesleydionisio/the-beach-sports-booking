import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../global/Header';
import Footer from '../global/Footer';
import { Box } from '@mui/material';

const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {!isAdminRoute && <Header />}
      <Box component="main" sx={{ 
        flexGrow: 1,
        width: '100%',
        pt: isAdminRoute ? 0 : 8
      }}>
        <Outlet />
      </Box>
      {!isAdminRoute && <Footer />}
    </Box>
  );
};

export default MainLayout; 