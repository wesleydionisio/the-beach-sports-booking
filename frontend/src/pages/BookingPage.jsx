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
  Skeleton,
  Fade
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
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Pax`ra parsing de formato personalizado
import utc from 'dayjs/plugin/utc'; // Para manipulação de UTC
import BookingSummary from '../components/booking/BookingSummary';
import BookingModals from '../components/booking/BookingModals';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

// Estilo comum para os botões de confirmação
const confirmButtonStyles = {
  mt: 'auto',
  py: 2,
  fontSize: '1.1rem',
  borderRadius: { xs: 0, md: 1 },
  position: { xs: 'fixed', md: 'static' },
  bottom: { xs: 0, md: 'auto' },
  left: { xs: 0, md: 'auto' },
  right: { xs: 0, md: 'auto' },
  zIndex: 1000,
  backgroundColor: 'primary.main',
  color: 'white',
  '&:hover': {
    backgroundColor: 'primary.dark',
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(90deg, #393939 0%, #A9A9A9 100%) !important',
    color: 'white',
    opacity: 1,
    cursor: 'not-allowed',
  }
};

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
  const [bookingStep, setBookingStep] = useState(1);

  const horarioInicio = 8;
  const horarioFim = 22;
  const duracao = 1;

  // Função para gerar slots de horário


  const generateTimeSlots = (reservas, horariosNobres = []) => {
    console.log('Horários nobres recebidos:', horariosNobres);
    
    const slots = [];
    for (let hour = horarioInicio; hour < horarioFim; hour++) {
      const slotInicio = `${hour.toString().padStart(2, '0')}:00`;
      const slotFim = `${(hour + duracao).toString().padStart(2, '0')}:00`;
  
      const isReserved = reservas.some(
        (reserva) =>
          (reserva.inicio <= slotInicio && reserva.fim > slotInicio) ||
          (reserva.inicio < slotFim && reserva.fim >= slotFim)
      );
  
      const isNobre = horariosNobres.includes(slotInicio);
      console.log(`Slot ${slotInicio} é nobre? ${isNobre}`);
  
      slots.push({
        horario_inicio: slotInicio,
        horario_fim: slotFim,
        available: !isReserved,
        horario_nobre: isNobre
      });
    }
    
    console.log('Slots gerados:', slots);
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

      console.log('Resposta da API:', response.data);
      
      const reservas = response.data.horarios_agendados || [];
      const horariosNobres = response.data.horarios_nobres || [];
      
      console.log('Reservas:', reservas);
      console.log('Horários nobres:', horariosNobres);
      
      const slots = generateTimeSlots(reservas, horariosNobres);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      setError('Erro ao carregar horários disponíveis');
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
      console.log('⚠️ Usuário no autenticado, salvando dados...');
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
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          maxWidth: '100vw',
          overflow: 'hidden'
        }}
      >
        {/* Coluna Esquerda */}
        <Box
          sx={{
            width: { md: '40%' },
            position: 'relative',
            height: { xs: 'auto', md: 'auto' },
            backgroundColor: 'background.paper',
            py: { xs: '30px', md: 0 },
            pt: { xs: '96px', md: 0 },
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
              filter: 'grayscale(100%)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              }
            }}
          />

          {/* Conteúdo da coluna esquerda */}
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              px: { md: 8 },
              display: 'flex',  
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: { md: 'center' },
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
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(4px)',
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
        </Box>

        {/* Coluna Direita */}
        <Box
          sx={{
            width: { md: '60%' },
            display: 'flex',
            flexDirection: 'column',
            pt: { xs: 8, md: 0 },
            pb: { xs: 8, md: 6 },
            px: { xs: 2, md: '56px' },
            justifyContent: { md: 'center' },
            height: { xs: 'auto', md: 'auto' },
            boxSizing: 'border-box',
          }}
        >
          {/* Steps com Fade */}
          {bookingStep === 1 ? (
            <Fade in={bookingStep === 1} timeout={300}>
              <div>
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ mb: 0, fontWeight: 550 }}
                  >
                    Faça sua reserva
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ mt: 0 }}
                  >
                    Comece escolhendo uma data
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0
                }}>
                  {/* Container do Calendar e TimeSlots */}
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 0, md: 3 }
                  }}>
                    {/* Calendário */}
                    <Box 
                      sx={{ 
                        flex: { xs: '1 1 auto', md: '1 1 50%' },
                        backgroundColor: 'background.paper',
                        borderRadius: { xs: '4px 4px 0 0', md: 1 }, // Borda arredondada apenas em cima no mobile
                        padding: 2,
                        paddingBottom: { xs: 0, md: 2 }, // Remove padding bottom no mobile
                        height: { xs: 'auto', md: '343px' },
                        ...((!selectedDate) && glowEffect(theme)),
                      }}
                    >
                      <BookingCalendar 
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        quadraId={quadraId}
                      />
                    </Box>

                    {/* TimeSlots */}
                    <Box 
                      sx={{ 
                        flex: { xs: '1 1 auto', md: '1 1 50%' },
                        backgroundColor: 'background.paper',
                        borderRadius: { xs: '0 0 4px 4px', md: 1 }, // Borda arredondada apenas embaixo no mobile
                        padding: 2,
                        paddingTop: { xs: 0, md: 2 }, // Remove padding top no mobile
                        height: { xs: '380px', md: '343px' },
                      }}
                    >
                      {selectedDate ? (
                        <TimeSlots 
                          slots={timeSlots} 
                          onSlotSelect={setSelectedSlot}
                          selectedSlot={selectedSlot}
                        />
                      ) : (
                        <OptionSkeleton title="Horário:" />
                      )}
                    </Box>
                  </Box>

                  {/* Botão de Confirmação */}
                  <Box>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!selectedDate || !selectedSlot}
                      onClick={() => setBookingStep(2)}
                      sx={confirmButtonStyles}
                    >
                      <Box sx={{ 
                        width: '100%',
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        {selectedDate && selectedSlot ? (
                          <>
                            <Typography variant="body1">
                              {selectedSlot.horario_inicio}h • {dayjs(selectedDate).format('DD/MM/YYYY')}
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <Typography variant="body1">
                                R$ 120,00
                              </Typography>
                              <ArrowForwardIcon />
                            </Box>
                          </>
                        ) : (
                          <Typography variant="body1" sx={{ width: '100%', textAlign: 'center' }}>
                            Selecione uma data e horário
                          </Typography>
                        )}
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </div>
            </Fade>
          ) : (
            <Fade in={bookingStep === 2} timeout={300}>
              <div>
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ mb: 0, fontWeight: 550 }}
                  >
                    Faça sua reserva
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ mt: 0, mb: 0 }}
                  >
                    Escolha os detalhes
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0
                }}>
                  {/* Resumo */}
                  <BookingSummary 
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    court={court}
                    onEdit={() => setBookingStep(1)}
                  />
                  
                  {/* Opções Adicionais */}
                  <Box sx={{ mb: 0 }}>
                    <Typography variant="h6" sx={{ mb: 1, mt: 1, fontWeight: 550 }}>
                      Opções adicionais:
                    </Typography>
                    <BookingModals />
                  </Box>

                  {/* Seleção de Esporte e Pagamento */}
                  <Grid 
                    container 
                    spacing={3} 
                    sx={{ 
                      mt: 0,
                      height: 'auto', // Ajusta a altura para o conteúdo
                      '& .MuiGrid-item': {
                        paddingTop: 0 // Remove o padding superior dos itens do grid
                      }
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 0 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 550 }}>
                          Selecione um esporte:
                        </Typography>
                        <SportsButtons
                          sports={court?.esportes_permitidos || []}
                          selectedSport={selectedSport}
                          onSportSelect={setSelectedSport}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 0 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 550 }}>
                          Forma de pagamento:
                        </Typography>
                        <PaymentButtons
                          selectedPayment={selectedPayment}
                          onPaymentSelect={setSelectedPayment}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Botão de Confirmar Reserva */}
                  <Box>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!selectedSport || !selectedPayment}
                      onClick={handleConfirmReservation}
                      sx={confirmButtonStyles}
                    >
                      <Typography variant="body1">
                        {selectedSport && selectedPayment ? 'Confirmar reserva' : 'Selecione as opções'}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </div>
            </Fade>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BookingPage;