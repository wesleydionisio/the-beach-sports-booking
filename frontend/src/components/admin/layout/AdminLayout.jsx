import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from '../common/AdminHeader';

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <AdminHeader />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout; 