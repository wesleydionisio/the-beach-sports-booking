// src/routes.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import ReviewPage from './pages/ReviewPage';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import ReservationReview from './pages/ReservationReview';
import { SnackbarProvider } from 'notistack';
import PerfilPage from './pages/PerfilPage';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:quadraId" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reservation-review/:reservationId" element={<ReservationReview />} />
        <Route path="/review" element={<ReviewPage />} />

        {/* Rota Protegida para PerfilPage */}
        <Route path="/perfil" element={
          <PrivateRoute>
            <PerfilPage />
          </PrivateRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRoutes;