import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography,
  TextField
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

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

const BookingModals = ({ selectedSlot }) => {
  const [observationOpen, setObservationOpen] = useState(false);

  return (
    <Box sx={{ mb: 1 }}>
      <Button
        startIcon={<NoteAddIcon />}
        variant="outlined"
        onClick={() => setObservationOpen(true)}
        sx={buttonStyles}
      >
        Adicionar Observação
      </Button>

      <ObservationModal
        open={observationOpen}
        onClose={() => setObservationOpen(false)}
      />
    </Box>
  );
};

const ObservationModal = ({ open, onClose }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    fullScreen={false}
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