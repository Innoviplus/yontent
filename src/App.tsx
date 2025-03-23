
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AdminPanel from './pages/AdminPanel';
import RewardDetail from './pages/RewardDetail';
import Redeem from './pages/Redeem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/redeem" element={<Redeem />} />
        <Route path="/rewards/:id" element={<RewardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
