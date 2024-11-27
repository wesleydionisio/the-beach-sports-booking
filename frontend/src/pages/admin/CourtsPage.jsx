import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Grid,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from '../../api/apiService';
import CourtCard from '../../components/admin/courts/CourtCard';
import CourtFormModal from '../../components/admin/courts/CourtFormModal';

const CourtsPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/courts');
      
      console.log('\n=== BUSCANDO DADOS DAS QUADRAS ===');
      console.log('Quadras recebidas:', response.data);
      
      // Buscar contagem de agendamentos para cada quadra
      const courtsWithBookings = await Promise.all(
        response.data.map(async (court) => {
          try {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();
            
            console.log('\nBuscando contagens para quadra:', {
              court_id: court._id,
              court_nome: court.nome,
              data: formattedDate,
              mes: currentMonth,
              ano: currentYear
            });
            
            const [todayBookings, monthBookings] = await Promise.all([
              axios.get(`/bookings/count/${court._id}/day`, {
                params: { date: formattedDate }
              }),
              axios.get(`/bookings/count/${court._id}/month`, {
                params: { month: currentMonth, year: currentYear }
              })
            ]);
            
            console.log('Respostas recebidas:', {
              hoje: todayBookings.data,
              mes: monthBookings.data
            });
            
            return {
              ...court,
              bookings_today: todayBookings.data.count || 0,
              bookings_month: monthBookings.data.count || 0
            };
          } catch (error) {
            console.error(`Erro ao buscar contagens para quadra ${court._id}:`, error);
            return {
              ...court,
              bookings_today: 0,
              bookings_month: 0
            };
          }
        })
      );
      
      console.log('Dados finais das quadras:', courtsWithBookings);
      setCourts(courtsWithBookings);
    } catch (error) {
      console.error('Erro ao carregar quadras:', error);
      enqueueSnackbar('Erro ao carregar quadras', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

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
      if (selectedCourt) {
        await axios.put(`/courts/${selectedCourt._id}`, values);
      } else {
        await axios.post('/courts', values);
      }
      
      enqueueSnackbar(
        `Quadra ${selectedCourt ? 'atualizada' : 'criada'} com sucesso!`,
        { variant: 'success' }
      );
      
      handleCloseModal();
      fetchCourts();
    } catch (error) {
      enqueueSnackbar('Erro ao salvar quadra', { variant: 'error' });
    }
  };

  const filteredCourts = courts.filter(court =>
    court.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <Paper sx={{ p: 2, mb: 3 }}>
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
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Atualizar">
            <IconButton onClick={fetchCourts}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Nova Quadra
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {filteredCourts.map((court) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`court-${court._id}`}>
            <CourtCard 
              key={court._id}
              court={court}
              onEdit={handleOpenModal}
            />
          </Grid>
        ))}
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