import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Automation from './pages/Automation';
import Control from './pages/Control';
import Serres from './pages/Serres';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Simulation de l'authentification
    if (email === 'agriculteur@nafa.com' && password === 'demo123') {
      setIsAuthenticated(true);
    } else {
      alert('Email ou mot de passe incorrect');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <History />;
      case 'automation':
        return <Automation />;
      case 'control':
        return <Control />;
      case 'serres':
        return <Serres />;
      case 'alerts':
        return <Alerts />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;