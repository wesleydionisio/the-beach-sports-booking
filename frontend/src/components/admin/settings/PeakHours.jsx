import React from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  enabled: Yup.boolean(),
  peakHours: Yup.array().of(
    Yup.object().shape({
      inicio: Yup.string().required('Horário inicial é obrigatório'),
      fim: Yup.string().required('Horário final é obrigatório'),
      percentualAumento: Yup.number()
        .required('Percentual é obrigatório')
        .min(0, 'Percentual deve ser maior que 0')
        .max(100, 'Percentual não pode ser maior que 100'),
    })
  ),
  peakDays: Yup.array().of(
    Yup.object().shape({
      data: Yup.date().required('Data é obrigatória'),
      percentualAumento: Yup.number()
        .required('Percentual é obrigatório')
        .min(0, 'Percentual deve ser maior que 0')
        .max(100, 'Percentual não pode ser maior que 100'),
    })
  ),
});

const PeakHours = () => {
  const formik = useFormik({
    initialValues: {
      enabled: true,
      peakHours: [
        { inicio: '17:00', fim: '22:00', percentualAumento: 30 }
      ],
      peakDays: [
        { data: '2024-12-25', percentualAumento: 50 }
      ]
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const addPeakHour = () => {
    const peakHours = [...formik.values.peakHours];
    peakHours.push({ inicio: '', fim: '', percentualAumento: 0 });
    formik.setFieldValue('peakHours', peakHours);
  };

  const removePeakHour = (index) => {
    const peakHours = [...formik.values.peakHours];
    peakHours.splice(index, 1);
    formik.setFieldValue('peakHours', peakHours);
  };

  const addPeakDay = () => {
    const peakDays = [...formik.values.peakDays];
    peakDays.push({ data: '', percentualAumento: 0 });
    formik.setFieldValue('peakDays', peakDays);
  };

  const removePeakDay = (index) => {
    const peakDays = [...formik.values.peakDays];
    peakDays.splice(index, 1);
    formik.setFieldValue('peakDays', peakDays);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.enabled}
                onChange={(e) => formik.setFieldValue('enabled', e.target.checked)}
                name="enabled"
              />
            }
            label="Ativar preços diferenciados"
          />
        </Grid>

        {formik.values.enabled && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Horários de Pico
              </Typography>
              <Paper sx={{ p: 2 }}>
                {formik.values.peakHours.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 2,
                      alignItems: 'center'
                    }}
                  >
                    <TextField
                      size="small"
                      type="time"
                      label="Início"
                      value={formik.values.peakHours[index].inicio}
                      onChange={(e) => formik.setFieldValue(`peakHours.${index}.inicio`, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      size="small"
                      type="time"
                      label="Fim"
                      value={formik.values.peakHours[index].fim}
                      onChange={(e) => formik.setFieldValue(`peakHours.${index}.fim`, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      size="small"
                      type="number"
                      label="Aumento"
                      value={formik.values.peakHours[index].percentualAumento}
                      onChange={(e) => formik.setFieldValue(`peakHours.${index}.percentualAumento`, e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            %
                          </InputAdornment>
                        )
                      }}
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => removePeakHour(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addPeakHour}
                  variant="outlined"
                  size="small"
                >
                  Adicionar Horário
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Datas Especiais
              </Typography>
              <Paper sx={{ p: 2 }}>
                {formik.values.peakDays.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 2,
                      alignItems: 'center'
                    }}
                  >
                    <TextField
                      size="small"
                      type="date"
                      label="Data"
                      value={formik.values.peakDays[index].data}
                      onChange={(e) => formik.setFieldValue(`peakDays.${index}.data`, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      size="small"
                      type="number"
                      label="Aumento"
                      value={formik.values.peakDays[index].percentualAumento}
                      onChange={(e) => formik.setFieldValue(`peakDays.${index}.percentualAumento`, e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            %
                          </InputAdornment>
                        )
                      }}
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => removePeakDay(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addPeakDay}
                  variant="outlined"
                  size="small"
                >
                  Adicionar Data
                </Button>
              </Paper>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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

export default PeakHours; 