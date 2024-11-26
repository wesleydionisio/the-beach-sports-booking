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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (99) 99999-9999'),
  tipo: Yup.string()
    .required('Tipo é obrigatório'),
  status: Yup.string()
    .required('Status é obrigatório'),
});

const UserFormModal = ({ open, onClose, user = null, onSubmit }) => {
  const isEditing = Boolean(user);

  const formik = useFormik({
    initialValues: {
      nome: user?.nome || '',
      email: user?.email || '',
      telefone: user?.telefone || '',
      tipo: user?.tipo || 'client',
      status: user?.status || 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        onClose();
      } catch (error) {
        console.error('Erro ao salvar usuário:', error);
      }
    },
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="telefone"
                label="Telefone"
                value={formik.values.telefone}
                onChange={formik.handleChange}
                error={formik.touched.telefone && Boolean(formik.errors.telefone)}
                helperText={formik.touched.telefone && formik.errors.telefone}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  label="Tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="client">Cliente</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="inactive">Inativo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormModal;