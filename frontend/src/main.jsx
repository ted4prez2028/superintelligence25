import './styles.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Memory from './pages/Memory';
import Goals from './pages/Goals';
import Showcase from './pages/Showcase';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Chat />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/memory" element={<Memory />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/showcase" element={<Showcase />} />
      <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
    </Routes>
  </BrowserRouter>
);
