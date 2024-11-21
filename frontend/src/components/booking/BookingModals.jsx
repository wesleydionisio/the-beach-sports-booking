import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography,
  TextField,
  CircularProgress
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from '../../api/apiService';

// Definição dos estilos
const modalStyles = {
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 600,
    m: 2,
    borderRadius: 2
  }
};

const buttonStyles = {
  borderRadius: 2,
  textTransform: 'none',
  px: 3,
  py: 1.5,
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  '& .MuiButton-startIcon': {
    margin: 0
  }
};

// Função auxiliar para obter o nome do dia da semana
const getDayName = (dayNumber) => {
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];
  return days[dayNumber];
};

const BookingModals = ({ selectedSlot, onRecurrenceConfirm }) => {
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [observationOpen, setObservationOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecurrenceConfirm = async () => {
    if (!selectedOption) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('BookingModals - Valor selecionado:', selectedOption);
      
      const recorrencia = {
        is_recorrente: true,
        duracao_meses: Number(selectedOption),
        dia_semana: new Date(selectedSlot.data).getDay()
      };

      console.log('BookingModals - Enviando recorrência:', recorrencia);
      onRecurrenceConfirm(recorrencia);
      setRecurrenceOpen(false);

    } catch (error) {
      console.error('Erro ao confirmar recorrência:', error);
      setError('Erro ao confirmar recorrência');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Button
          startIcon={<AccessTimeIcon />}
          variant="outlined"
          onClick={() => setRecurrenceOpen(true)}
          sx={buttonStyles}
        >
          Horário Fixo?
        </Button>
        <Button
          startIcon={<NoteAddIcon />}
          variant="outlined"
          onClick={() => setObservationOpen(true)}
          sx={buttonStyles}
        >
          Adicionar Observação
        </Button>

        <Dialog open={recurrenceOpen} onClose={() => setRecurrenceOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Agendar Horário Fixo</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Por quanto tempo você deseja manter este horário?
            </Typography>
            {[1, 2, 3, 4, 5, 6].map((months) => (
              <Button
                key={months}
                variant={selectedOption === months ? "contained" : "outlined"}
                onClick={() => {
                  console.log('Selecionando opção:', months);
                  setSelectedOption(months);
                }}
                sx={{ m: 1 }}
              >
                {months} {months === 1 ? 'mês' : 'meses'}
              </Button>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecurrenceOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleRecurrenceConfirm}
              variant="contained" 
              disabled={!selectedOption}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
        <ObservationModal
          open={observationOpen}
          onClose={() => setObservationOpen(false)}
        />
      </Box>
    </Box>
  );
};

const ObservationModal = ({ open, onClose }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    fullScreen={false}
    sx={modalStyles}
  >
    <DialogTitle>Adicionar Observação</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        fullWidth
        multiline
        rows={4}
        placeholder="Digite sua observação aqui..."
        sx={{ mt: 2 }}
      />
    </DialogContent>
    <DialogActions sx={{ p: 2, pt: 0 }}>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onClose} variant="contained">Salvar</Button>
    </DialogActions>
  </Dialog>
);

export default BookingModals; 