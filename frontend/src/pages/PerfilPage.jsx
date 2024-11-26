// src/pages/PerfilPage.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  TablePagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/apiService';
import { useSnackbar } from 'notistack';
import SportLabel from '../components/common/SportLabel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';

// Função para formatar o telefone para exibição
const formatPhone = (value) => {
  if (!value) return '';
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara no formato (XX) X XXXX-XXXX
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  }
  return numbers.slice(0, 11).replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
};

// Função para remover formatação do telefone
const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

const PerfilPage = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Estados
  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [reservations, setReservations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalReservations, setTotalReservations] = useState(0);
  const [currentTab, setCurrentTab] = useState(0); // 0 = Futuras, 1 = Passadas
  const [profileMetrics, setProfileMetrics] = useState({
    totalRealizados: 0,
    totalFuturos: 0,
    horasPraticadas: 0
  });

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) {
      console.log('🔒 Usuário não autenticado, redirecionando...');
      navigate('/login?redirect=/perfil');
      return;
    }
    
    // Inicializar dados do perfil
    if (user) {
      setProfileData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone ? formatPhone(user.telefone) : '',
      });
      fetchReservations();
    }
  }, [user, navigate]);

  // Função para separar as reservas
  const separateReservations = (reservations) => {
    const now = new Date();
    const futuras = [];
    const passadas = [];

    reservations.forEach(reserva => {
      const dataReserva = new Date(reserva.data);
      if (dataReserva >= now) {
        futuras.push(reserva);
      } else {
        passadas.push(reserva);
      }
    });

    return {
      futuras: futuras.sort((a, b) => new Date(a.data) - new Date(b.data)),
      passadas: passadas.sort((a, b) => new Date(b.data) - new Date(a.data))
    };
  };

  // Atualizar a função de buscar reservas
  const fetchReservations = async () => {
    try {
      setLoading(true);
      console.log('📚 Buscando reservas do usuário...', {
        page: page + 1,
        limit: rowsPerPage,
        tipo: currentTab === 0 ? 'futuras' : 'passadas'
      });
      
      const response = await axios.get('/bookings/minhas-reservas', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          tipo: currentTab === 0 ? 'futuras' : 'passadas'
        }
      });
      
      if (response.data.success) {
        console.log('✅ Reservas carregadas:', response.data);
        setReservations(response.data.reservas);
        setTotalReservations(response.data.total);
        
        // Buscar todas as reservas para calcular métricas (temporário até atualização do backend)
        const allReservasResponse = await axios.get('/bookings/minhas-reservas', {
          params: {
            page: 1,
            limit: 1000, // Buscar todas
            tipo: 'todas'
          }
        });

        if (allReservasResponse.data.success) {
          const todasReservas = allReservasResponse.data.reservas;
          const agora = new Date();

          // Calcular métricas localmente
          const metricas = {
            totalRealizados: todasReservas.filter(r => r.status !== 'cancelada').length,
            totalFuturos: todasReservas.filter(r => {
              const dataReserva = new Date(r.data);
              const [hora, minuto] = r.horario_inicio.split(':').map(Number);
              dataReserva.setHours(hora, minuto, 0);
              return dataReserva > agora && r.status !== 'cancelada';
            }).length,
            horasPraticadas: todasReservas.filter(r => {
              const dataReserva = new Date(r.data);
              const [hora, minuto] = r.horario_inicio.split(':').map(Number);
              dataReserva.setHours(hora, minuto, 0);
              return dataReserva <= agora && r.status !== 'cancelada';
            }).length
          };

          setProfileMetrics(metricas);
        }
      } else {
        enqueueSnackbar('Não foi possível carregar suas reservas.', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar reservas:', error);
      enqueueSnackbar('Erro ao buscar reservas.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar quando mudar a página, quantidade por página ou tab
  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [page, rowsPerPage, currentTab]);

  // Funções para controle de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Atualizar perfil
  const handleSave = async () => {
    try {
      console.log('💾 Salvando alterações do perfil...');
      
      // Remover formatação do telefone antes de enviar
      const dataToSend = {
        ...profileData,
        telefone: cleanPhoneNumber(profileData.telefone)
      };
      
      console.log('📱 Telefone limpo para envio:', dataToSend.telefone);
      
      const response = await axios.put('/auth/profile', dataToSend);
      
      if (response.data.success) {
        console.log('✅ Perfil atualizado com sucesso');
        enqueueSnackbar('Perfil atualizado com sucesso.', { variant: 'success' });
        setEditing(false);
        
        // Atualizar o usuário com o telefone formatado
        const updatedUser = {
          ...response.data.user,
          telefone: formatPhone(response.data.user.telefone)
        };
        setUser(updatedUser);
      } else {
        enqueueSnackbar('Não foi possível atualizar o perfil.', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  // Função para lidar com mudanças nos campos do perfil
  const handleChangeProfile = (event) => {
    const { name, value } = event.target;
    
    if (name === 'telefone') {
      const formattedValue = formatPhone(value);
      setProfileData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      console.log('👋 Iniciando processo de logout...');
      await logout(); // Usando a função logout do AuthContext
      
      // Limpar dados locais
      setProfileData({
        nome: '',
        email: '',
        telefone: ''
      });
      setReservations([]);
      
      // Redirecionar para a página inicial
      navigate('/');
      enqueueSnackbar('Logout realizado com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      enqueueSnackbar('Erro ao fazer logout. Tente novamente.', { variant: 'error' });
    }
  };

  // Função para cancelar uma reserva
  const handleCancelBooking = async (bookingId) => {
    try {
      console.log('🚫 Iniciando cancelamento da reserva:', bookingId);
      
      const response = await axios.post(`/bookings/${bookingId}/cancel`);
      
      if (response.data.success) {
        console.log('✅ Reserva cancelada com sucesso');
        enqueueSnackbar('Reserva cancelada com sucesso!', { variant: 'success' });
        
        // Atualizar lista de reservas
        fetchReservations();
      } else {
        throw new Error(response.data.message || 'Erro ao cancelar reserva');
      }
    } catch (error) {
      console.error('❌ Erro ao cancelar reserva:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Erro ao cancelar reserva. Tente novamente.',
        { variant: 'error' }
      );
    }
  };

  // Adicionar confirmação antes de cancelar
  const handleCancelClick = (bookingId) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      handleCancelBooking(bookingId);
    }
  };

  // Componente do Card de Reserva
  const ReservationCard = ({ reserva }) => {
    const navigate = useNavigate();
    
    // Função para calcular o tempo restante
    const getTimeStatus = () => {
      const agora = new Date();
      const dataReserva = new Date(reserva.data);
      const horaInicio = reserva.horario_inicio.split(':').map(Number);
      const horaFim = reserva.horario_fim.split(':').map(Number);
      
      // Definir data/hora início e fim da reserva
      const dataHoraInicio = new Date(dataReserva.setHours(horaInicio[0], horaInicio[1], 0));
      const dataHoraFim = new Date(dataReserva.setHours(horaFim[0], horaFim[1], 0));

      // Se foi cancelada, retorna null
      if (reserva.status === 'cancelada') return null;

      // Se está ocorrendo agora
      if (agora >= dataHoraInicio && agora <= dataHoraFim) {
        return {
          texto: 'Ocorrendo',
          cor: '#4CAF50' // verde
        };
      }

      // Se já passou
      if (agora > dataHoraFim) {
        return {
          texto: 'Já ocorreu',
          cor: '#9e9e9e' // cinza
        };
      }

      // Calcular tempo restante
      const diffMs = dataHoraInicio - agora;
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHoras = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      let texto = '';
      if (diffDias > 0) {
        texto = `Faltam ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
      } else if (diffHoras > 0) {
        texto = `Faltam ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
      } else {
        const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        texto = `Faltam ${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`;
      }

      return {
        texto,
        cor: 'white' // white
      };
    };

    const timeStatus = getTimeStatus();
    
    return (
      <Card sx={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            height: '200px',
            position: 'relative',
            backgroundImage: `url(${reserva.quadra_id?.foto_principal || 'https://via.placeholder.com/150'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              padding: 2,
              textAlign: 'center',
            }}
          >
            {timeStatus && (
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 1,
                  color: timeStatus.cor,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontWeight: 'bold'
                }}
              >
                {timeStatus.texto}
              </Typography>
            )}
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              {reserva.quadra_id?.nome || 'Nome da Quadra'}
            </Typography>
            <SportLabel 
              label={reserva.esporte?.nome || 'Esporte'} 
              sportData={reserva.esporte}
            />
          </Box>
        </Box>

        {/* Parte Inferior: Informações da Reserva */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#fff',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Data:</strong> {new Date(reserva.data).toLocaleDateString('pt-BR')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Hora:</strong> {reserva.horario_inicio} - {reserva.horario_fim}
            </Typography>
            <Typography variant="body2">
              <strong>Total:</strong> R$ {(reserva.valor || 0).toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 1,
            borderTop: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
            <StatusLabel status={reserva.status} />
            {reserva.status !== 'cancelada' && currentTab === 0 && (
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleCancelClick(reserva._id)}
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/reserva/${reserva._id}`)}
                >
                  Ver Reserva
                </Button>
              </Box>
            )}
            {(currentTab === 1 || reserva.status === 'cancelada') && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate(`/reserva/${reserva._id}`)}
              >
                Ver Reserva
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    );
  };

  // Atualizar a seção de renderização das reservas
  const renderReservations = () => {
    if (loading) {
      return (
        <Grid container spacing={2}>
          {[1, 2, 3].map((skeleton) => (
            <Grid item xs={12} sm={6} md={4} key={skeleton}>
              <Skeleton variant="rectangular" height={380} />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (reservations.length === 0) {
      return (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            backgroundColor: 'background.paper',
            borderRadius: 1
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {currentTab === 0 
              ? 'Você não possui reservas futuras.' 
              : 'Você não possui reservas passadas.'}
          </Typography>
          {currentTab === 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/quadras')}
              sx={{ mt: 2 }}
            >
              Fazer uma Reserva
            </Button>
          )}
        </Box>
      );
    }

    return (
      <>
        <Grid container spacing={2}>
          {reservations.map(reserva => (
            <Grid item xs={12} sm={6} md={4} key={reserva._id}>
              <ReservationCard reserva={reserva} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TablePagination
            component="div"
            count={totalReservations}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 12, 24]}
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        </Box>
      </>
    );
  };

  // Componente para exibir o label de status
  const StatusLabel = ({ status }) => {
    let color;
    let label;

    switch (status.toLowerCase()) {
      case 'confirmada':
        color = 'success';
        label = 'Confirmada';
        break;
      case 'pendente':
        color = 'warning';
        label = 'Pendente';
        break;
      case 'cancelada':
        color = 'error';
        label = 'Cancelada';
        break;
      default:
        color = 'default';
        label = status;
    }

    return <Chip label={label} color={color} size="small" />;
  };

  // Função para gerar iniciais do nome
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Função para calcular as métricas do perfil
  const calculateProfileMetrics = async () => {
    try {
      const response = await axios.get('/bookings/minhas-reservas', {
        params: {
          limit: 1000, // Buscar todas as reservas para cálculo correto
          tipo: 'todas'  // Novo parâmetro para buscar todas as reservas
        }
      });

      if (response.data.success) {
        const todasReservas = response.data.reservas;
        const agora = new Date();

        // Total de reservas (excluindo canceladas)
        const totalRealizados = todasReservas.filter(r => r.status !== 'cancelada').length;

        // Reservas futuras (não canceladas e data futura)
        const totalFuturos = todasReservas.filter(r => {
          const dataReserva = new Date(r.data);
          const horaInicio = r.horario_inicio.split(':').map(Number);
          const dataHoraInicio = new Date(dataReserva.setHours(horaInicio[0], horaInicio[1], 0));
          return dataHoraInicio > agora && r.status !== 'cancelada';
        }).length;

        // Horas praticadas (apenas reservas passadas e não canceladas)
        const horasPraticadas = todasReservas.reduce((acc, r) => {
          const dataReserva = new Date(r.data);
          const horaInicio = r.horario_inicio.split(':').map(Number);
          const dataHoraInicio = new Date(dataReserva.setHours(horaInicio[0], horaInicio[1], 0));
          
          // Só conta se já passou e não foi cancelada
          if (dataHoraInicio <= agora && r.status !== 'cancelada') {
            return acc + 1; // Cada reserva = 1 hora
          }
          return acc;
        }, 0);

        setProfileMetrics({
          totalRealizados,
          totalFuturos,
          horasPraticadas
        });
      }
    } catch (error) {
      console.error('Erro ao calcular métricas do perfil:', error);
    }
  };

  // Chamar o cálculo das métricas quando o componente montar
  useEffect(() => {
    if (user) {
      calculateProfileMetrics();
    }
  }, [user]);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: { xs: 10, sm: 12 },
        pb: 4,
        px: { xs: 2, sm: 3 } 
      }}
    >
      <Paper sx={{ p: 4, position: 'relative' }}>
        {/* Card de Perfil com Background */}
        <Box
          sx={{
            background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
            color: 'primary.contrastText',
            p: 4,
            mb: 6,
            mt: '42px',
            borderRadius: 2,
            boxShadow: 3,
            position: 'relative',
            overflow: 'visible'
          }}
        >
          {/* Avatar e Info */}
          <Box sx={{ 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'background.paper',
                color: 'primary.main',
                fontSize: '2.5rem',
                mb: 2,
                border: '4px solid',
                borderColor: 'background.paper',
                boxShadow: 2,
                position: 'absolute',
                top: -102,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              {user?.nome?.charAt(0).toUpperCase()}
            </Avatar>

            {/* Botão Editar */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setEditing(true)}
              startIcon={<EditIcon />}
              size="small"
              sx={{
                position: 'absolute',
                top: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'background.paper',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'background.paper',
                  opacity: 0.9
                }
              }}
            >
              Editar Perfil
            </Button>

            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1, 
                textAlign: 'center', 
                fontWeight: 'bold',
                mt: 8 
              }}
            >
              {user?.nome}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 4, 
                textAlign: 'center', 
                opacity: 0.9 
              }}
            >
              {user?.email}
            </Typography>

            {/* Stats Cards */}
            <Box 
              sx={{ 
                display: 'flex',
                width: '100%',
                maxWidth: { xs: '100%', sm: 600 },
                mx: 'auto',
                justifyContent: 'center',
                '& > *': {
                  borderRight: '1px solid rgba(255, 255, 255, 0.12)', // Separador sutil
                  '&:last-child': {
                    borderRight: 'none'
                  }
                }
              }}
            >
              {/* Card Métricas */}
              {[
                { label: 'Agendamentos\nRealizados', value: profileMetrics.totalRealizados },
                { label: 'Agendamentos\nFuturos', value: profileMetrics.totalFuturos },
                { label: 'Horas\nPraticadas', value: profileMetrics.horasPraticadas }
              ].map((metric, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    flex: 1,
                    p: { xs: 1.5, sm: 2 },
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: { xs: '33.33%', sm: '110px' }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'common.white', // Texto branco
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      lineHeight: 1
                    }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography 
                    variant="caption"
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      lineHeight: 1.2,
                      mt: 0.5,
                      whiteSpace: 'pre-line',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.7)' // Texto branco com transparência
                    }}
                  >
                    {metric.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Formulário de Edição */}
        {editing && (
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={profileData.nome}
                  onChange={handleChangeProfile}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChangeProfile}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={profileData.telefone}
                  onChange={handleChangeProfile}
                />
              </Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Salvar
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </Box>
          </Box>
        )}

        {/* Seção de Reservas */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Minhas Reservas
          </Typography>

          <Tabs
            value={currentTab}
            onChange={(e, newValue) => {
              setCurrentTab(newValue);
              setPage(0); // Resetar página ao mudar de tab
            }}
            sx={{ mb: 3 }}
          >
            <Tab label="Reservas Futuras" />
            <Tab label="Reservas Passadas" />
          </Tabs>

          {renderReservations()}
        </Box>

        {/* Botão de Logout */}
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Sair da Conta
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PerfilPage;