import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/apiService';
import { useSnackbar } from 'notistack';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      fetchUser();
    } else {
      setLoading(false);
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authToken]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        handleAuthError();
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      handleAuthError();
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = () => {
    enqueueSnackbar('Sessão expirada. Faça login novamente.', { variant: 'error' });
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await axios.put('/users/profile', profileData);
      if (response.data.success) {
        setUser(response.data.user);
        enqueueSnackbar('Perfil atualizado com sucesso.', { variant: 'success' });
        return { success: true };
      } else {
        enqueueSnackbar(response.data.message || 'Não foi possível atualizar o perfil.', { variant: 'error' });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      enqueueSnackbar('Erro ao atualizar perfil. Tente novamente.', { variant: 'error' });
      return { success: false, message: error.response?.data?.message || 'Erro ao atualizar perfil.' };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success && response.data.token) {
        const token = response.data.token;
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Falha no login.' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: error.response?.data?.message || 'Erro no login.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      if (response.data.success && response.data.token) {
        const token = response.data.token;
        setAuthToken(token);
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Falha no cadastro.' };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, message: error.response?.data?.message || 'Erro no cadastro.' };
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    enqueueSnackbar('Deslogado com sucesso.', { variant: 'success' });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        authToken, 
        login, 
        register, 
        logout, 
        loading,
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};