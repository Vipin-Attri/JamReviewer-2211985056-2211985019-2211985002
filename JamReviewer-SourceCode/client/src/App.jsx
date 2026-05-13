import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import ProtectedRoute from './components/ProtectedRoute';
import AudioPlayer from './components/player/AudioPlayer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SongDetail from './pages/SongDetail';
import CreatorDashboard from './pages/creator/CreatorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Footer from './components/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e1b4b',
                color: '#e0e7ff',
                border: '1px solid #4338ca',
                borderRadius: '12px',
              },
            }}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/songs/:id" element={<SongDetail />} />

            <Route
              path="/creator"
              element={
                <ProtectedRoute roles={['CREATOR']}>
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />

          {/* Persistent bottom player */}
          <AudioPlayer />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
