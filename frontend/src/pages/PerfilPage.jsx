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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/apiService';
import { useSnackbar } from 'notistack';

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
        telefone: user.telefone || '',
      });
      fetchReservations();
    }
  }, [user, navigate]);

  // Buscar reservas do usuário
  const fetchReservations = async () => {
    try {
      setLoading(true);
      console.log('📚 Buscando reservas do usuário...');
      
      const response = await axios.get('/bookings/minhas-reservas');
      
      if (response.data.success) {
        console.log('✅ Reservas carregadas:', response.data.reservas.length);
        setReservations(response.data.reservas);
      } else {
        enqueueSnackbar('Não foi possível carregar suas reservas.', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar reservas:', error);
      enqueueSnackbar('Erro ao buscar reservas. Tente novamente.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil
  const handleSave = async () => {
    try {
      console.log('💾 Salvando alterações do perfil...');
      
      const response = await axios.put('/auth/profile', profileData);
      
      if (response.data.success) {
        console.log('✅ Perfil atualizado com sucesso');
        enqueueSnackbar('Perfil atualizado com sucesso.', { variant: 'success' });
        setEditing(false);
        setUser(response.data.user);
      } else {
        enqueueSnackbar('Não foi possível atualizar o perfil.', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      enqueueSnackbar('Erro ao atualizar perfil. Tente novamente.', { variant: 'error' });
    }
  };

  // Função para lidar com mudanças nos campos do perfil
  const handleChangeProfile = (event) => {
    const { name, value } = event.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Renderizar cards de reservas
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
            Você ainda não possui reservas.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/quadras')}
            sx={{ mt: 2 }}
          >
            Fazer uma Reserva
          </Button>
        </Box>
      );
    }

    // Ordenar as reservas com base no sortOrder
    const sortedReservations = [...reservations].sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return (
      <>
        {/* Controle de Ordenação */}
        <Box mb={2} display="flex" justifyContent="flex-end">
          <FormControl variant="outlined" size="small">
            <InputLabel id="sort-order-label">Ordenar Por</InputLabel>
            <Select
              labelId="sort-order-label"
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Ordenar Por"
            >
              <MenuItem value="desc">Mais Recentes</MenuItem>
              <MenuItem value="asc">Mais Antigas</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          {sortedReservations.map(reserva => (
            <Grid item xs={12} sm={6} md={4} key={reserva._id}>
  <Card sx={{ height: '380px' }}> {/* Aumentei a altura total do card */}
    {/* Parte Superior: Imagem com Overlay */}
    <Box
      sx={{
        height: '200px', // Altura fixa para a imagem
        position: 'relative',
        backgroundImage: `url(${reserva.quadra_id?.foto_principal || 'https://via.placeholder.com/150'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay contido dentro da área da imagem */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0, // Garante que o overlay termine onde a imagem termina
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
        <Typography variant="h6" component="div">
          {reserva.quadra_id?.nome || 'Nome da Quadra'}
        </Typography>
        <Typography variant="body2">
          {reserva.esporte?.nome || 'Esporte'}
        </Typography>
      </Box>
    </Box>

    {/* Parte Inferior: Informações da Reserva */}
    <Box
      sx={{
        flex: 1, // Permite que a área de informações ocupe o espaço restante
        backgroundColor: '#fff',
        padding: 2,
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
        <Typography variant="body2" sx={{ mb: 2 }}> {/* Adicionei margem embaixo */}
          <strong>Total:</strong> R$ {reserva.total !== undefined ? reserva.total.toFixed(2) : '0.00'}
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 'auto' // Empurra os botões para baixo
      }}>
        <StatusLabel status={reserva.status} />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => navigate(`/reserva/${reserva._id}`)}
        >
          Ver Reserva
        </Button>
      </Box>
    </Box>
  </Card>
</Grid>
          ))}
        </Grid>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Meu Perfil
        </Typography>

        {/* Formulário de Perfil */}
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={3}>
            {/* Nome */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={profileData.nome}
                onChange={handleChangeProfile}
                InputProps={{
                  readOnly: !editing,
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChangeProfile}
                InputProps={{
                  readOnly: !editing,
                }}
              />
            </Grid>

            {/* Telefone */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={profileData.telefone}
                onChange={handleChangeProfile}
                InputProps={{
                  readOnly: !editing,
                }}
              />
            </Grid>
          </Grid>

          {/* Botões de Ação */}
          <Box mt={3} display="flex" gap={2}>
            {editing ? (
              <>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Salvar
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setEditing(true)}>
                Editar Perfil
              </Button>
            )}
          </Box>
        </Box>

        {/* Seção de Reservas */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Minhas Reservas
          </Typography>
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

export default PerfilPage;