import React from 'react';
import { Box, Container, Typography, Grid, Button, Divider } from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AboutSection = () => {
  const features = [
    {
      icon: <SportsTennisIcon sx={{ fontSize: 24 }} />,
      description: 'Quadras de alta qualidade para sua prática esportiva'
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 24 }} />,
      description: 'Espaço ideal para toda família se divertir'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 24 }} />,
      description: 'Fácil acesso no centro da cidade'
    },
    {
      icon: <EventAvailableIcon sx={{ fontSize: 24 }} />,
      description: 'Disponibilidade em diversos horários'
    }
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Coluna da Esquerda */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 500 }}>
              {/* Subtítulo */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  mb: 2,
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                  },
                }}
              >
                A Beach Sports
              </Typography>

              {/* Título */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: '1.75rem',
                    sm: '2.25rem',
                    md: '2.75rem',
                  },
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Um pedaço da praia no centro de Cachoeira do Sul
              </Typography>

              {/* Divider */}
              <Divider sx={{ 
                my: 3,
                width: '80px',
                borderColor: 'primary.main',
                borderWidth: 2
              }} />

              {/* Texto Introdutório */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: {
                    xs: '1rem',
                    sm: '1.1rem',
                  },
                }}
              >
                Oferecemos a melhor estrutura para a prática de esportes de areia, 
                com ambiente familiar e localização privilegiada.
              </Typography>

              {/* Lista de Features */}
              <Box sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        flex: 1,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Botão */}
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}
              >
                Conhecer o espaço
              </Button>
            </Box>
          </Grid>

          {/* Coluna da Direita - Imagem */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://superquadrajundu.com.br/wp-content/uploads/2023/12/Rectangle-13.png"
              alt="A Beach Sports"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;