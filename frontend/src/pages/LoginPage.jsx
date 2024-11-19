// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import axios from '../api/apiService'; // Serviço de API
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [tab, setTab] = useState(0); // Tab 0 = Login, Tab 1 = Criar Conta
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState(''); // Usado apenas na criação de conta
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false); // Estado para carregamento
  const [error, setError] = useState(''); // Estado para erros
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setEmail('');
    setSenha('');
    setNome('');
    setTelefone('');
    setError('');
  };

  const handleLogin = async () => {
    setError('');
    try {
      if (!email || !senha) {
        setError('Por favor, preencha todos os campos.');
        return;
      }
      setLoading(true);
      const response = await axios.post('/auth/login', { email, senha });
      localStorage.setItem('authToken', response.data.token);

      // Verifica se há uma reserva pendente
      const pendingReservation = localStorage.getItem('pendingReservation');
      if (pendingReservation) {
        const reservationData = JSON.parse(pendingReservation);
        try {
          await axios.post('/bookings', reservationData);
          alert('Reserva confirmada com sucesso!');
          localStorage.removeItem('pendingReservation');
        } catch (bookingError) {
          console.error('Erro ao confirmar a reserva:', bookingError);
          setError(bookingError.response?.data?.message || 'Não foi possível confirmar a reserva.');
        }
      }

      navigate('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError(
        error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setError('');
    try {
      if (!nome || !email || !telefone || !senha) {
        setError('Por favor, preencha todos os campos.');
        return;
      }
      setLoading(true);
      const requestBody = { nome, email, telefone, senha };
      await axios.post('/auth/register', requestBody);
      alert('Conta criada com sucesso! Faça login para continuar.');

      // Opcional: Automaticamente redireciona para a aba de login após criar a conta
      setTab(0);
      setEmail('');
      setSenha('');
      setNome('');
      setTelefone('');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setError(
        error.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h5" align="center" gutterBottom>
          Login ou Criar Conta
        </Typography>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
        >
          <Tab label="Login" />
          <Tab label="Criar Conta" />
        </Tabs>
        <Box mt={3}>
          {tab === 0 ? (
            // Formulário de Login
            <Box>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {error && (
                <Typography variant="body2" color="error" align="center" mt={1}>
                  {error}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Fazendo Login...' : 'Fazer Login'}
              </Button>
            </Box>
          ) : (
            // Formulário de Criação de Conta
            <Box>
              <TextField
                label="Nome"
                fullWidth
                margin="normal"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                label="Telefone"
                type="tel"
                fullWidth
                margin="normal"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                margin="normal"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {error && (
                <Typography variant="body2" color="error" align="center" mt={1}>
                  {error}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCreateAccount}
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? 'Criando Conta...' : 'Criar Conta'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;