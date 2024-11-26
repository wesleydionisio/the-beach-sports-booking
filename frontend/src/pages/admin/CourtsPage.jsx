import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CourtCard from '../../components/admin/courts/CourtCard';
import PageHeader from '../../components/admin/common/PageHeader';
import { courtsService } from '../../services/admin/courtsService';

const CourtsPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courtsService.getAllCourts();
      setCourts(data);
    } catch (error) {
      console.error('Erro ao carregar quadras:', error);
      setError('Não foi possível carregar as quadras. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleEditCourt = async (courtId) => {
    console.log('Editar quadra:', courtId);
    // Implementar lógica de edição posteriormente
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <PageHeader 
          title="Gerenciamento de Quadras"
          subtitle="Visualize e gerencie suas quadras"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          onClick={() => console.log('Adicionar nova quadra')}
        >
          Adicionar Quadra
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courts.map((court) => (
            <Grid item key={court._id} xs={12} sm={6} md={4}>
              <CourtCard 
                court={{
                  id: court._id,
                  name: court.nome,
                  description: court.descricao,
                  imageUrl: court.foto_principal,
                  sport: court.esportes_permitidos?.map(esp => esp.nome).join(', '),
                  pricePerHour: court.valor_hora || 0
                }}
                onEdit={() => handleEditCourt(court._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CourtsPage; 