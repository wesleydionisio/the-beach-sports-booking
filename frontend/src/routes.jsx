// src/routes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import ReviewPage from './pages/ReviewPage';
import ReservationReview from './pages/ReservationReview';
import PerfilPage from './pages/PerfilPage';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:quadraId" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reserva/:id" element={<ReservationReview />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilPage />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;