import React from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import Slider from 'react-slick';
import DefaultCourtCard from '../DefaultCourtCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import backgroundImage from '../../assets/images/pages/section-1.png';

const HeroSection = ({ courts, loading }) => {
  // Configurações do slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    arrows: true,
    variableWidth: false,
    centerMode: false,
    cssEase: "linear",
    className: "hero-slider",
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerMode: true,
          centerPadding: '0',
        },
      },
    ],
  };

  const sliderStyles = {
    '.court-slider': {
      width: '100%',
      margin: '0 auto',
      overflow: 'hidden',
    },
    '.slick-list': {
      margin: '0 !important',
      padding: '0 !important',
    },
    '.slick-track': {
      display: 'flex !important',
      alignItems: 'center',
    },
    '.slick-slide': {
      width: '100% !important',
      '& > div': {
        width: '100%',
      },
    },
    '.slick-dots': {
      bottom: '10px',
      '& li button:before': {
        fontSize: '8px',
      },
    },
  };

  // Número de skeletons a serem exibidos no slider
  const skeletonSlides = Array.from({ length: 3 }).map((_, index) => (
    <Box key={index} sx={{ padding: '0 8px' }}>
      <Skeleton height={200} />
    </Box>
  ));

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      />

      {/* Conteúdo da Sessão */}
      <Box
        sx={{
          position: 'relative',
          textAlign: 'left',
          zIndex: 1,
          width: { xs: '90%', md: '70%' },
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            letterSpacing: '-0.5px',
            fontSize: {
              xs: '2rem',
              sm: '2.5rem',
              md: '3rem',
              lg: '3.5rem'
            },
            lineHeight: {
              xs: 1,
              sm: 1.1,
              md: 1.2
            },
            mb: {
              xs: 2,
              sm: 3,
              md: 4
            }
          }}
        >
          Convoque o time e
          <br /> marque uma partida!
        </Typography>

        {/* Slider das Quadras */}
        <Box sx={{ 
          mt: 4,
          position: 'relative',
          width: '100%',
          '.hero-slider': {
            width: '100%',
            margin: '0 auto',
            '& .slick-list': {
              overflow: 'hidden',
              margin: '0 -12px',
            },
            '& .slick-slide': {
              padding: '0 12px',
              '& > div': {
                width: '100%',
              }
            },
            '& .slick-track': {
              display: 'flex !important',
              alignItems: 'stretch',
              margin: '0 auto',
            },
            '& .slick-dots': {
              bottom: -40,
              '& li': {
                margin: 0,
                '& button:before': {
                  fontSize: 12,
                  color: 'white',
                  opacity: 0.5,
                },
                '&.slick-active button:before': {
                  opacity: 1,
                }
              }
            },
            '& .slick-prev, & .slick-next': {
              width: 40,
              height: 40,
              zIndex: 2,
              '&:before': {
                fontSize: 40,
                opacity: 0.7,
              },
              '&:hover:before': {
                opacity: 1,
              }
            },
            '& .slick-prev': {
              left: { xs: -10, md: -50 },
            },
            '& .slick-next': {
              right: { xs: -10, md: -50 },
            },
          }
        }}>
          {loading ? (
            <Slider {...sliderSettings}>
              {skeletonSlides}
            </Slider>
          ) : courts.length > 0 ? (
            <Slider {...sliderSettings}>
              {courts.map((court) => (
                <Box 
                  key={court._id} 
                  sx={{
                    height: '100%',
                  }}
                >
                  <DefaultCourtCard court={court} />
                </Box>
              ))}
            </Slider>
          ) : (
            <Typography variant="h6">Nenhuma quadra disponível no momento.</Typography>
          )}
        </Box>

        {/* Redes Sociais */}
        <Box sx={{ 
          mt: 8,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1, md: 3 },
        }}>
          <Typography 
            variant="h6"
            sx={{
              m: -1,
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Siga-nos nas redes sociais
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}>
            <IconButton
              component="a"
              href="https://instagram.com/seu-perfil"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: '#fff',
                padding: { xs: 0.5, md: 1 },
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              <InstagramIcon fontSize="large" />
            </IconButton>
            <IconButton
              component="a"
              href="https://facebook.com/seu-perfil"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: '#fff',
                padding: { xs: 0.5, md: 1 },
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              <FacebookIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection; 