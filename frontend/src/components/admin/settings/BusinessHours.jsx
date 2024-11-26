import React from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  FormControlLabel,
  Switch,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DIAS_SEMANA = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

const validationSchema = Yup.object({
  diasFuncionamento: Yup.object().shape(
    DIAS_SEMANA.reduce((acc, dia) => ({
      ...acc,
      [dia]: Yup.object().shape({
        ativo: Yup.boolean(),
        abertura: Yup.string().when('ativo', {
          is: true,
          then: () => Yup.string().required('Horário de abertura é obrigatório')
        }),
        fechamento: Yup.string().when('ativo', {
          is: true,
          then: () => Yup.string().required('Horário de fechamento é obrigatório')
        })
      })
    }), {})
  )
});

const BusinessHours = () => {
  const formik = useFormik({
    initialValues: {
      diasFuncionamento: DIAS_SEMANA.reduce((acc, dia) => ({
        ...acc,
        [dia]: {
          ativo: false,
          abertura: '',
          fechamento: ''
        }
      }), {})
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Horários de Funcionamento
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {DIAS_SEMANA.map((dia) => (
                <Grid item xs={12} key={dia}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.diasFuncionamento[dia].ativo}
                        onChange={formik.handleChange}
                        name={`diasFuncionamento.${dia}.ativo`}
                      />
                    }
                    label={dia}
                  />
                  {formik.values.diasFuncionamento[dia].ativo && (
                    <TextField
                      fullWidth
                      name={`diasFuncionamento.${dia}.abertura`}
                      label="Horário de Abertura"
                      size="small"
                      sx={{ mt: 1 }}
                      value={formik.values.diasFuncionamento[dia].abertura}
                      onChange={formik.handleChange}
                      error={formik.touched[`diasFuncionamento.${dia}.abertura`] && Boolean(formik.errors[`diasFuncionamento.${dia}.abertura`])}
                      helperText={formik.touched[`diasFuncionamento.${dia}.abertura`] && formik.errors[`diasFuncionamento.${dia}.abertura`]}
                    />
                  )}
                  {formik.values.diasFuncionamento[dia].ativo && (
                    <TextField
                      fullWidth
                      name={`diasFuncionamento.${dia}.fechamento`}
                      label="Horário de Fechamento"
                      size="small"
                      sx={{ mt: 1 }}
                      value={formik.values.diasFuncionamento[dia].fechamento}
                      onChange={formik.handleChange}
                      error={formik.touched[`diasFuncionamento.${dia}.fechamento`] && Boolean(formik.errors[`diasFuncionamento.${dia}.fechamento`])}
                      helperText={formik.touched[`diasFuncionamento.${dia}.fechamento`] && formik.errors[`diasFuncionamento.${dia}.fechamento`]}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Salvar Alterações
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default BusinessHours; 