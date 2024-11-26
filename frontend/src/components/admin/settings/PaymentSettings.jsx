import React from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  pixEnabled: Yup.boolean(),
  pixKey: Yup.string().when('pixEnabled', {
    is: true,
    then: () => Yup.string().required('Chave PIX é obrigatória')
  }),
  creditCardEnabled: Yup.boolean(),
  cashEnabled: Yup.boolean(),
  cancelationEnabled: Yup.boolean(),
  cancelationFee: Yup.number().when('cancelationEnabled', {
    is: true,
    then: () => Yup.number()
      .required('Taxa de cancelamento é obrigatória')
      .min(0, 'Taxa deve ser maior ou igual a 0')
      .max(100, 'Taxa não pode ser maior que 100')
  }),
  advancePaymentRequired: Yup.boolean(),
  advancePaymentPercentage: Yup.number().when('advancePaymentRequired', {
    is: true,
    then: () => Yup.number()
      .required('Porcentagem de pagamento antecipado é obrigatória')
      .min(0, 'Porcentagem deve ser maior ou igual a 0')
      .max(100, 'Porcentagem não pode ser maior que 100')
  })
});

const PaymentSettings = () => {
  const formik = useFormik({
    initialValues: {
      pixEnabled: true,
      pixKey: '12345678900',
      creditCardEnabled: true,
      cashEnabled: true,
      cancelationEnabled: true,
      cancelationFee: 30,
      advancePaymentRequired: true,
      advancePaymentPercentage: 50
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
            Métodos de Pagamento
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.pixEnabled}
                      onChange={formik.handleChange}
                      name="pixEnabled"
                    />
                  }
                  label="PIX"
                />
                {formik.values.pixEnabled && (
                  <TextField
                    fullWidth
                    name="pixKey"
                    label="Chave PIX"
                    size="small"
                    sx={{ mt: 1 }}
                    value={formik.values.pixKey}
                    onChange={formik.handleChange}
                    error={formik.touched.pixKey && Boolean(formik.errors.pixKey)}
                    helperText={formik.touched.pixKey && formik.errors.pixKey}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.creditCardEnabled}
                      onChange={formik.handleChange}
                      name="creditCardEnabled"
                    />
                  }
                  label="Cartão de Crédito"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.cashEnabled}
                      onChange={formik.handleChange}
                      name="cashEnabled"
                    />
                  }
                  label="Dinheiro"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Políticas de Pagamento
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.advancePaymentRequired}
                      onChange={formik.handleChange}
                      name="advancePaymentRequired"
                    />
                  }
                  label="Exigir pagamento antecipado"
                />
                {formik.values.advancePaymentRequired && (
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="advancePaymentPercentage"
                    label="Porcentagem do pagamento antecipado"
                    value={formik.values.advancePaymentPercentage}
                    onChange={formik.handleChange}
                    error={formik.touched.advancePaymentPercentage && Boolean(formik.errors.advancePaymentPercentage)}
                    helperText={formik.touched.advancePaymentPercentage && formik.errors.advancePaymentPercentage}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          %
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.cancelationEnabled}
                      onChange={formik.handleChange}
                      name="cancelationEnabled"
                    />
                  }
                  label="Permitir cancelamento com taxa"
                />
                {formik.values.cancelationEnabled && (
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="cancelationFee"
                    label="Taxa de cancelamento"
                    value={formik.values.cancelationFee}
                    onChange={formik.handleChange}
                    error={formik.touched.cancelationFee && Boolean(formik.errors.cancelationFee)}
                    helperText={formik.touched.cancelationFee && formik.errors.cancelationFee}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          %
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mt: 1 }}
                  />
                )}
              </Grid>
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

export default PaymentSettings;