import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import EditReview from "./pages/EditReview";
import Rewards from "./pages/Rewards";
import RewardDetail from "./pages/RewardDetail";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import MissionReviewSubmission from "./pages/MissionReviewSubmission";
import MissionReceiptSubmission from "./pages/MissionReceiptSubmission";
import AdminPanel from "./pages/AdminPanel";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import UserRankings from "./pages/UserRankings";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import FollowersList from "./pages/FollowersList";
import FollowingList from "./pages/FollowingList";
import EditProfile from "./pages/EditProfile";
import SubmitReview from "./pages/SubmitReview";
import CreateReview from "./pages/CreateReview";
import ReviewFeed from "./pages/ReviewFeed";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import SetAvatar from "./pages/SetAvatar"; // Add this import

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { PointsProvider } from "./contexts/PointsContext";
import { ToastProvider } from "@/hooks/use-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/reviews",
    element: <Reviews />,
  },
  {
    path: "/review/:id",
    element: <ReviewDetail />,
  },
  {
    path: "/edit-review/:id",
    element: <ProtectedRoute><EditReview /></ProtectedRoute>,
  },
  {
    path: "/submit-review",
    element: <ProtectedRoute><SubmitReview /></ProtectedRoute>,
  },
  {
    path: "/create-review",
    element: <ProtectedRoute><CreateReview /></ProtectedRoute>,
  },
  {
    path: "/rewards",
    element: <Rewards />,
  },
  {
    path: "/reward/:id",
    element: <RewardDetail />,
  },
  {
    path: "/missions",
    element: <Missions />,
  },
  {
    path: "/mission/:id",
    element: <MissionDetail />,
  },
  {
    path: "/mission/:id/review",
    element: <ProtectedRoute><MissionReviewSubmission /></ProtectedRoute>,
  },
  {
    path: "/mission/:id/receipt",
    element: <ProtectedRoute><MissionReceiptSubmission /></ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "/user/:username",
    element: <UserProfile />,
  },
  {
    path: "/rankings",
    element: <UserRankings />,
  },
  {
    path: "/edit-profile",
    element: <ProtectedRoute><EditProfile /></ProtectedRoute>,
  },
  {
    path: "/user/:username/followers",
    element: <FollowersList />,
  },
  {
    path: "/user/:username/following",
    element: <FollowingList />,
  },
  {
    path: "/review-feed",
    element: <ReviewFeed />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/set-avatar",
    element: <SetAvatar />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  useEffect(() => {
    document.title = "Lovable";
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <PointsProvider>
          <RouterProvider router={router} />
        </PointsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
