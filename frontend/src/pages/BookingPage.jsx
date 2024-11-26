import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress,
  Grid,
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookingModals from '../components/booking/BookingModals';
import SportLabel from '../components/common/SportLabel';
import { format } from 'date-fns'; // Adicionar esta importação
import { ptBR } from 'date-fns/locale';
import DateService from '../utils/dateService';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RecurrenceModal from '../components/RecurrenceModal';

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
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const { quadraId } = useParams();
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
  const [bookingData, setBookingData] = useState({
    is_recorrente: false,
    recorrencia: null,
    observacao: '',
    valor_total: 0
  });
  const [bookingResult, setBookingResult] = useState({
    success: false,
    message: '',
    details: '',
    reservationId: null
  });
  const [businessConfig, setBusinessConfig] = useState(null);
  const [state, setState] = useState({
    loading: true,
    error: null,
    recorrencia: null,
    slots: []
  });
  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [slots, setSlots] = useState([]); // Adicionar este estado
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [recurrenceModalOpen, setRecurrenceModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedRecurrence, setSelectedRecurrence] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingStep2, setLoadingStep2] = useState(false);

  const horarioInicio = 8;
  const horarioFim = 22;
  const duracao = 1;

  // Função para gerar slots com valores
  const generateTimeSlots = (reservas = [], config) => {
    if (!config) return [];
    
    console.log('1. Gerando slots com:', {
      totalReservas: reservas.length,
      horariosNobres: config.horarios_nobres,
      reservas: reservas.map(r => ({
        data: r.data,
        horario: r.horario_inicio,
        status: r.status
      }))
    });

    const slots = [];
    const horarioInicio = parseInt(config.horario_abertura.split(':')[0]);
    const horarioFim = parseInt(config.horario_fechamento.split(':')[0]);
    
    const dataAtual = dayjs().format('YYYY-MM-DD');
    const dataSelecionada = selectedDate.format('YYYY-MM-DD');

    for (let hora = horarioInicio; hora < horarioFim; hora++) {
      const horaInicio = `${String(hora).padStart(2, '0')}:00`;
      const horaFim = `${String(hora + 1).padStart(2, '0')}:00`;
      
      // Verificar reservas existentes
      const isReservado = reservas.some(reserva => 
        reserva.data === dataSelecionada && 
        reserva.horario_inicio === horaInicio && 
        reserva.status !== 'cancelada'
      );

      const slotDateTime = dayjs(`${dataSelecionada} ${horaInicio}`);
      const isHorarioNobre = config.horarios_nobres?.includes(horaInicio);
      const isHorarioPassado = dataSelecionada === dataAtual && 
        slotDateTime.isBefore(dayjs());

      console.log('2. Verificando horário:', {
        horario: horaInicio,
        isHorarioNobre,
        horariosNobres: config.horarios_nobres
      });

      slots.push({
        horario_inicio: horaInicio,
        horario_fim: horaFim,
        disponivel: !isReservado && !isHorarioPassado,
        is_horario_nobre: isHorarioNobre,
        valor: isHorarioNobre ? config.valor_hora_nobre : config.valor_hora_padrao,
        motivo_bloqueio: isReservado ? 'reservado' : 
                         isHorarioPassado ? 'horario_passado' : null
      });
    }

    return slots;
  };

  // Atualizar o useEffect que busca os slots
  useEffect(() => {
    const fetchTimeSlots = async (selectedDate) => {
      try {
        setLoadingSlots(true);
        const formattedDate = selectedDate.format('YYYY-MM-DD');
        
        console.log('1. Buscando slots para data:', formattedDate);

        const [reservasResponse, configResponse] = await Promise.all([
          axios.get('/bookings/check', {
            params: {
              quadra_id: quadraId,
              data: formattedDate
            }
          }),
          axios.get('/business-config')
        ]);

        const config = configResponse.data;
        setBusinessConfig(config);

        const slotsGerados = generateTimeSlots(
          reservasResponse.data.reservas || [], 
          config
        );

        setTimeSlots(slotsGerados);
      } catch (error) {
        console.error('Erro ao buscar slots:', error);
        enqueueSnackbar('Erro ao carregar horários disponíveis', { variant: 'error' });
      } finally {
        // Adicionar um pequeno delay para melhor UX
        setTimeout(() => {
          setLoadingSlots(false);
        }, 800);
      }
    };

    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate, quadraId]);

  // Atualizar handleSlotSelect
  const handleSlotSelect = (slot) => {
    console.log('Slot selecionado:', {
      slot,
      selectedSport,
      selectedDate
    });

    setSelectedSlot({
      ...slot,
      data: selectedDate,
      esporte: selectedSport?._id // Garantir que o ID do esporte está sendo incluído
    });
  };

  // Atualizar o estado quando um método de pagamento é selecionado
  const handlePaymentSelect = (payment) => {
    console.log('Método de pagamento selecionado:', payment);
    
    // Atualizar ambos os estados
    setSelectedPayment(payment);
    setSelectedPaymentMethod({
      _id: payment,
      // outros campos necessários
    });
  };

  // Atualizar handleConfirmReservation para salvar todos os dados necessários
  const handleConfirmReservation = async () => {
    try {
      // Verificar se o usuário está logado
      if (!user) {
        // Salvar dados da reserva atual no localStorage
        localStorage.setItem('pendingBooking', JSON.stringify({
          quadraId,
          selectedDate: selectedDate?.format('YYYY-MM-DD'),
          selectedSport: selectedSport?._id,
          selectedTimeSlot: selectedTimeSlot,
          selectedPaymentMethod: selectedPaymentMethod?._id
        }));

        // Redirecionar para o login com o parâmetro de redirecionamento
        navigate(`/login?redirect=/booking/${quadraId}`);
        return;
      }

      console.log('DEBUG - Estado completo antes da confirmação:', {
        selectedTimeSlot,
        selectedSlot,
        selectedCourt,
        selectedDate: selectedDate?.format('YYYY-MM-DD'),
        selectedSport,
        selectedPayment,
        horarios: {
          inicio: selectedTimeSlot?.horario_inicio || selectedSlot?.horario_inicio,
          fim: selectedTimeSlot?.horario_fim || selectedSlot?.horario_fim
        }
      });

      // Validações
      if (!selectedTimeSlot && !selectedSlot) {
        console.error('Nenhum horário selecionado');
        alert('Por favor, selecione um horário');
        return;
      }

      const slotToUse = selectedTimeSlot || selectedSlot;

      if (!selectedCourt?._id) {
        alert('Por favor, selecione uma quadra');
        return;
      }

      if (!selectedDate) {
        alert('Por favor, selecione uma data');
        return;
      }

      if (!slotToUse?.horario_inicio || !slotToUse?.horario_fim) {
        alert('Por favor, selecione um horário válido');
        return;
      }

      if (!selectedSport) {
        alert('Por favor, selecione um esporte');
        return;
      }

      if (!selectedPaymentMethod?._id) {
        alert('Por favor, selecione um método de pagamento');
        return;
      }

      if (selectedRecurrence) {
        // Se houver recorrência selecionada, usar a rota de recorrência
        const recurrenceData = {
          quadraId: selectedCourt._id,
          esporte: selectedSport._id,
          horarioInicio: slotToUse.horario_inicio,
          horarioFim: slotToUse.horario_fim,
          datasConfirmadas: selectedRecurrence.dates,
          valor: slotToUse.valor,
          metodo_pagamento: selectedPaymentMethod._id
        };

        const response = await axios.post('/bookings/recorrencia/confirmar', recurrenceData);
        
        if (response.data?.success) {
          navigate(`/reserva/${response.data.agendamentos[0]._id}`);
        }
      } else {
        // Se não houver recorrência, usar a rota normal de reserva
        const bookingData = {
          quadra_id: selectedCourt._id,
          data: selectedDate.format('YYYY-MM-DD'),
          horario_inicio: slotToUse.horario_inicio,
          horario_fim: slotToUse.horario_fim,
          esporte: selectedSport._id,
          metodo_pagamento: selectedPaymentMethod._id,
          total: slotToUse.valor || 0
        };

        const response = await axios.post('/bookings', bookingData);
        
        if (response.data?.success) {
          navigate(`/reserva/${response.data.booking._id}`);
        }
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      enqueueSnackbar('Erro ao criar reserva. Por favor, tente novamente.', { 
        variant: 'error' 
      });
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

  // Buscar configurações de negócio
  useEffect(() => {
    const fetchBusinessConfig = async () => {
      try {
        const response = await axios.get('/business-config');
        setBusinessConfig(response.data);
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };
    fetchBusinessConfig();
  }, []);

  // Função para calcular o valor da reserva
  const calcularValorReserva = (horario) => {
    if (!businessConfig || !horario) return null;

    // Verificar se é horário nobre
    const isHorarioNobre = horario.is_horario_nobre;
    
    // Calcular valor base
    const valorBase = isHorarioNobre 
      ? businessConfig.valor_hora_nobre 
      : businessConfig.valor_hora_padrao;

    return valorBase;
  };

  const handleTimeSlotSelect = (slot) => {
    console.log('Horário selecionado:', slot);
    setSelectedTimeSlot(slot);
    setSelectedSlot(prev => ({
      ...prev,
      horario_inicio: slot.horario_inicio,
      horario_fim: slot.horario_fim,
      valor: slot.valor,
      is_horario_nobre: slot.is_horario_nobre
    }));
  };

  const calculateTotal = () => {
    if (!selectedTimeSlot) return 0;
    
    const horaInicio = parseInt(selectedTimeSlot.horario_inicio.split(':')[0]);
    const horaFim = parseInt(selectedTimeSlot.horario_fim.split(':')[0]);
    const duracaoHoras = horaFim - horaInicio;
    
    // Verificar se é horário nobre (18h às 22h)
    const isHorarioNobre = horaInicio >= 18 && horaInicio < 22;
    const valorHora = isHorarioNobre ? 150 : 120; // Valores padrão ou buscar da configuração
    
    return valorHora * duracaoHoras;
  };

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const response = await axios.get(`/courts/${quadraId}`);
        setSelectedCourt(response.data);
        setCourt(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados da quadra:', error);
        enqueueSnackbar('Erro ao carregar dados da quadra', { variant: 'error' });
      }
    };

    if (quadraId) {
      fetchCourt();
    }
  }, [quadraId]);

  // Adicionar um useEffect para atualizar o selectedSlot quando o esporte for selecionado
  useEffect(() => {
    if (selectedTimeSlot && selectedSport) {
      setSelectedSlot(prev => ({
        ...prev,
        ...selectedTimeSlot,
        esporte: selectedSport._id,
        esporteObj: selectedSport
      }));
    }
  }, [selectedSport, selectedTimeSlot]);

  // Adicionar este useEffect
  useEffect(() => {
    if (selectedTimeSlot) {
      setSelectedSlot(prev => ({
        ...prev,
        horario_inicio: selectedTimeSlot.horario_inicio,
        horario_fim: selectedTimeSlot.horario_fim,
        valor: selectedTimeSlot.valor
      }));
    }
  }, [selectedTimeSlot]);

  // Primeiro, adicione um log para debug
  useEffect(() => {

  }, [selectedSport, selectedTimeSlot]);

  // Primeiro, adicione um log para debug dos estados
  useEffect(() => {

  }, [selectedSport, selectedTimeSlot, selectedSlot]);

  // Modifique a função que muda o step
  const handleStepChange = (newStep) => {
    if (newStep === 2) {
      setLoadingStep2(true);
      setBookingStep(2);
      // Simular um pequeno delay para mostrar o loading
      setTimeout(() => {
        setLoadingStep2(false);
      }, 800);
    } else {
      setBookingStep(newStep);
    }
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
                  <SportLabel
                    key={esporte._id}
                    label={esporte.nome}
                    sportData={esporte}
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
                        loading={loadingStep2}
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
                          onSlotSelect={handleSlotSelect}
                          selectedSlot={selectedSlot}
                          loading={loadingSlots}
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
                      onClick={() => handleStepChange(2)}
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
                              {selectedSlot.horario_inicio}h  {dayjs(selectedDate).format('DD/MM/YYYY')}
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
                    onEdit={() => handleStepChange(1)}
                    loading={loadingStep2}
                    recorrencia={selectedRecurrence}
                  />
                  
                  {/* Seleão de Esporte e Pagamento */}
                  <Grid 
                    container 
                    spacing={{ xs: 2, md: 3 }}
                    sx={{ 
                      mt: 0,
                      mb: 0,
                      '& .MuiGrid-item': {
                        paddingTop: { xs: '16px', md: '24px' },
                        display: 'flex',
                        flexDirection: 'column'
                      }
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Box sx={{ height: '100%', pb: { xs: 0, md: 2 } }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 550 }}>
                          Selecione um esporte:
                        </Typography>
                        <SportsButtons
                          sports={court?.esportes_permitidos || []}
                          selectedSport={selectedSport}
                          onSportSelect={setSelectedSport}
                          loading={loadingStep2}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ height: '100%', pb: { xs: 0, md: 2 } }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 550 }}>
                          Forma de pagamento:
                        </Typography>
                        <PaymentButtons
                          selectedPayment={selectedPayment}
                          onPaymentSelect={handlePaymentSelect}
                          loading={loadingStep2}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Container do botão de recorrência */}
                  <Box sx={{ 
                    mt: { xs: 0, md: 0 },
                    pt: { xs: 0, md: 2 },
                    pb: { xs: 0, md: 2 }
                  }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 550 }}>
                      Opções adicionais:
                    </Typography>
                    
                    {loadingStep2 ? (
                      <Skeleton 
                        variant="rounded" 
                        width={250}
                        height={40}
                        animation="wave"
                        sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)' }}
                      />
                    ) : (
                      <Button
                        variant={selectedRecurrence ? "contained" : "outlined"}
                        onClick={() => setRecurrenceModalOpen(true)}
                        startIcon={<AccessTimeIcon />}
                        disabled={!selectedSport}
                        sx={{
                          height: 40,
                          textTransform: 'none',
                          fontSize: '1rem',
                          width: 'fit-content',
                          ...(selectedRecurrence && {
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            }
                          })
                        }}
                      >
                        {selectedRecurrence 
                          ? `Horário Fixo - ${selectedRecurrence.tipo} ${selectedRecurrence.tipo === 1 ? 'mês' : 'meses'}`
                          : 'Agendar Horário Fixo'
                        }
                      </Button>
                    )}

                    <RecurrenceModal
                      open={recurrenceModalOpen}
                      onClose={() => setRecurrenceModalOpen(false)} 
                      selectedSlot={{
                        data: selectedDate,
                        esporte: selectedSport?._id,
                        horario_inicio: selectedTimeSlot?.horario_inicio || selectedSlot?.horario_inicio,
                        horario_fim: selectedTimeSlot?.horario_fim || selectedSlot?.horario_fim,
                        valor: selectedTimeSlot?.valor || selectedSlot?.valor || 0,
                        disponivel: true,
                        is_horario_nobre: selectedTimeSlot?.is_horario_nobre || false
                      }}
                      quadraId={quadraId}
                      disabled={!selectedTimeSlot || !selectedSport}
                      selectedPayment={selectedPaymentMethod?._id}
                      onConfirm={(recurrenceData) => {
                        console.log('Opção de recorrência selecionada:', recurrenceData);
                        setSelectedRecurrence(recurrenceData);
                        setRecurrenceModalOpen(false);
                      }}
                    />
                  </Box>

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