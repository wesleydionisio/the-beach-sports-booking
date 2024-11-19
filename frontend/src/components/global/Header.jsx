// src/components/global/Header.jsx

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Fade,
  Slide
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [elevate, setElevate] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setElevate(true);
    } else {
      setElevate(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const menuItems = [
    { label: 'A Beach Sports', path: '/' },
    { label: 'Valores', path: '/valores' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Escola', path: '/escola' },
    { label: 'Contato', path: '/contato' },
  ];

  const DrawerContent = () => (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        pt: 8,
      }}
    >
      {/* Botão Fechar */}
      <IconButton
        onClick={toggleDrawer(false)}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          color: 'inherit',
          padding: 1
        }}
      >
        <CloseIcon sx={{ 
          fontSize: 32
        }} />
      </IconButton>

      {/* Lista de Menu */}
      <List sx={{ width: '100%', pt: 4 }}>
        {menuItems.map((item, index) => (
          <Slide
            direction="right"
            in={isDrawerOpen}
            timeout={(index + 1) * 100}
            key={item.label}
          >
            <ListItem 
              disablePadding
              onClick={toggleDrawer(false)}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                sx={{
                  py: 2,
                  px: 4,
                  textAlign: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'h6',
                    textAlign: 'center'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Slide>
        ))}
      </List>

      {/* Botão de Login */}
      <Box sx={{ 
        mt: 'auto',
        p: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Fade in={isDrawerOpen} timeout={600}>
          <Button
            component={RouterLink}
            to="/login"
            onClick={toggleDrawer(false)}
            sx={{ 
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'transparent',
                opacity: 0.8
              }
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 28 }} />
            <span>Entrar / Cadastrar</span>
          </Button>
        </Fade>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={elevate ? 4 : 0}
      sx={{
        transition: 'all 0.3s ease',
        backgroundColor: elevate 
          ? 'rgba(255, 255, 255, 0.5)' 
          : 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: elevate ? '#000' : '#fff',
        boxShadow: elevate 
          ? '0 1px 3px rgba(0, 0, 0, 0.08)'
          : 'none',
        zIndex: 1300,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: elevate 
            ? 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))'
            : 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
          zIndex: -1,
        },
      }}
    >
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative', // Para manter o conteúdo acima do overlay
        zIndex: 1,
      }}>
        <Toolbar sx={{ 
          padding: '8px 16px',
          minHeight: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          width: '80%',
          maxWidth: '1200px',
        }}>
          {/* Logo - Seção Esquerda */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              flex: '0 0 auto',
            }}
          >
            <img
              src="/logo_beach_sports.png"
              alt="A Beach Sports Logo"
              style={{
                height: '50px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Box>

          {/* Menu para Desktop - Seção Central */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 auto',
              gap: 2
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  sx={{ color: 'inherit' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Botão de Login Desktop */}
          {!isMobile && (
            <Button
              component={RouterLink}
              to="/login"
              sx={{ 
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.8
                }
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 24 }} />
              <span>Entrar / Cadastrar</span>
            </Button>
          )}

          {/* Menu Mobile */}
          {isMobile && (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{
                  padding: 1,
                }}
              >
                <MenuIcon sx={{ fontSize: 32 }} />
              </IconButton>
              <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                  '& .MuiDrawer-paper': {
                    width: '100%',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              >
                <DrawerContent />
              </Drawer>
            </>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;