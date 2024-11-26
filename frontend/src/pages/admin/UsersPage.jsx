import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search,
  Add,
  Refresh,
  FilterList
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import UsersTable from '../../components/admin/users/UsersTable';
import UserFilters from '../../components/admin/users/UserFilters';
import UserFormModal from '../../components/admin/users/UserFormModal';

const UsersPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  const handleSubmitUser = async (values) => {
    try {
      console.log('Dados do usuário:', values);
      enqueueSnackbar(
        `Usuário ${values.isEditing ? 'atualizado' : 'criado'} com sucesso!`,
        { variant: 'success' }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      enqueueSnackbar('Erro ao salvar usuário', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Usuários
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie os usuários do sistema
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: showFilters ? 2 : 0 }}>
          <TextField
            size="small"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Filtros">
            <IconButton 
              color={showFilters ? 'primary' : 'default'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
          <Tooltip title="Atualizar">
            <IconButton>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Novo Usuário
          </Button>
        </Box>

        {showFilters && <UserFilters />}
      </Paper>

      <UsersTable 
        searchTerm={searchTerm} 
        onEditUser={handleOpenModal}
      />

      <UserFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        onSubmit={handleSubmitUser}
      />
    </Container>
  );
};

export default UsersPage; 