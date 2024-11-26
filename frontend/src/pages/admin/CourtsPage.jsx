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
  Tooltip,
  Grid
} from '@mui/material';
import {
  Search,
  Add,
  Refresh,
  FilterList
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import CourtsTable from '../../components/admin/courts/CourtsTable';
import CourtFormModal from '../../components/admin/courts/CourtFormModal';

const CourtsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);

  const handleOpenModal = (court = null) => {
    setSelectedCourt(court);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCourt(null);
    setModalOpen(false);
  };

  const handleSubmitCourt = async (values) => {
    try {
      console.log('Dados da quadra:', values);
      enqueueSnackbar(
        `Quadra ${values.isEditing ? 'atualizada' : 'criada'} com sucesso!`,
        { variant: 'success' }
      );
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar quadra:', error);
      enqueueSnackbar('Erro ao salvar quadra', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quadras
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie as quadras disponíveis
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Buscar quadras..."
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
                Nova Quadra
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <CourtsTable 
            searchTerm={searchTerm}
            onEditCourt={handleOpenModal}
          />
        </Grid>
      </Grid>

      <CourtFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        court={selectedCourt}
        onSubmit={handleSubmitCourt}
      />
    </Container>
  );
};

export default CourtsPage; 