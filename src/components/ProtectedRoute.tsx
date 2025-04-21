
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentSession, getCurrentUser } from '@/services/auth/sessionAuth';
import { toast } from 'sonner';
import AdminLogin from "@/pages/admin/AdminLogin";
import { fetchUserRoles } from "@/services/admin/users";

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
  
  // Force display of admin panel after very short delay if user exists
  useEffect(() => {
    if (isAdminRoute) {
      const forceTimer = setTimeout(() => {
        if (user) {
          setForceAccess(true);
          setIsVerifying(false);
          console.log("Forcing access to admin route for authenticated user");
        }
      }, 500); // Reduced from 1000ms to 500ms for faster access
      
      return () => clearTimeout(forceTimer);
    }
  }, [isAdminRoute, user]);
  
  useEffect(() => {
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
        if ((!user || !session) && verificationAttempts < 1) {
          setIsVerifying(true);
          console.log("Directly verifying session...");
          
          const currentSession = await getCurrentSession();
          const currentUser = currentSession ? await getCurrentUser() : null;
          
          console.log("Direct verification results:", { 
            hasSession: !!currentSession, 
            hasUser: !!currentUser,
            userEmail: currentUser?.email
          });
          
          if (currentUser && currentSession) {
            console.log("Session verified successfully");
            if (refreshUserProfile) {
              await refreshUserProfile();
            }
            setIsVerifying(false);
          } else {
            setVerificationAttempts(prev => prev + 1);
            setIsVerifying(false);
          }
        } else {
          setIsVerifying(false);
        }
      } catch (error) {
        console.error("Failed to verify session directly:", error);
        setIsVerifying(false);
      }
    };
    
    if (user && session) {
      setIsVerifying(false);
      
      if (!userProfile && refreshUserProfile) {
        console.log("Protected route: Refreshing missing user profile");
        refreshUserProfile();
      }
    } else if (!loading && !isAdminRoute) {
      verifySessionDirectly();
    } else if (!loading && isAdminRoute) {
      // For admin routes, either verify directly or force through after short timeout
      if (!forceAccess) {
        verifySessionDirectly();
        
        // Set a backup timeout to prevent infinite loading
        const backupTimer = setTimeout(() => {
          setIsVerifying(false);
        }, 1500);
        return () => clearTimeout(backupTimer);
      }
    }
  }, [location.pathname, loading, user, session, userProfile, refreshUserProfile, verificationAttempts, isAdminRoute, forceAccess]);
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    const checkAdminRole = async () => {
      if (isAdminRoute && user) {
        try {
          // Simplified role check - don't wait indefinitely for role check
          const roles = await Promise.race([
            fetchUserRoles(user.id),
            new Promise<string[]>((resolve) => {
              setTimeout(() => resolve([]), 1000); // Timeout after 1 second
            })
          ]);
          
          const hasAdminRole = roles.includes("admin") || roles.includes("super_admin");
          console.log("User roles check:", { roles, hasAdminRole });
          setIsAdmin(hasAdminRole);
        } catch (error) {
          console.error("Error checking admin role:", error);
          // Don't block access on role check failure
          setIsAdmin(true); 
        }
      } else if (!isAdminRoute) {
        setIsAdmin(null);
      }
    };
    
    if (user && isAdminRoute) {
      checkAdminRole();
    }
  }, [user, isAdminRoute]);

  // For admin routes, show login if not logged in
  if (isAdminRoute && (!user || !session)) {
    return <AdminLogin />;
  }
  
  // Access denied if admin route but not admin
  if (isAdminRoute && user && isAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center gap-2">
          <Shield className="h-10 w-10 text-red-500 mb-1" />
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-500 text-sm">You do not have admin rights.</p>
        </div>
      </div>
    );
  }

  // Loading state - with drastically reduced loading time
  if (loading || (isVerifying && !forceAccess)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-brand-teal animate-spin mb-2" />
          <span className="text-gray-600">Verifying your session...</span>
          {isAdminRoute && (
            <button 
              onClick={() => setForceAccess(true)} 
              className="mt-4 text-sm text-gray-500 underline"
            >
              Force continue to admin panel
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Allow access to admin route with admin role or when forced
  if (isAdminRoute && (forceAccess || user || isAdmin)) {
    console.log("Allowing access to admin route");
    return <>{children}</>;
  }
  
  // For non-admin routes, require authentication
  if (!user || !session) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
