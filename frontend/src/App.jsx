import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProfileForm from './pages/ProfileForm';
import Results from './pages/Results';
import SchemeDetail from './pages/SchemeDetail';
import AdminDashboard from './pages/AdminDashboard';
import { LanguageProvider } from './LanguageContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/results" element={<Results />} />
        <Route path="/scheme" element={<SchemeDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
