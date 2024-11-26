import React, { useState } from 'react';
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
  Autocomplete,
  InputAdornment,
  FormHelperText,
  Box,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addHours, parse } from 'date-fns';

// Dados mockados
const mockCourts = [
  { id: 1, nome: 'Quadra 1', esportes: ['Beach Tennis', 'Vôlei de Praia'] },
  { id: 2, nome: 'Quadra 2', esportes: ['Futevôlei', 'Vôlei de Praia'] },
  { id: 3, nome: 'Quadra 3', esportes: ['Beach Tennis'] }
];

const mockCustomers = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 98888-8888' },
  { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(11) 97777-7777' }
];

const validationSchema = Yup.object({
  clienteId: Yup.number()
    .required('Cliente é obrigatório'),
  quadraId: Yup.number()
    .required('Quadra é obrigatória'),
  esporte: Yup.string()
    .required('Esporte é obrigatório'),
  data: Yup.date()
    .required('Data é obrigatória'),
  horarioInicio: Yup.string()
    .required('Horário inicial é obrigatório')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:mm)'),
  duracao: Yup.number()
    .required('Duração é obrigatória')
    .min(1, 'Mínimo de 1 hora')
    .max(4, 'Máximo de 4 horas'),
  valor: Yup.number()
    .required('Valor é obrigatório')
    .min(0, 'Valor não pode ser negativo'),
  status: Yup.string()
    .required('Status é obrigatório'),
  observacoes: Yup.string()
});

const BookingFormModal = ({ open, onClose, booking = null, initialDate = null, onSubmit }) => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const isEditing = Boolean(booking);

  const formik = useFormik({
    initialValues: {
      clienteId: booking?.clienteId || '',
      quadraId: booking?.quadraId || '',
      esporte: booking?.esporte || '',
      data: booking?.data || (initialDate ? format(initialDate.start, 'yyyy-MM-dd') : ''),
      horarioInicio: booking?.horarioInicio || (initialDate ? format(initialDate.start, 'HH:mm') : ''),
      duracao: booking?.duracao || 1,
      valor: booking?.valor || '',
      status: booking?.status || 'confirmed',
      observacoes: booking?.observacoes || '',
      isEditing
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formattedValues = {
          ...values,
          start: parse(
            `${values.data} ${values.horarioInicio}`,
            'yyyy-MM-dd HH:mm',
            new Date()
          ),
          end: addHours(
            parse(`${values.data} ${values.horarioInicio}`, 'yyyy-MM-dd HH:mm', new Date()),
            values.duracao
          )
        };
        await onSubmit(formattedValues);
        onClose();
      } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
      }
    },
  });

  const handleCourtChange = (event, newValue) => {
    setSelectedCourt(newValue);
    formik.setFieldValue('quadraId', newValue?.id || '');
    formik.setFieldValue('esporte', ''); // Reseta o esporte quando muda a quadra
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={mockCustomers}
                getOptionLabel={(option) => option.nome}
                value={mockCustomers.find(c => c.id === formik.values.clienteId) || null}
                onChange={(event, newValue) => {
                  formik.setFieldValue('clienteId', newValue?.id || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente"
                    error={formik.touched.clienteId && Boolean(formik.errors.clienteId)}
                    helperText={formik.touched.clienteId && formik.errors.clienteId}
                  />
                )}
                renderOption={(props, option) => (
                  <Box {...props}>
                    <Typography>{option.nome}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      ({option.telefone})
                    </Typography>
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={mockCourts}
                getOptionLabel={(option) => option.nome}
                value={selectedCourt}
                onChange={handleCourtChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Quadra"
                    error={formik.touched.quadraId && Boolean(formik.errors.quadraId)}
                    helperText={formik.touched.quadraId && formik.errors.quadraId}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth
                error={formik.touched.esporte && Boolean(formik.errors.esporte)}
              >
                <InputLabel>Esporte</InputLabel>
                <Select
                  name="esporte"
                  value={formik.values.esporte}
                  onChange={formik.handleChange}
                  label="Esporte"
                  disabled={!selectedCourt}
                >
                  {selectedCourt?.esportes.map((esporte) => (
                    <MenuItem key={esporte} value={esporte}>
                      {esporte}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.esporte && formik.errors.esporte && (
                  <FormHelperText>{formik.errors.esporte}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="data"
                label="Data"
                value={formik.values.data}
                onChange={formik.handleChange}
                error={formik.touched.data && Boolean(formik.errors.data)}
                helperText={formik.touched.data && formik.errors.data}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                name="horarioInicio"
                label="Horário de Início"
                value={formik.values.horarioInicio}
                onChange={formik.handleChange}
                error={formik.touched.horarioInicio && Boolean(formik.errors.horarioInicio)}
                helperText={formik.touched.horarioInicio && formik.errors.horarioInicio}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="duracao"
                label="Duração (horas)"
                value={formik.values.duracao}
                onChange={formik.handleChange}
                error={formik.touched.duracao && Boolean(formik.errors.duracao)}
                helperText={formik.touched.duracao && formik.errors.duracao}
                inputProps={{ min: 1, max: 4 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="valor"
                label="Valor"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                value={formik.values.valor}
                onChange={formik.handleChange}
                error={formik.touched.valor && Boolean(formik.errors.valor)}
                helperText={formik.touched.valor && formik.errors.valor}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl 
                fullWidth
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Status"
                >
                  <MenuItem value="confirmed">Confirmado</MenuItem>
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="canceled">Cancelado</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="observacoes"
                label="Observações"
                value={formik.values.observacoes}
                onChange={formik.handleChange}
                error={formik.touched.observacoes && Boolean(formik.errors.observacoes)}
                helperText={formik.touched.observacoes && formik.errors.observacoes}
              />
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

export default BookingFormModal; 