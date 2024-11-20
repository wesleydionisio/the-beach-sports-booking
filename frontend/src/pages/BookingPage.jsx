import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress,
  Grid,
  Chip,
  Stack,
  Skeleton
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import axios from '../api/apiService';
import BookingCalendar from '../components/booking/Calendar';
import TimeSlots from '../components/booking/TimeSlots';
import SportsButtons from '../components/booking/SportsButtons';
import PaymentButtons from '../components/booking/PaymentButtons';
import Slider from "react-slick";
import Lightbox from "yet-another-react-lightbox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "yet-another-react-lightbox/styles.css";
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importando localização brasileira
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Para parsing de formato personalizado
import utc from 'dayjs/plugin/utc'; // Para manipulação de UTC

const OptionSkeleton = ({ title }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Skeleton variant="rounded" width={120} height={45} />
      <Skeleton variant="rounded" width={120} height={45} />
    </Box>
  </Box>
);

// Função auxiliar para o efeito de brilho
const glowEffect = (theme) => ({
  boxShadow: `0 0 15px ${theme.palette.primary.main}40`, // 40 é a opacidade em hex
  transition: 'all 0.3s ease-in-out'
});

const BookingPage = () => {
  const { quadraId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();

  const horarioInicio = 8;
  const horarioFim = 22;
  const duracao = 1;

  // Função para gerar slots de horário


  const generateTimeSlots = (reservas) => {
    // Filtrar apenas reservas que não estão canceladas
    const reservasAtivas = reservas.filter(reserva => reserva.status !== 'cancelada');
  
    const slots = [];
    for (let hour = horarioInicio; hour < horarioFim; hour++) {
      const slotInicio = `${hour.toString().padStart(2, '0')}:00`;
      const slotFim = `${(hour + duracao).toString().padStart(2, '0')}:00`;
  
      const isReserved = reservasAtivas.some(
        (reserva) =>
          (reserva.inicio <= slotInicio && reserva.fim > slotInicio) ||
          (reserva.inicio < slotFim && reserva.fim >= slotFim)
      );
  
      slots.push({ horario_inicio: slotInicio, horario_fim: slotFim, available: !isReserved });
    }
    console.log('Slots gerados:', slots); // Log para verificar
    return slots;
  };

  // Mover a função fetchTimeSlots para fora do useEffect
  const fetchTimeSlots = async (date) => {
    setLoading(true);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await axios.get(`/bookings/${quadraId}/reserved-times`, {
        params: { data: formattedDate },
      });

      const reservas = response.data.horarios_agendados || [];
      console.log('Reservas recebidas:', reservas);
      const slots = generateTimeSlots(reservas);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      setError('Não foi possível carregar os horários disponíveis.');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar o useEffect para usar a função
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate, quadraId]);

  // Atualizar handleConfirmReservation para salvar todos os dados necessários
  const handleConfirmReservation = async () => {
    console.log('🎯 Iniciando processo de reserva...');
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('⚠️ Usuário não autenticado, salvando dados...');
      const bookingData = {
        quadraId,
        date: selectedDate.format('YYYY-MM-DD'),
        slot: selectedSlot,
        sport: selectedSport,
        payment: selectedPayment,
        courtName: court?.nome, // Adicionar nome da quadra
        courtImage: court?.foto_principal // Adicionar foto da quadra
      };
      
      console.log('📝 Salvando dados da reserva:', bookingData);
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      console.log('🔄 Redirecionando para login...');
      navigate('/login');
      return;
    }
    try {
      const requestBody = {
        quadra_id: quadraId,
        data: selectedDate.format('YYYY-MM-DD'),
        horario_inicio: selectedSlot.horario_inicio,
        horario_fim: selectedSlot.horario_fim,
        esporte_id: selectedSport,
        metodo_pagamento_id: selectedPayment
      };

      const response = await axios.post('/bookings', requestBody);
      
      // Atualizar os horários disponíveis após criar a reserva
      await fetchTimeSlots(selectedDate);
      
      if (response.data.success) {
        const reservationId = response.data.reserva._id;
        navigate(`/reserva/${reservationId}`);
      } else {
        alert('Não foi possível confirmar a reserva. Tente novamente.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        'Não foi possível confirmar a reserva. Tente novamente.';
      
      // Atualizar os horários disponíveis em caso de erro também
      await fetchTimeSlots(selectedDate);
      
      alert(errorMessage);
    }
  };

  // Buscar detalhes da quadra
  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        const response = await axios.get(`/courts/${quadraId}`); // Requisição correta
        console.log('Resposta da API /courts/:id:', response.data); // Log para inspeção

        // Ajuste conforme a estrutura da resposta
        if (response.data.court) {
          setCourt(response.data.court);
        } else if (response.data.data) {
          setCourt(response.data.data);
        } else {
          setCourt(response.data); // Caso a estrutura seja diferente
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da quadra:', error);
        setError('Não foi possível carregar os detalhes da quadra.');
        setLoading(false); // Parar o loading em caso de erro
      }
    };

    fetchCourtDetails();
  }, [quadraId]);

  // Mapa de ícones para cada esporte
  const sportIcons = {
    'Tênis': <SportsTennisIcon />,
    'Vôlei': <SportsVolleyballIcon />,
    'Basquete': <SportsBasketballIcon />,
    'Futebol': <SportsFootballIcon />
  };

  // Array com todas as fotos
  const allPhotos = court ? [court.foto_principal, ...(court.galeria || [])] : [];

  // Configurações do Slick Slider
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // Aqui você pode adicionar qualquer lógica adicional necessária
    // quando a data mudar
  };

  return (
    <>
      <Grid 
        container 
        spacing={0}
        sx={{ 
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        {/* Coluna Esquerda - Imagens */}
        <Grid 
          item 
          xs={12} 
          md={4}
          sx={{ 
            position: 'relative',
            height: { xs: 'auto', md: '100vh' },
            backgroundColor: 'primary.main',
          }}
        >
          {/* Background com overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: court ? `url(${court.foto_principal})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          />

          {/* Conteúdo da coluna esquerda */}
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' },
              p: { xs: 1 },
              pl: { md: 8 },
              pr: { md: 8 },
              pt: { md: 8 },
              pb: { md: 8 },
            }}
          >
            {/* Container do Título e Esportes */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '600px',
                textAlign: { xs: 'center', md: 'left' },
                mb: { xs: 4, md: 6 },
              }}
            >
              <Typography 
                variant="h3" 
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'white',
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {court?.nome}
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                flexWrap="wrap" 
                gap={1}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                {court?.esportes_permitidos?.map((esporte) => (
                  <Chip
                    key={esporte._id}
                    icon={sportIcons[esporte.nome]}
                    label={esporte.nome}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Galeria de Fotos */}
            <Box 
              sx={{ 
                width: '100%',
                maxWidth: { xs: '100%', md: '600px' },
                position: 'relative',
                mb: { xs: -6, md: 0 },
                px: { xs: 2, md: 0 },
                '& .slick-slide': {
                  px: 1,
                },
                '& .slick-track': {
                  display: 'flex',
                  gap: '8px'
                },
                '& .slick-list': {
                  margin: '0',
                  overflow: 'hidden',
                },
                ml: { xs: 0, md: 0 },
                mr: { xs: 0, md: 0 },
                zIndex: { xs: 2, md: 1 },
                '& img': {
                  height: { xs: '80px', md: '120px' },
                  objectFit: 'cover',
                  borderRadius: '8px'
                }
              }}
            >
              <Slider {...sliderSettings}>
                {allPhotos.map((foto, index) => (
                  <div key={index}>
                    <Box
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setLightboxOpen(true);
                      }}
                      sx={{
                        height: { xs: '80px', md: '120px' },
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`
                        }
                      }}
                    >
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                  </div>
                ))}
              </Slider>
            </Box>
          </Box>
        </Grid>

        {/* Coluna Direita - Formulário */}
        <Grid 
          item 
          xs={12} 
          md={8}
          sx={{
            minHeight: '100vh',
            height: { xs: 'auto', md: '100vh' },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            pt: { xs: 4, md: '80px' },
            px: { xs: 2, md: 6 },
            pb: { xs: 4, md: 6 },
          }}
        >
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {court ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {/* Título */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                    Faça a sua reserva
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Comece escolhendo uma data
                  </Typography>
                </Box>

                {/* Grid Container */}
                <Grid container spacing={4}>
                  {/* Primeira Linha */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      height: '350px',
                      backgroundColor: 'background.paper',
                      borderRadius: 1,
                      ...((!selectedDate) && glowEffect(theme)),
                    }}>
                      <BookingCalendar 
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        quadraId={quadraId}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: '350px' }}>
                      {selectedDate ? (
                        <TimeSlots 
                          slots={timeSlots} 
                          onSlotSelect={setSelectedSlot}
                          selectedSlot={selectedSlot}
                          showGlow={selectedDate && !selectedSlot}
                        />
                      ) : (
                        <OptionSkeleton title="Horário:" />
                      )}
                    </Box>
                  </Grid>

                  {/* Segunda Linha */}
                  <Grid item xs={12} md={6}>
                    {selectedDate && selectedSlot ? (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Selecione um Esporte:
                        </Typography>
                        <SportsButtons
                          sports={court.esportes_permitidos || []}
                          selectedSport={selectedSport}
                          onSportSelect={setSelectedSport}
                          showGlow={selectedDate && selectedSlot && !selectedSport}
                        />
                      </>
                    ) : (
                      <OptionSkeleton title="Esporte:" />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    {selectedDate && selectedSlot && selectedSport ? (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Forma de Pagamento:
                        </Typography>
                        <PaymentButtons
                          selectedPayment={selectedPayment}
                          onPaymentSelect={setSelectedPayment}
                          showGlow={selectedDate && selectedSlot && selectedSport && !selectedPayment}
                        />
                      </>
                    ) : (
                      <OptionSkeleton title="Forma de Pagamento:" />
                    )}
                  </Grid>
                </Grid>

                {/* Botão de Confirmar */}
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleConfirmReservation}
                    disabled={!selectedDate || !selectedSlot || !selectedSport || !selectedPayment}
                    fullWidth
                    sx={{
                      position: { xs: 'fixed', md: 'static' },
                      bottom: { xs: 0, md: 'auto' },
                      left: { xs: 0, md: 'auto' },
                      right: { xs: 0, md: 'auto' },
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: { xs: 0, md: 1 },
                      zIndex: 1000,
                    }}
                  >
                    Confirmar Reserva
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default BookingPage;