// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
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
import PageContainer from '../components/layout/PageContainer';

const LoginPage = () => {
  const [tab, setTab] = useState(0); // Tab 0 = Login, Tab 1 = Criar Conta
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    telefone: ''
  });
  const [loading, setLoading] = useState(false); // Estado para carregamento
  const [error, setError] = useState(''); // Estado para erros
  const navigate = useNavigate();

  // Função auxiliar para verificar e processar redirecionamento
  const handleRedirectAfterAuth = () => {
    console.log('🔍 Verificando redirecionamento após autenticação...');
    const pendingBookingStr = localStorage.getItem('pendingBooking');
    
    if (pendingBookingStr) {
      try {
        const bookingData = JSON.parse(pendingBookingStr);
        console.log('📝 Dados da reserva pendente encontrados:', bookingData);
        
        if (bookingData.quadraId) {
          console.log('🔄 Redirecionando para booking:', `/booking/${bookingData.quadraId}`);
          navigate(`/booking/${bookingData.quadraId}`);
          return true;
        }
      } catch (error) {
        console.error('❌ Erro ao processar dados pendentes:', error);
        localStorage.removeItem('pendingBooking');
      }
    }
    
    console.log('➡️ Nenhuma reserva pendente, redirecionando para perfil');
    navigate('/perfil');
    return false;
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setFormData({
      email: '',
      senha: '',
      nome: '',
      telefone: ''
    });
    setError('');
  };

  const handleLogin = async () => {
    console.log('🚀 Iniciando processo de login...');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/login', {
        email: formData.email,
        senha: formData.senha
      });

      if (response.data.success) {
        console.log('✅ Login realizado com sucesso');
        localStorage.setItem('authToken', response.data.token);
        
        // Aguardar um momento para garantir que o token foi salvo
        setTimeout(() => {
          handleRedirectAfterAuth();
        }, 100);
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    console.log('🚀 Iniciando criação de conta...');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/register', {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha
      });

      if (response.data.success) {
        console.log('✅ Conta criada com sucesso, realizando login automático...');
        
        const loginResponse = await axios.post('/auth/login', {
          email: formData.email,
          senha: formData.senha
        });

        if (loginResponse.data.success) {
          localStorage.setItem('authToken', loginResponse.data.token);
          
          // Aguardar um momento para garantir que o token foi salvo
          setTimeout(() => {
            handleRedirectAfterAuth();
          }, 100);
        }
      }
    } catch (error) {
      console.error('❌ Erro na criação da conta:', error);
      setError(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer withHeader={false}>
      <Container 
        maxWidth="sm" 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box 
          p={3} 
          boxShadow={3} 
          borderRadius={2}
          sx={{
            width: '100%',
            backgroundColor: 'white',
            my: 2 // margem vertical para evitar colagem nas bordas em telas muito pequenas
          }}
        >
          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                  label="Senha"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
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
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
                <TextField
                  label="Telefone"
                  type="tel"
                  fullWidth
                  margin="normal"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                  label="Senha"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
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
    </PageContainer>
  );
};

export default LoginPage;