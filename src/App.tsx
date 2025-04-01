
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import AdminPanel from './pages/AdminPanel';
import RewardDetail from './pages/RewardDetail';
import Rewards from './pages/Rewards';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import SubmitReview from './pages/SubmitReview';
import EditReview from './pages/EditReview';
import ProtectedRoute from './components/ProtectedRoute';
import ReviewDetail from './pages/ReviewDetail';
import Missions from './pages/Missions';
import MissionDetail from './pages/MissionDetail';
import MissionReceiptSubmission from './pages/MissionReceiptSubmission';
import MissionReviewSubmission from './pages/MissionReviewSubmission';
import UserRankings from './pages/UserRankings';
import FollowersList from './pages/FollowersList';
import FollowingList from './pages/FollowingList';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Footer from './components/home/Footer';

// Layout component to add Footer to all pages except TermsOfService and PrivacyPolicy
const Layout = ({ children, includeFooter = true }: { children: React.ReactNode, includeFooter?: boolean }) => {
  return (
    <>
      {children}
      {includeFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><Index /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
      <Route path="/review/:id" element={<Layout><ReviewDetail /></Layout>} />
      <Route path="/missions" element={<Layout><Missions /></Layout>} />
      <Route path="/mission/:id" element={<Layout><MissionDetail /></Layout>} />
      <Route path="/user-rankings" element={<Layout><UserRankings /></Layout>} />
      <Route path="/user/:username" element={<Layout><UserProfile /></Layout>} />
      <Route path="/rewards" element={<Layout><Rewards /></Layout>} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      
      {/* Redirect /profile to /settings */}
      <Route path="/profile" element={<Navigate to="/settings" replace />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile/:id" element={<Layout><Navigate to="/user/:username" replace /></Layout>} />
        <Route path="/followers/:id" element={<Layout><FollowersList /></Layout>} />
        <Route path="/following/:id" element={<Layout><FollowingList /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/edit-profile" element={<Layout><EditProfile /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/rewards/:id" element={<Layout><RewardDetail /></Layout>} />
        <Route path="/mission/:id/submit-receipt" element={<Layout><MissionReceiptSubmission /></Layout>} />
        <Route path="/mission/:id/submit-review" element={<Layout><MissionReviewSubmission /></Layout>} />
        <Route path="/submit-review" element={<Layout><SubmitReview /></Layout>} />
        <Route path="/edit-review/:id" element={<Layout><EditReview /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

export default App;
