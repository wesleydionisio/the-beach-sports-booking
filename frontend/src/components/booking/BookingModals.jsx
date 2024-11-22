import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Divider,
  Skeleton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { format, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from '../../api/apiService';
import { debounce } from 'lodash';

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
  height: 40,
  p: 0,
  pl: 2,
  pr: 2,
  textTransform: 'none',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  '& .MuiButton-startIcon': {
    ml: 0,
    mr: 1
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

const LoadingSkeleton = () => (
  <Box sx={{ mt: 1 }}>
    {/* Container de Review */}
    <Paper sx={{ p: 2, mb: 1, boxShadow: 'none', bgcolor: 'grey.50' }}>
      <Stack spacing={0.5}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} display="flex" justifyContent="space-between">
            <Skeleton 
              width={80} 
              height={24} 
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
            <Skeleton 
              width={120} 
              height={24} 
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>
        ))}
      </Stack>
    </Paper>

    {/* Alert Skeleton */}
    <Skeleton 
      variant="rectangular" 
      height={48} 
      animation="wave"
      sx={{ 
        mb: 1,
        borderRadius: 1,
        bgcolor: 'grey.200'
      }} 
    />

    {/* Lista de Horários Skeleton */}
    <Stack spacing={1}>
      {[...Array(5)].map((_, index) => (
        <Paper 
          key={index}
          sx={{ 
            p: 1.5,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Skeleton 
                width={120} 
                height={24} 
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
              <Skeleton 
                width={160} 
                height={20} 
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
            </Box>
            <Skeleton 
              width={80} 
              height={24} 
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>
        </Paper>
      ))}
    </Stack>
  </Box>
);

const RecurrencePreview = ({ selectedSlot, selectedOption, previewDates, loading }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  const startDate = new Date(selectedSlot.data);
  const allAvailable = previewDates.every(date => date.disponivel);

  // Função para capitalizar primeira letra
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Paper 
        sx={{ 
          p: 2, 
          mb: 1,
          boxShadow: 'none',
          bgcolor: 'grey.50'
        }}
      >
        <Stack spacing={0.5}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Dia da semana
            </Typography>
            <Typography variant="body2">
              {capitalizeFirstLetter(format(startDate, 'EEEE', { locale: ptBR })) + 's'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Horário
            </Typography>
            <Typography variant="body2">
              {selectedSlot.horario_inicio} às {selectedSlot.horario_fim}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Começa em
            </Typography>
            <Typography variant="body2">
              {format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Durante
            </Typography>
            <Typography variant="body2">
              {selectedOption} {selectedOption === 1 ? 'mês' : 'meses'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography variant="body2" color="text.secondary" fontWeight={550}>
              Valor final
            </Typography>
            <Typography variant="subtitle2" color="success.main">
              R$ {(selectedSlot.valor * previewDates.length).toFixed(2).replace('.', ',')}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" p={1}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <Alert 
            icon={allAvailable ? <CheckCircleIcon /> : <WarningIcon />}
            severity={allAvailable ? "success" : "warning"}
            sx={{ mb: 1 }}
          >
            <Box>
              {allAvailable 
                ? "Todos os horários estão disponíveis"
                : (
                  <>
                    <Typography variant="body2">
                      Alguns horários não estão disponíveis
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        mt: 0.5,
                        color: 'text.secondary',
                        fontSize: '0.7rem'
                      }}
                    >
                      O restante dos seus agendamentos será feito normalmente
                    </Typography>
                  </>
                )
              }
            </Box>
          </Alert>

          <Stack spacing={1}>
            {previewDates.map((date, index) => (
              <Paper 
                key={index}
                sx={{ 
                  p: 1.5,
                  opacity: date.disponivel ? 1 : 0.6,
                  bgcolor: date.disponivel ? 'background.paper' : 'action.disabledBackground',
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ gap: 0 }}>
                  <Box>
                    <Typography variant="body2">
                      {selectedSlot.horario_inicio} às {selectedSlot.horario_fim}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(date.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="success.main">
                    R$ {selectedSlot.valor.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

const BookingModals = ({ selectedSlot, onRecurrenceConfirm }) => {
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [observationOpen, setObservationOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewDates, setPreviewDates] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [confirmedRecurrence, setConfirmedRecurrence] = useState(null);

  // Função para gerar as datas recorrentes
  const generateRecurringDates = (months) => {
    if (!selectedSlot?.data) return [];
    
    const startDate = new Date(selectedSlot.data);
    const endDate = addMonths(startDate, months);
    const dayOfWeek = startDate.getDay();
    const dates = [];
    
    let currentDate = startDate;
    while (currentDate <= endDate) {
      if (currentDate.getDay() === dayOfWeek) {
        dates.push({
          data: currentDate.toISOString(),
          horario_inicio: selectedSlot.horario_inicio,
          horario_fim: selectedSlot.horario_fim,
          valor: selectedSlot.valor,
          disponivel: null, // será verificado pela API
          dia_semana: format(currentDate, 'EEEE', { locale: ptBR })
        });
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    
    return dates;
  };

  // Debounce da função de verificação
  const debouncedCheck = debounce(async (dates) => {
    try {
      const availabilityPromises = dates.map(date => 
        axios.post('/bookings/check-recorrencia', {
          quadra_id: selectedSlot.quadra_id,
          data: date.data,
          horario_inicio: selectedSlot.horario_inicio,
          horario_fim: selectedSlot.horario_fim
        }).catch(error => {
          console.error('Erro na verificação:', error);
          return { status: 'rejected', error };
        })
      );

      const results = await Promise.all(availabilityPromises);
      
      const updatedDates = dates.map((date, index) => {
        const result = results[index];
        return {
          ...date,
          disponivel: result.status === 200 && result.data?.disponivel
        };
      });

      setPreviewDates(updatedDates);
      setCheckingAvailability(false);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      setError('Erro ao verificar disponibilidade dos horários');
      setCheckingAvailability(false);
    }
  }, 500);

  useEffect(() => {
    if (!selectedOption || !selectedSlot) return;

    setCheckingAvailability(true);
    setError(null);
    const dates = generateRecurringDates(selectedOption);
    
    debouncedCheck(dates);

    return () => {
      debouncedCheck.cancel();
    };
  }, [selectedOption, selectedSlot]);

  const handleRecurrenceConfirm = () => {
    onRecurrenceConfirm(selectedOption);
    setConfirmedRecurrence(selectedOption);
    setRecurrenceOpen(false);
  };

  const RecurrencePreviewTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Dia</TableCell>
            <TableCell>Horário</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {previewDates.map((date, index) => (
            <TableRow key={index}>
              <TableCell>
                {format(new Date(date.data), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>{date.dia_semana}</TableCell>
              <TableCell>
                {date.horario_inicio} - {date.horario_fim}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(date.valor)}
              </TableCell>
              <TableCell>
                <Chip
                  label={date.disponivel ? "Disponível" : "Indisponível"}
                  color={date.disponivel ? "success" : "error"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleMonthSelect = (months) => {
    // Se clicar no mesmo mês já selecionado, deseleciona
    if (selectedOption === months) {
      setSelectedOption(null);
    } else {
      setSelectedOption(months);
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
        {confirmedRecurrence ? (
          <Button
            variant="contained"
            onClick={() => setRecurrenceOpen(true)}
            startIcon={<AccessTimeIcon />}
            sx={buttonStyles}
          >
            {confirmedRecurrence} {confirmedRecurrence === 1 ? 'mês' : 'meses'}
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => setRecurrenceOpen(true)}
            startIcon={<AccessTimeIcon />}
            sx={buttonStyles}
          >
            Horário fixo
          </Button>
        )}
        
        <Button
          variant="outlined"
          onClick={() => setObservationOpen(true)}
          startIcon={<NoteAddIcon />}
          sx={buttonStyles}
        >
          Adicionar Observação
        </Button>

        <Dialog 
          open={recurrenceOpen} 
          onClose={() => setRecurrenceOpen(false)} 
          maxWidth="sm" 
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>Agendar Horário Fixo</DialogTitle>
          <DialogContent>

            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6].map((months) => (
                <Button
                  key={months}
                  variant={selectedOption === months ? "contained" : "outlined"}
                  onClick={() => handleMonthSelect(months)}
                  size="small"
                  sx={{ 
                    borderRadius: '50%',
                    minWidth: '52px',
                    height: '52px',
                    p: 0,
                    flexDirection: 'column',
                    lineHeight: 1
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: -0.5 }}>
                    {months}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                    {months === 1 ? 'mês' : 'meses'}
                  </Typography>
                </Button>
              ))}
            </Box>

            {selectedOption && (
              <RecurrencePreview
                selectedSlot={selectedSlot}
                selectedOption={selectedOption}
                previewDates={previewDates}
                loading={checkingAvailability}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setRecurrenceOpen(false)}
              size="small"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleRecurrenceConfirm}
              variant="contained" 
              disabled={!selectedOption || checkingAvailability}
              size="small"
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