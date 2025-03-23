
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import AdminPanel from './pages/AdminPanel';
import RewardDetail from './pages/RewardDetail';
import Redeem from './pages/Redeem';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import CreateReview from './pages/CreateReview';
import EditReview from './pages/EditReview';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reviews" element={<Reviews />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/redeem" element={<Redeem />} />
          <Route path="/rewards/:id" element={<RewardDetail />} />
          <Route path="/submit-review" element={<CreateReview />} />
          <Route path="/edit-review/:id" element={<EditReview />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
