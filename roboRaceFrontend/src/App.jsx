import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Teams from './pages/Teams';
import Groups from './pages/Groups';
import Matches from './pages/Matches';
import Ranking from './pages/Ranking';

import Admin from './pages/Admin';
import Public from './pages/Public';
import PublicView from './pages/PublicView';

function AppContent() {
  const { isAuthenticated, login, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route path="/" element={
        !isAuthenticated ? <Navigate to="/login" replace /> : <Navigate to="/teams" replace />
      } />
      {isAuthenticated ? (
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/teams" element={<Teams />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/public" element={<Public />} />
            </Routes>
          </Layout>
        } />
      ) : (
        <Route path="/*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/view" element={<PublicView />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
