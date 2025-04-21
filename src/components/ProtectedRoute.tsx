
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUser } from '@/services/auth/sessionAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session, userProfile, refreshUserProfile } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  
  useEffect(() => {
    // Debug logs to help identify authentication issues
    console.log("Protected route check:", {
      path: location.pathname,
      isLoading: loading,
      hasUser: !!user,
      hasSession: !!session,
      hasProfile: !!userProfile,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
    });
    
    // Special handling for admin page - verify session directly if needed
    const verifySessionDirectly = async () => {
      if (!user && !loading && location.pathname === '/admin') {
        try {
          setIsVerifying(true);
          const currentSession = await getCurrentSession();
          const currentUser = await getCurrentUser();
          
          if (currentUser && currentSession) {
            console.log("Manually verified session for admin page");
            // Don't need to set anything here, the auth listener will handle it
            if (refreshUserProfile) {
              refreshUserProfile();
            }
          }
        } catch (error) {
          console.error("Failed to verify session directly:", error);
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    verifySessionDirectly();
    
    // Refresh profile if user exists but profile is missing
    if (user && !userProfile && !loading && refreshUserProfile) {
      console.log("Protected route: Refreshing missing user profile");
      refreshUserProfile();
    }
  }, [location.pathname, loading, user, session, userProfile, refreshUserProfile]);
  
  if (loading || isVerifying) {
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
  
  return <>{children}</>;
};

export default ProtectedRoute;
