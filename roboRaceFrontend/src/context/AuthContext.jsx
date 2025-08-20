import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem('roborace_token');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (success) => {
    if (success) {
      try {
        localStorage.setItem('roborace_token', 'admin_token');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao salvar token:', error);
      }
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('roborace_token');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    } finally {
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};