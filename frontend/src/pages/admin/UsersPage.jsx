import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UsersTable from '../../components/admin/users/UsersTable';
import UserFilters from '../../components/admin/users/UserFilters';
import UserFormModal from '../../components/admin/users/UserFormModal';
import axios from '../../api/apiService';
import { useSnackbar } from 'notistack';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/admin/users');
      console.log('Usuários carregados:', response.data);
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        throw new Error(response.data.message || 'Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Erro ao carregar usuários', 
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Usuários
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Novo Usuário
        </Button>
      </Box>

      <UserFilters />

      <Box sx={{ mt: 3 }}>
        <UsersTable 
          users={users}
          onEdit={handleEdit}
        />
      </Box>

      <UserFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={async (values) => {
          console.log('Valores do formulário:', values);
          // Implementar lógica de salvar depois
        }}
      />
    </Box>
  );
};

export default UsersPage; 