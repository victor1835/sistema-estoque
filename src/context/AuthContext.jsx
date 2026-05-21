import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, setToken as saveToken, removeToken, getToken } from '../api';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ name: 'Admin', role: 'admin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user on mount if token exists
  useEffect(() => {
    // Mock user always logged in
    setLoading(false);
  }, []);

  async function loadUser() {
    setUser({ name: 'Admin', role: 'admin' });
  }

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await auth.login(email, password);
      saveToken(response.access_token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setError(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
