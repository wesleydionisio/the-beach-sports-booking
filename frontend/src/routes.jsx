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
import AdminLayout from './components/admin/layout/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import CourtsPage from './pages/admin/CourtsPage';
import BookingsPage from './pages/admin/BookingsPage';
import FinancePage from './pages/admin/FinancePage';
import SettingsPage from './pages/admin/SettingsPage';


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
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="courts" element={<CourtsPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;