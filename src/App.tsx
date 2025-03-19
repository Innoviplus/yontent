
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
import SubmitReceipt from "./pages/SubmitReceipt";
import ReviewFeed from "./pages/ReviewFeed";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import MissionFeed from "./pages/MissionFeed";
import MissionDetail from "./pages/MissionDetail";
import AdminMissions from "./pages/admin/AdminMissions";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/submit-review" element={
              <ProtectedRoute>
                <SubmitReview />
              </ProtectedRoute>
            } />
            <Route path="/submit-receipt" element={
              <ProtectedRoute>
                <SubmitReceipt />
              </ProtectedRoute>
            } />
            <Route path="/feed" element={<ReviewFeed />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reviews/:id" element={<ReviewDetail />} />
            
            {/* Mission routes */}
            <Route path="/missions" element={<MissionFeed />} />
            <Route path="/missions/:id" element={<MissionDetail />} />
            
            {/* Admin routes */}
            <Route path="/admin/missions" element={
              <ProtectedRoute>
                <AdminMissions />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
