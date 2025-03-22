
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import SubmitReview from "./pages/SubmitReview";
import ReviewFeed from "./pages/ReviewFeed";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import UserProfile from "./pages/UserProfile";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import UserRankings from "./pages/UserRankings";
import RedeemPoints from "./pages/RedeemPoints";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import RedemptionItems from "./pages/Admin/RedemptionItems";
import PointsManagement from "./pages/Admin/PointsManagement";
import AdminUsers from "./pages/Admin/AdminUsers";
import FollowersList from "./pages/FollowersList";
import FollowingList from "./pages/FollowingList";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/:id" element={<ReviewDetail />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/missions/:id" element={<MissionDetail />} />
              <Route path="/followers/:id" element={<FollowersList />} />
              <Route path="/following/:id" element={<FollowingList />} />
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="/user-rankings" element={<UserRankings />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/submit-review" element={<SubmitReview />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/redeem-points" element={<RedeemPoints />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="redemption-items" element={<RedemptionItems />} />
                  <Route path="points" element={<PointsManagement />} />
                  <Route path="admin-users" element={<AdminUsers />} />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
