import React from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CloudUpload } from '@mui/icons-material';

const validationSchema = Yup.object({
  nomeEmpresa: Yup.string().required('Nome da empresa é obrigatório'),
  cnpj: Yup.string().required('CNPJ é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  endereco: Yup.string().required('Endereço é obrigatório'),
});

const GeneralSettings = () => {
  const formik = useFormik({
    initialValues: {
      nomeEmpresa: 'Beach Sports',
      cnpj: '12.345.678/0001-90',
      email: 'contato@beachsports.com',
      telefone: '(11) 99999-9999',
      endereco: 'Av. da Praia, 123',
      logo: null
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              src={formik.values.logo}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
            >
              Alterar Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(event) => {
                  formik.setFieldValue('logo', URL.createObjectURL(event.currentTarget.files[0]));
                }}
              />
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="nomeEmpresa"
            label="Nome da Empresa"
            value={formik.values.nomeEmpresa}
            onChange={formik.handleChange}
            error={formik.touched.nomeEmpresa && Boolean(formik.errors.nomeEmpresa)}
            helperText={formik.touched.nomeEmpresa && formik.errors.nomeEmpresa}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="cnpj"
            label="CNPJ"
            value={formik.values.cnpj}
            onChange={formik.handleChange}
            error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
            helperText={formik.touched.cnpj && formik.errors.cnpj}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="endereco"
            label="Endereço"
            value={formik.values.endereco}
            onChange={formik.handleChange}
            error={formik.touched.endereco && Boolean(formik.errors.endereco)}
            helperText={formik.touched.endereco && formik.errors.endereco}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Salvar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default GeneralSettings; 