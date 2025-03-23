import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ReceiptSubmission from './pages/ReceiptSubmission';
import MissionDetails from './pages/MissionDetails';
import ReviewPage from './pages/ReviewPage';
import Rewards from './pages/Rewards';
import RewardDetail from './pages/RewardDetail';
import AdminPanel from './pages/AdminPanel';

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
        <Route path="/receipt-submission" element={<ReceiptSubmission />} />
        <Route path="/missions/:id" element={<MissionDetails />} />
        <Route path="/review/:id" element={<ReviewPage />} />
        <Route path="/redeem" element={<Rewards />} />
        <Route path="/rewards/:id" element={<RewardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
