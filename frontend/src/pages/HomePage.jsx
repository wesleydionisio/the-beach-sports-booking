// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import axios from '../api/apiService';
import { Container, Grid, Typography } from '@mui/material';
import DefaultCourtCard from '../components/DefaultCourtCard';
import Header from '../components/global/Header';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get('/courts');
        setCourts(response.data);
      } catch (error) {
        console.error('Erro ao buscar quadras:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  // Número de skeletons a serem exibidos na grade
  const skeletonGrid = Array.from({ length: 6 }).map((_, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Skeleton height={300} />
    </Grid>
  ));

  return (
    <>
      <Header />
      <HeroSection courts={courts} loading={loading} />
      <AboutSection />
      
    </>
  );
};

export default HomePage;