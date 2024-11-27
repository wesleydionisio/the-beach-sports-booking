// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { AuthContext } from '../context/AuthContext'; // Importar AuthContext

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect');
  const { setUser } = useContext(AuthContext); // Adicionar contexto

  // Função auxiliar para verificar e processar redirecionamento
  const handleRedirectAfterAuth = () => {
    console.log('🔍 Verificando redirecionamento após autenticação...');
    
    // Primeiro verificar se há um redirectTo na URL
    if (redirectTo) {
      console.log('➡️ Redirecionando para:', redirectTo);
      navigate(redirectTo);
      return;
    }

    // Se não houver redirectTo, verificar pendingBooking
    const pendingBookingStr = localStorage.getItem('pendingBooking');
    
    if (pendingBookingStr) {
      try {
        const bookingData = JSON.parse(pendingBookingStr);
        console.log('📝 Dados da reserva pendente encontrados:', bookingData);
        
        if (bookingData.quadraId) {
          console.log('🔄 Redirecionando para booking:', `/booking/${bookingData.quadraId}`);
          navigate(`/booking/${bookingData.quadraId}`);
          return;
        }
      } catch (error) {
        console.error('❌ Erro ao processar dados pendentes:', error);
        localStorage.removeItem('pendingBooking');
      }
    }
    
    // Se não houver redirecionamento específico, ir para a página inicial
    console.log('➡️ Redirecionando para página inicial');
    navigate('/');
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
    console.log('📧 Email:', formData.email);
    setLoading(true);
    setError('');

    try {
      console.log('📤 Enviando requisição de login...');
      const response = await axios.post('/auth/login', {
        email: formData.email,
        senha: formData.senha
      });

      console.log('📥 Resposta recebida:', response.data);

      if (response.data.success || response.data.token) {
        console.log('✅ Login realizado com sucesso');
        console.log('👤 Dados do usuário:', response.data.user);
        
        // Verificar se o token existe
        if (!response.data.token) {
          console.error('❌ Token não encontrado na resposta');
          throw new Error('Token não encontrado');
        }

        try {
          console.log('🔑 Tentando salvar token no localStorage...');
          localStorage.clear(); // Limpar localStorage primeiro
          localStorage.setItem('authToken', response.data.token);
          
          // Verificar se o token foi salvo corretamente
          const savedToken = localStorage.getItem('authToken');
          console.log('✅ Token salvo:', !!savedToken);
          
          if (!savedToken) {
            console.error('❌ Falha ao salvar token no localStorage');
            throw new Error('Falha ao salvar token');
          }
        } catch (storageError) {
          console.error('❌ Erro ao manipular localStorage:', storageError);
          throw storageError;
        }
        
        console.log('👤 Atualizando contexto do usuário...');
        setUser(response.data.user);
        
        console.log('⏳ Iniciando redirecionamento...');
        setTimeout(() => {
          console.log('🔄 Executando redirecionamento...');
          handleRedirectAfterAuth();
        }, 100);
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      console.error('📝 Detalhes do erro:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      console.log('🏁 Processo de login finalizado');
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
          
          // Atualizar o contexto com os dados do usuário
          setUser(loginResponse.data.user);
          
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