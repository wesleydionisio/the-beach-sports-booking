import React from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  TextField,
  Typography 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const buttonStyles = {
  justifyContent: 'flex-start',
  minWidth: 'auto',
  flex: '1 1 calc(50% - 8px)',
  height: '40px',
  '& .MuiSvgIcon-root': {
    color: 'inherit',
    width: 20,
    height: 20
  },
  '& .MuiButton-startIcon': {
    marginRight: 1
  },
  '& .MuiButton-label': {
    lineHeight: 1,
    whiteSpace: 'nowrap'
  }
};

const modalStyles = {
  '& .MuiDialog-paper': {
    width: { xs: '100%', sm: '600px' }, // Full width no mobile, 600px em telas maiores
    margin: { xs: '16px', sm: '32px' },
    borderRadius: { xs: '12px', sm: '12px' },
  },
  '& .MuiDialogTitle-root': {
    fontWeight: 550
  }
};

const RecurrenceModal = ({ open, onClose }) => {
  const [selectedOption, setSelectedOption] = React.useState(null);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullScreen={false}
      sx={modalStyles}
    >
      <DialogTitle>Horário Fixo?</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', // Força layout horizontal
          justifyContent: 'space-between', // Distribui os botões uniformemente
          flexWrap: 'nowrap', // Evita quebra de linha
          gap: 1.5,
          py: 2 
        }}>
          {[
            { value: '1', label: '1', subtitle: 'mês' },
            { value: '3', label: '3', subtitle: 'meses' },
            { value: '6', label: '6', subtitle: 'meses' },
            { value: '12', label: '12', subtitle: 'meses' },
            { value: '0', label: '', subtitle: 'fixo' }
          ].map((option) => (
            <Button
              key={option.value}
              variant={selectedOption === option.value ? "contained" : "outlined"}
              onClick={() => setSelectedOption(option.value)}
              sx={{
                borderRadius: '50%',
                minWidth: '64px',
                width: '64px',
                height: '64px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px',
                '& .MuiTypography-root': {
                  lineHeight: 1.2
                }
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {option.label}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                {option.subtitle}
              </Typography>
            </Button>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={onClose} 
          variant="contained" 
          disabled={!selectedOption}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
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

const BookingModals = () => {
  const [recurrenceOpen, setRecurrenceOpen] = React.useState(false);
  const [observationOpen, setObservationOpen] = React.useState(false);

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
          sx={{
            ...buttonStyles,
            '& .MuiButton-root': {
              lineHeight: 1,
            },
            typography: {
              lineHeight: 1
            }
          }}
        >
          Adicionar Observação
        </Button>

        <RecurrenceModal 
          open={recurrenceOpen}
          onClose={() => setRecurrenceOpen(false)}
        />
        <ObservationModal
          open={observationOpen}
          onClose={() => setObservationOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default BookingModals; 