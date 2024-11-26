import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography
} from '@mui/material';
import {
  Dashboard,
  People,
  SportsTennis,
  EventNote,
  AttachMoney,
  Settings
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Usuários', icon: <People />, path: '/admin/users' },
  { text: 'Quadras', icon: <SportsTennis />, path: '/admin/courts' },
  { text: 'Agendamentos', icon: <EventNote />, path: '/admin/bookings' },
  { text: 'Financeiro', icon: <AttachMoney />, path: '/admin/finance' },
  { text: 'Configurações', icon: <Settings />, path: '/admin/settings' }
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: 'white'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">
            Beach Sports Admin
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar; 