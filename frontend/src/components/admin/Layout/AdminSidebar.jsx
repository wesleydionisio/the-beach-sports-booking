import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const menuItems = [
  { path: '/dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/users', title: 'Users', icon: <UsersIcon /> },
  { path: '/payments', title: 'Payments', icon: <PaymentsIcon /> },
  { path: '/slots', title: 'Slots', icon: <SlotsIcon /> }
];

const AdminSidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar; 