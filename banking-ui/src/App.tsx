import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import type { UserRole } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [cardNumber, setCardNumber] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('role') as UserRole;
    const savedCard = localStorage.getItem('cardNumber');
    if (savedRole) {
      setRole(savedRole);
      if (savedCard) setCardNumber(savedCard);
    }
  }, []);

  const handleLogin = (newRole: UserRole, card?: string) => {
    setRole(newRole);
    localStorage.setItem('role', newRole || '');
    
    if (newRole === 'CUSTOMER' && card) {
      setCardNumber(card);
      localStorage.setItem('cardNumber', card);
      navigate('/customer');
    } else if (newRole === 'ADMIN') {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setCardNumber('');
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/customer"
        element={
          role === 'CUSTOMER' && cardNumber ? (
            <CustomerDashboard cardNumber={cardNumber} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin"
        element={
          role === 'ADMIN' ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
