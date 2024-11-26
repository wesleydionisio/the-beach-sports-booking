import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  Autocomplete,
  InputAdornment,
  Chip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Dados mockados de esportes disponíveis
const availableSports = [
  'Beach Tennis',
  'Vôlei de Praia',
  'Futevôlei',
  'Beach Soccer',
  'Frescobol'
];

const validationSchema = Yup.object({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: Yup.string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  esportes: Yup.array()
    .min(1, 'Selecione pelo menos um esporte')
    .required('Selecione os esportes disponíveis'),
  valorHora: Yup.number()
    .required('Valor é obrigatório')
    .min(0, 'Valor não pode ser negativo'),
  dimensoes: Yup.string()
    .required('Dimensões são obrigatórias')
    .matches(/^\d+m\s*x\s*\d+m$/, 'Formato inválido. Use: 00m x 00m'),
  superficie: Yup.string()
    .required('Superfície é obrigatória'),
  status: Yup.string()
    .required('Status é obrigatório'),
  cobertura: Yup.boolean(),
  observacoes: Yup.string()
});

const CourtFormModal = ({ open, onClose, court = null, onSubmit }) => {
  const isEditing = Boolean(court);

  const formik = useFormik({
    initialValues: {
      nome: court?.nome || '',
      descricao: court?.descricao || '',
      esportes: court?.esportes || [],
      valorHora: court?.valorHora || '',
      dimensoes: court?.dimensoes || '',
      superficie: court?.superficie || '',
      status: court?.status || 'active',
      cobertura: court?.cobertura || false,
      observacoes: court?.observacoes || '',
      isEditing
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        onClose();
      } catch (error) {
        console.error('Erro ao salvar quadra:', error);
      }
    },
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEditing ? 'Editar Quadra' : 'Nova Quadra'}
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="nome"
                label="Nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CourtFormModal; 