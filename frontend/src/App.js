import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Results from './pages/Results/Results';
import Dashboard from './pages/Dashboard/Dashboard';
import Footer from './components/Footer/Footer';
import Notifications from './components/Notifications/Notifications';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<Results />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <Footer />
            <Notifications />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;