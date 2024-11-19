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
import { IMaskInput } from 'react-imask';
import axios from '../api/apiService'; // Serviço de API
import { useNavigate } from 'react-router-dom';

// Componente para máscara de telefone
const PhoneMaskCustom = React.forwardRef(function PhoneMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(00) 0 0000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => {
        console.log('Valor do telefone após máscara:', value);
        onChange({ target: { name: props.name, value } });
      }}
      overwrite
    />
  );
});

// Validador de email separado
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validador de senha separado
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0); // Tab 0 = Login, Tab 1 = Criar Conta
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmSenha: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // Estado para carregamento
  const [error, setError] = useState(''); // Estado para erros

  // Adicionar verificação de autenticação
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      console.log('Usuário já autenticado, redirecionando para perfil...');
      navigate('/perfil');
    }
  }, [navigate]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }

    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.telefone) {
      errors.telefone = 'Telefone é obrigatório';
    } else {
      const telefoneFormatado = formData.telefone.trim();
      const telefoneRegex = /^\(\d{2}\)\s\d\s\d{4}-\d{4}$/;
      
      if (!telefoneRegex.test(telefoneFormatado)) {
        errors.telefone = 'Telefone deve estar no formato (99) 9 9999-9999';
        console.log('Telefone inválido:', telefoneFormatado);
        console.log('Regex test:', telefoneRegex.test(telefoneFormatado));
      }
    }

    if (!formData.senha) {
      errors.senha = 'Senha é obrigatória';
    } else if (!validatePassword(formData.senha)) {
      errors.senha = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmSenha) {
      errors.confirmSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmSenha) {
      errors.confirmSenha = 'As senhas não coincidem';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      confirmSenha: ''
    });
    setFormErrors({});
    setError('');
  };

  // Função de validação do formulário de login
  const validateLoginForm = (data) => {
    const errors = {};

    if (!data.email) {
      errors.email = 'Email é obrigatório';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Email inválido';
    }

    if (!data.senha) {
      errors.senha = 'Senha é obrigatória';
    } else if (!isValidPassword(data.senha)) {
      errors.senha = 'A senha deve ter pelo menos 6 caracteres';
    } else if (data.senha === data.email) {
      errors.senha = 'A senha não pode ser igual ao email';
    }

    return errors;
  };

  // Função de login refatorada
  const handleLogin = async () => {
    try {
      setError('');
      setFormErrors({});
      setLoading(true);

      // Validação do formulário
      const validationErrors = validateLoginForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      const loginData = {
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha
      };

      // Tentativa de login
      const response = await axios.post('/auth/login', loginData);

      if (response.data.success) {
        // Armazenar dados da sessão
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));

        // Processar reserva pendente se existir
        await handlePendingReservation(token);

        // Redirecionar para home
        navigate('/');
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  // Função separada para lidar com reservas pendentes
  const handlePendingReservation = async (token) => {
    const pendingReservation = localStorage.getItem('pendingReservation');
    if (!pendingReservation) return;

    try {
      const reservationData = JSON.parse(pendingReservation);
      const response = await axios.post('/bookings', reservationData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        localStorage.removeItem('pendingReservation');
      }
    } catch (error) {
      console.error('Erro ao processar reserva pendente:', error);
      throw new Error('Não foi possível processar a reserva pendente');
    }
  };

  // Função separada para tratamento de erros
  const handleLoginError = (error) => {
    console.error('Erro no login:', error);
    
    if (error.response?.status === 400) {
      setError('Email ou senha incorretos');
    } else if (error.response?.status === 429) {
      setError('Muitas tentativas de login. Tente novamente mais tarde.');
    } else {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
    }
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      
      const requestBody = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: formData.telefone,
        senha: formData.senha
      };
      
      // Debug detalhado
      console.group('Debug - Envio de Dados');
      console.log('Request Body:', requestBody);
      console.log('Request Body (JSON):', JSON.stringify(requestBody));
      console.log('Telefone:', {
        valor: formData.telefone,
        tipo: typeof formData.telefone,
        comprimento: formData.telefone?.length,
        formatoCorreto: /^\(\d{2}\)\s\d\s\d{4}-\d{4}$/.test(formData.telefone)
      });
      console.groupEnd();

      const response = await axios.post('/auth/register', requestBody);
      
      // Debug da resposta
      console.log('Status da resposta:', response.status);
      console.log('Dados da resposta:', response.data);

      if (response.data.success) {
        console.log('Registro bem-sucedido, tentando login automático...');
        
        const loginResponse = await axios.post('/auth/login', {
          email: formData.email.trim().toLowerCase(),
          senha: formData.senha
        });

        console.log('Resposta do login:', loginResponse.data);

        if (loginResponse.data.success) {
          const { token, user } = loginResponse.data;
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(user));
          console.log('Login automático bem-sucedido');
          navigate('/');
        }
      } else {
        console.log('Erro na resposta do servidor:', response.data);
        setError(response.data.message || 'Erro ao criar conta.');
      }
    } catch (error) {
      console.group('Debug do Erro');
      console.error('Erro completo:', error);
      console.error('Status do erro:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      console.error('Request body:', error.config?.data);
      console.groupEnd();
      
      setError(
        error.response?.data?.message || 
        'Erro ao criar conta. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 0 }, // Adiciona padding vertical no mobile
        backgroundColor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <Box 
          p={3} 
          boxShadow={3} 
          borderRadius={2}
          bgcolor="background.paper"
        >
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
              <Box component="form" onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={loading}
                  autoComplete="email"
                  required
                />
                <TextField
                  label="Senha"
                  type="password"
                  fullWidth
                  margin="normal"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  error={!!formErrors.senha}
                  helperText={formErrors.senha}
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
                {error && (
                  <Typography 
                    variant="body2" 
                    color="error" 
                    align="center" 
                    sx={{ 
                      mt: 1,
                      p: 1,
                      bgcolor: 'error.light',
                      borderRadius: 1
                    }}
                  >
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Fazendo login...' : 'Entrar'}
                </Button>
              </Box>
            ) : (
              // Formulário de Criação de Conta
              <Box>
                <TextField
                  label="Nome"
                  name="nome"
                  fullWidth
                  margin="normal"
                  value={formData.nome}
                  onChange={handleInputChange}
                  error={!!formErrors.nome}
                  helperText={formErrors.nome}
                />
                <TextField
                  label="Telefone"
                  name="telefone"
                  fullWidth
                  margin="normal"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  InputProps={{
                    inputComponent: PhoneMaskCustom,
                  }}
                  error={!!formErrors.telefone}
                  helperText={formErrors.telefone}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
                <TextField
                  label="Senha"
                  name="senha"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formData.senha}
                  onChange={handleInputChange}
                  error={!!formErrors.senha}
                  helperText={formErrors.senha}
                />
                <TextField
                  label="Confirmar Senha"
                  name="confirmSenha"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={formData.confirmSenha}
                  onChange={handleInputChange}
                  error={!!formErrors.confirmSenha}
                  helperText={formErrors.confirmSenha}
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
    </Box>
  );
};

export default LoginPage;