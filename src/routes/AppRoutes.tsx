import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Reviews from "@/pages/Reviews";
import ReviewDetail from "@/pages/ReviewDetail";
import EditReview from "@/pages/EditReview";
import Rewards from "@/pages/Rewards";
import RewardDetail from "@/pages/RewardDetail";
import Missions from "@/pages/Missions";
import MissionDetail from "@/pages/MissionDetail";
import MissionReviewSubmission from "@/pages/MissionReviewSubmission";
import MissionReceiptSubmission from "@/pages/MissionReceiptSubmission";
import AdminPanel from "@/pages/admin/AdminPanel"; 
import AdminLogin from "@/pages/admin/AdminLogin";
import Settings from "@/pages/Settings";
import UserProfile from "@/pages/UserProfile";
import UserRankings from "@/pages/UserRankings";
import NotFound from "@/pages/NotFound";
import FollowersList from "@/pages/FollowersList";
import FollowingList from "@/pages/FollowingList";
import EditProfile from "@/pages/EditProfile";
import SubmitReview from "@/pages/SubmitReview";
import CreateReview from "@/pages/CreateReview";
import ReviewFeed from "@/pages/ReviewFeed";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import SetAvatar from "@/pages/SetAvatar";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import MyRewardTransactions from "@/pages/MyRewardTransactions";
import MyMissions from "@/pages/MyMissions";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/review/:id" element={<ReviewDetail />} />
      <Route path="/edit-review/:id" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
      <Route path="/submit-review" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />
      <Route path="/create-review" element={<ProtectedRoute><CreateReview /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
      <Route path="/rewards/:id" element={<ProtectedRoute><RewardDetail /></ProtectedRoute>}
      />
      <Route path="/missions" element={<Missions />} />
      <Route path="/mission/:id" element={<MissionDetail />} />
      <Route path="/mission/:id/review" element={<ProtectedRoute><MissionReviewSubmission /></ProtectedRoute>} />
      <Route path="/mission/:id/receipt" element={<ProtectedRoute><MissionReceiptSubmission /></ProtectedRoute>} />
      <Route path="/my-missions" element={<ProtectedRoute><MyMissions /></ProtectedRoute>} />
      <Route path="/my-reward-transactions" element={<ProtectedRoute><MyRewardTransactions /></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminProtectedRoute><AdminPanel /></AdminProtectedRoute>} />
      
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/user/:username" element={<UserProfile />} />
      <Route path="/user/:username/followers" element={<FollowersList />} />
      <Route path="/user/:username/following" element={<FollowingList />} />
      
      {/* Redirect to correct pages with username parameter */}
      <Route path="/followers" element={<ProtectedRoute><FollowersList /></ProtectedRoute>} />
      <Route path="/following" element={<ProtectedRoute><FollowingList /></ProtectedRoute>} />
      
      <Route path="/rankings" element={<UserRankings />} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/review-feed" element={<ReviewFeed />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/set-avatar" element={<SetAvatar />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
