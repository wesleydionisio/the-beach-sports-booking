import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography,
  Alert,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { format, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from '../api/apiService';
import LoadingSkeleton from './LoadingSkeleton';
import RecurrencePreview from './RecurrencePreview';
import usePreventScroll from '../hooks/usePreventScroll';

const RecurrenceModal = ({ 
  open, 
  onClose, 
  selectedSlot, 
  onConfirm,
  quadraId,
  disabled,
  selectedPayment
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewDates, setPreviewDates] = useState([]);
  const [error, setError] = useState('');

  usePreventScroll(open);

  console.log('RecurrenceModal Props:', {
    selectedSlot,
    quadraId,
    disabled,
    hasEsporte: Boolean(selectedSlot?.esporte),
    hasHorarios: Boolean(selectedSlot?.horario_inicio && selectedSlot?.horario_fim)
  });

  console.log('RecurrenceModal Validações:', {
    selectedSlot,
    disabled,
    validacoes: {
      temEsporte: Boolean(selectedSlot?.esporte),
      temHorarioInicio: Boolean(selectedSlot?.horario_inicio),
      temHorarioFim: Boolean(selectedSlot?.horario_fim),
      temData: Boolean(selectedSlot?.data),
      disabledFinal: disabled || !selectedSlot?.esporte
    }
  });

  useEffect(() => {
    if (!selectedOption || !selectedSlot) return;

    const fetchPreview = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Tentando gerar preview com:', {
          selectedSlot,
          selectedOption,
          quadraId,
          disabled,
          validacoes: {
            temEsporte: Boolean(selectedSlot.esporte),
            temHorarioInicio: Boolean(selectedSlot.horario_inicio),
            temHorarioFim: Boolean(selectedSlot.horario_fim),
            temData: Boolean(selectedSlot.data)
          }
        });

        if (!selectedSlot.esporte || !selectedSlot.horario_inicio || !selectedSlot.horario_fim) {
          console.error('Dados incompletos:', {
            selectedSlot,
            esporte: selectedSlot.esporte,
            horario_inicio: selectedSlot.horario_inicio,
            horario_fim: selectedSlot.horario_fim
          });
          setError('Por favor, selecione um esporte e um horário antes de continuar.');
          return;
        }

        const requestData = {
          dataBase: selectedSlot.data,
          duracaoDias: selectedOption * 30,
          tipoRecorrencia: 'semanal',
          diasSemana: [selectedSlot.data.day()],
          quadraId,
          horarioInicio: selectedSlot.horario_inicio,
          horarioFim: selectedSlot.horario_fim,
          esporte: selectedSlot.esporte
        };

        console.log('Dados da requisição:', requestData);

        const response = await axios.post('/bookings/recorrencia/preview', requestData);
        setPreviewDates(response.data.preview.datas);
      } catch (error) {
        console.error('Erro detalhado ao gerar preview:', {
          error: error.response?.data || error,
          message: error.message,
          selectedSlot,
          esporte: selectedSlot.esporte
        });
        setError(error.response?.data?.message || 'Erro ao gerar preview. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [selectedOption, selectedSlot, quadraId]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');

      // Apenas preparar os dados e retornar para o componente pai
      const recurrenceData = {
        dates: previewDates
          .filter(date => date.disponivel)
          .map(date => ({
            data: date.data,
            horario_inicio: date.horario_inicio,
            horario_fim: date.horario_fim
          })),
        tipo: selectedOption
      };

      onConfirm(recurrenceData);
    } catch (error) {
      console.error('Erro ao processar recorrência:', error);
      setError('Erro ao processar recorrência');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedOption(null); // Limpa a seleção do modal
    onClose(); // Fecha o modal
    onConfirm(null); // Limpa a recorrência no componente pai
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          height: { xs: '100%', sm: '600px' },
          margin: { xs: 0, sm: 2 },
          maxHeight: { xs: '100%', sm: 'calc(100% - 32px)' },
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle>
        Agendar Horário Fixo
      </DialogTitle>
      <DialogContent 
        sx={{ 
          flex: 1,
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          p: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ mb: 3 }}>
          {(!selectedSlot?.esporte || !selectedSlot?.horario_inicio || !selectedSlot?.horario_fim) && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Por favor, selecione um esporte e um horário antes de continuar.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box 
            sx={{ 
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 1,
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '3px',
                '&:hover': {
                  background: '#666'
                }
              }
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((months) => {
              const isDisabled = !selectedSlot?.esporte;
              
              return (
                <Button
                  key={months}
                  variant={selectedOption === months ? "contained" : "outlined"}
                  onClick={() => {
                    // Se já estiver selecionado, deseleciona
                    if (selectedOption === months) {
                      setSelectedOption(null);
                      onConfirm(null); // Limpa a recorrência no componente pai
                    } else {
                      setSelectedOption(months);
                    }
                  }}
                  size="small"
                  disabled={isDisabled}
                  sx={{ 
                    borderRadius: '50%',
                    minWidth: '64px',
                    height: '64px',
                    p: 0,
                    flexDirection: 'column',
                    lineHeight: 1,
                    gap: 0
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      lineHeight: 1,
                      mb: '-2px'
                    }}
                  >
                    {months}
                  </Typography>
                  <Typography 
                    variant="caption"
                    sx={{ 
                      fontSize: '0.65rem',
                      lineHeight: 1,
                      opacity: 0.8
                    }}
                  >
                    {months === 1 ? 'mês' : 'meses'}
                  </Typography>
                </Button>
              );
            })}
          </Box>

          <Box sx={{ 
            flex: 1,
            minHeight: 0,
            position: 'relative'
          }}>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              selectedOption && (
                <RecurrencePreview
                  selectedSlot={selectedSlot}
                  selectedOption={selectedOption}
                  previewDates={previewDates}
                />
              )
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained" 
          disabled={loading || !selectedPayment}
          color="primary"
        >
          {loading ? <CircularProgress size={24} /> : 'Confirmar'}
        </Button>
      </DialogActions>
      {error && (
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default RecurrenceModal; 