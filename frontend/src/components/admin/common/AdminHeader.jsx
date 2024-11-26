import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import { AccountCircle, Notifications } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implementar logout
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        
        <IconButton size="large" color="inherit">
          <Notifications />
        </IconButton>

        <IconButton
          size="large"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader; 