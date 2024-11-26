import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SportsTennis as SportsIcon,
  Business as BusinessIcon,
  Event as CalendarIcon,
  AttachMoney as MoneyIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <DashboardIcon />
    },
    {
      title: 'Usuários',
      path: '/admin/users',
      icon: <PeopleIcon />
    },
    {
      title: 'Quadras',
      path: '/admin/courts',
      icon: <SportsIcon />
    },
    {
      title: 'Meu Negócio',
      path: '/admin/business',
      icon: <BusinessIcon />
    },
    {
      title: 'Agendamentos',
      path: '/admin/schedules',
      icon: <CalendarIcon />
    },
    {
      title: 'Financeiro',
      path: '/admin/financial',
      icon: <MoneyIcon />
    }
  ];

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
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar; 