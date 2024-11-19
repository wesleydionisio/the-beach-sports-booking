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
        pt: 8, // Espaço para o header
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
          padding: 1 // Ajusta o padding do botão
        }}
      >
        <CloseIcon sx={{ 
          fontSize: 32 // Aumenta o tamanho do ícone para combinar com o menu
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
                    backgroundColor: 'rgba(0, 0, 0, 0.9)'
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

      {/* Botões de Ação */}
      <Box sx={{ 
        mt: 'auto', 
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Fade in={isDrawerOpen} timeout={600}>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            onClick={toggleDrawer(false)}
          >
            Entrar
          </Button>
        </Fade>
        <Fade in={isDrawerOpen} timeout={800}>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={toggleDrawer(false)}
          >
            Cadastrar
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
          ? '0 1px 10px rgba(0, 0, 0, 0.08)'
          : 'none',
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

          {/* Botões de Ação - Seção Direita */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: '0 0 auto',
            }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="primary"
              >
                Entrar
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
              >
                Cadastrar
              </Button>
            </Box>
          )}

          {/* Menu para Mobile */}
          {isMobile && (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{
                  padding: 1, // Ajusta o padding do botão
                }}
              >
                <MenuIcon sx={{ 
                  fontSize: 32 // Aumenta o tamanho do ícone
                }} />
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