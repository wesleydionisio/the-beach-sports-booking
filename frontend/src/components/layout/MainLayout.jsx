import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../global/Header';
import Footer from '../global/Footer';
import { Box } from '@mui/material';

const MainLayout = () => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <Header />
      <Box component="main" sx={{ 
        flexGrow: 1,
        width: '100%',
      }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 