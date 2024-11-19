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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/apiService';
import { useSnackbar } from 'notistack';

const PerfilPage = () => {
  const { user, setUser, login, register, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Verificar autenticação e redirecionar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) {
      console.log('Usuário não autenticado, redirecionando para login...');
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    telefone: '',
    // Adicione outros campos conforme necessário
  });

  const [reservations, setReservations] = useState([]);

  const [editing, setEditing] = useState(false);

  // Estados para o formulário de login/cadastro
  const [activeTab, setActiveTab] = useState(0); // 0: Login, 1: Cadastro
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    password: '',
    telefone: '',
    // Adicione outros campos conforme necessário
  });

  // Estado para controle de ordenação
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' para mais recente, 'asc' para mais antiga

  useEffect(() => {
    if (user) {
      setProfileData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        // Preencha outros campos conforme necessário
      });
      fetchReservations();
    }
    // eslint-disable-next-line
  }, [user]);

  // Função para buscar as reservas do usuário
  const fetchReservations = async () => {
    try {
      const response = await axios.get('/bookings/user'); // Certifique-se de que a URL está correta
      console.log('Reservas recebidas:', response.data.reservas); // Adicionado para depuração
      if (response.data.success) {
        setReservations(response.data.reservas);
      } else {
        enqueueSnackbar('Não foi possível carregar suas reservas.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      enqueueSnackbar('Erro ao buscar reservas. Tente novamente.', { variant: 'error' });
    }
  };

  // Função para lidar com a edição dos campos do perfil
  const handleChangeProfile = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Função para salvar as alterações do perfil
  const handleSave = async () => {
    try {
      const response = await axios.put('/auth/profile', profileData); // Corrigir a rota para /auth/profile
      if (response.data.success) {
        enqueueSnackbar('Perfil atualizado com sucesso.', { variant: 'success' });
        setEditing(false);
        // Atualizar o usuário no contexto
        setUser(response.data.user);
      } else {
        enqueueSnackbar('Não foi possível atualizar o perfil.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      enqueueSnackbar('Erro ao atualizar perfil. Tente novamente.', { variant: 'error' });
    }
  };

  // Função para lidar com logout
  const handleLogout = () => {
    // Chamar a função de logout do contexto
    logout();
    navigate('/'); // Redirecionar para a página inicial
  };

  // Funções para lidar com o formulário de login
  const handleChangeLogin = (e) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    const result = await login(email, password);
    if (result.success) {
      enqueueSnackbar('Login realizado com sucesso.', { variant: 'success' });
      navigate('/perfil'); // Redirecionar para a página de perfil
    } else {
      enqueueSnackbar(result.message || 'Erro no login.', { variant: 'error' });
    }
  };

  // Funções para lidar com o formulário de cadastro
  const handleChangeRegister = (e) => {
    setRegisterData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { nome, email, password, telefone } = registerData;
    const result = await register({ nome, email, password, telefone });
    if (result.success) {
      enqueueSnackbar('Cadastro realizado com sucesso.', { variant: 'success' });
      navigate('/perfil'); // Redirecionar para a página de perfil
    } else {
      enqueueSnackbar(result.message || 'Erro no cadastro.', { variant: 'error' });
    }
  };

  // Função para renderizar os cards de reservas com filtro e labels de status
  const renderReservations = () => {
    if (reservations.length === 0) {
      return <Typography variant="body1">Você não possui reservas.</Typography>;
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
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Meu Perfil
        </Typography>

        {/* Formulário de Perfil */}
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
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

            {/* Outros campos podem ser adicionados aqui */}
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