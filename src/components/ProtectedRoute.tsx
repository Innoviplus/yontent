
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { user, loading, session } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Debug logs to help identify authentication issues
    console.log("Protected route check:", {
      path: location.pathname,
      isLoading: loading,
      hasUser: !!user,
      hasSession: !!session,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
    });
  }, [location.pathname, loading, user, session]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 text-brand-teal animate-spin" />
      </div>
    );
  }
  
  // Check both user and session to ensure complete authentication
  if (!user || !session) {
    console.log("User not authenticated, redirecting to login");
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
