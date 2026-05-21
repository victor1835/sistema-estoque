import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Customers />} />
        <Route path="clientes/:id" element={<CustomerDetail />} />
        <Route path="estoque" element={<Inventory />} />
        <Route path="vendas" element={<Sales />} />
        <Route path="relatorios" element={<ProtectedRoute requireAdmin><Reports /></ProtectedRoute>} />
        <Route path="configuracoes" element={<ProtectedRoute requireAdmin><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
