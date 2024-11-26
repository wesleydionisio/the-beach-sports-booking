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
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import CourtsPage from './pages/admin/CourtsPage';
import BusinessPage from './pages/admin/BusinessPage';
import SchedulesPage from './pages/admin/SchedulesPage';
import FinancialPage from './pages/admin/FinancialPage';
import AdminLayout from './components/layout/AdminLayout';


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

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/courts" element={<CourtsPage />} />
        <Route path="/admin/business" element={<BusinessPage />} />
        <Route path="/admin/schedules" element={<SchedulesPage />} />
        <Route path="/admin/financial" element={<FinancialPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;