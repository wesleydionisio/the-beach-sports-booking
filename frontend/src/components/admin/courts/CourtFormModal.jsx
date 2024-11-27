import React, { useState, useEffect } from 'react';
import axios from '../../../api/apiService';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

const validationSchema = Yup.object({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: Yup.string()
    .required('Descrição é obrigatória'),
  duracao_padrao: Yup.number()
    .required('Duração padrão é obrigatória')
    .min(30, 'Duração mínima de 30 minutos'),
  preco_por_hora: Yup.number()
    .required('Preço por hora é obrigatório')
    .min(0, 'Preço não pode ser negativo'),
  esportes_permitidos: Yup.array()
    .min(1, 'Selecione pelo menos um esporte')
    .required('Selecione os esportes disponíveis'),
});

const CourtFormModal = ({ open, onClose, court = null, onSubmit }) => {
  const [sports, setSports] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const isEditing = Boolean(court);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get('/sports');
        setSports(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Erro ao carregar esportes:', error);
        enqueueSnackbar('Erro ao carregar esportes', { variant: 'error' });
        setSports([]);
      }
    };
    fetchSports();
  }, [enqueueSnackbar]);

  const formik = useFormik({
    initialValues: {
      nome: court?.nome || '',
      descricao: court?.descricao || '',
      foto_principal: court?.foto_principal || '',
      duracao_padrao: court?.duracao_padrao || 60,
      preco_por_hora: court?.preco_por_hora || '',
      esportes_permitidos: Array.isArray(court?.esportes_permitidos) ? court.esportes_permitidos : [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await axios.put(`/courts/${court._id}`, values);
        } else {
          await axios.post('/courts', values);
        }
        onSubmit();
        enqueueSnackbar(`Quadra ${isEditing ? 'atualizada' : 'criada'} com sucesso!`, { variant: 'success' });
        onClose();
      } catch (error) {
        enqueueSnackbar('Erro ao salvar quadra', { variant: 'error' });
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Quadra' : 'Nova Quadra'}
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
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
                name="descricao"
                label="Descrição"
                multiline
                rows={3}
                value={formik.values.descricao}
                onChange={formik.handleChange}
                error={formik.touched.descricao && Boolean(formik.errors.descricao)}
                helperText={formik.touched.descricao && formik.errors.descricao}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="duracao_padrao"
                label="Duração Padrão (minutos)"
                type="number"
                value={formik.values.duracao_padrao}
                onChange={formik.handleChange}
                error={formik.touched.duracao_padrao && Boolean(formik.errors.duracao_padrao)}
                helperText={formik.touched.duracao_padrao && formik.errors.duracao_padrao}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="preco_por_hora"
                label="Preço por Hora"
                value={formik.values.preco_por_hora}
                onChange={formik.handleChange}
                error={formik.touched.preco_por_hora && Boolean(formik.errors.preco_por_hora)}
                helperText={formik.touched.preco_por_hora && formik.errors.preco_por_hora}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={sports || []}
                getOptionLabel={(option) => option?.nome || ''}
                value={formik.values.esportes_permitidos || []}
                onChange={(_, newValue) => {
                  formik.setFieldValue('esportes_permitidos', newValue || []);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Esportes Permitidos"
                    error={formik.touched.esportes_permitidos && Boolean(formik.errors.esportes_permitidos)}
                    helperText={formik.touched.esportes_permitidos && formik.errors.esportes_permitidos}
                  />
                )}
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