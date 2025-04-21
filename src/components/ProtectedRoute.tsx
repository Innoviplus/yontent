
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUser } from '@/services/auth/sessionAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session, userProfile, refreshUserProfile } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [forceAccess, setForceAccess] = useState(false);
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // For admin route, force access after maximum verification attempts or timeout
  useEffect(() => {
    if (isAdminRoute) {
      // After initial load or multiple attempts, force access to admin route
      const forceTimer = setTimeout(() => {
        if (isVerifying && user) {
          setForceAccess(true);
          setIsVerifying(false);
          console.log("Forcing access to admin route for authenticated user");
        }
      }, 1500); // Reduced timeout for better user experience
      
      return () => clearTimeout(forceTimer);
    }
  }, [isAdminRoute, user, isVerifying]);
  
  useEffect(() => {
    // Debug logs to help identify authentication issues
    console.log("Protected route check:", {
      path: location.pathname,
      isLoading: loading,
      hasUser: !!user,
      hasSession: !!session,
      hasProfile: !!userProfile,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A',
      verificationAttempts,
      isAdminRoute,
      forceAccess
    });
    
    const verifySessionDirectly = async () => {
      try {
        // Verify session for admin page or when session data is missing
        if ((!user || !session || isAdminRoute) && verificationAttempts < 2) {
          setIsVerifying(true);
          console.log("Directly verifying session...");
          
          // Get current session and user directly from auth service
          const currentSession = await getCurrentSession();
          const currentUser = currentSession ? await getCurrentUser() : null;
          
          console.log("Direct verification results:", { 
            hasSession: !!currentSession, 
            hasUser: !!currentUser,
            userEmail: currentUser?.email
          });
          
          // If we have verified the session successfully
          if (currentUser && currentSession) {
            console.log("Session verified successfully");
            // Refresh the user profile
            if (refreshUserProfile) {
              await refreshUserProfile();
            }
            setVerificationAttempts(prev => prev + 1);
            setIsVerifying(false);
          } else {
            // Increment attempts count
            setVerificationAttempts(prev => prev + 1);
            setIsVerifying(false);
          }
        } else {
          // We have a user and session, or we've reached max attempts
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Failed to verify session directly:", error);
        setIsVerifying(false);
        
        if (verificationAttempts >= 1 && !isAdminRoute) {
          toast.error("Authentication error. Please try logging in again.");
        }
      }
    };
    
    // Check if we're already verified or still loading from context
    if (user && session) {
      setIsVerifying(false);
      
      // Refresh profile if user exists but profile is missing
      if (!userProfile && refreshUserProfile) {
        console.log("Protected route: Refreshing missing user profile");
        refreshUserProfile();
      }
    } else if (!loading) {
      // Only try to verify if the auth context has finished its own loading
      verifySessionDirectly();
    }
  }, [location.pathname, loading, user, session, userProfile, refreshUserProfile, verificationAttempts, isAdminRoute]);
  
  // Show loading state when either the auth context is loading or we're manually verifying
  if (loading || (isVerifying && !forceAccess)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-brand-teal animate-spin mb-2" />
          <span className="text-gray-600">Verifying your session...</span>
          {isAdminRoute && verificationAttempts > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Admin access is being verified...
            </p>
          )}
        </div>
      </div>
    );
  }
  
  // For admin routes, force access after user is loaded or after timeout
  if (isAdminRoute && (forceAccess || user)) {
    console.log("Allowing access to admin route");
    return <>{children}</>;
  }
  
  // For non-admin routes, check both user and session
  if (!user || !session) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
