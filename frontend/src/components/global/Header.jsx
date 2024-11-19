// src/components/global/Header.jsx

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [elevate, setElevate] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const menuItems = [
    { label: 'A Beach Sports', path: '/' },
    { label: 'Valores', path: '/valores' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Escola', path: '/escola' },
    { label: 'Contato', path: '/contato' },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={elevate ? 4 : 0}
      sx={{
        transition: 'all 0.3s ease',
        backgroundColor: elevate 
          ? 'rgba(255, 255, 255, 0.8)' // Fundo semi-transparente quando elevado
          : 'rgba(0, 0, 0, 0.2)',      // Overlay escuro quando não elevado
        backdropFilter: 'blur(8px)',    // Efeito de blur
        WebkitBackdropFilter: 'blur(8px)', // Suporte para Safari
        color: elevate ? '#000' : '#fff',
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
                height: '60px',
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
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    onClick={handleClose}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem
                  component={RouterLink}
                  to="/entrar"
                  onClick={handleClose}
                >
                  Entrar
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/login"
                  onClick={handleClose}
                >
                  Cadastrar
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Header;