
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { checkIsAdmin } from "@/services/admin/users";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingRole(false);
        return;
      }

      try {
        // Use the checkIsAdmin function which handles error cases better
        const isAdminUser = await checkIsAdmin(user.id);
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!loading) {
      setCheckingRole(true);
      checkAdminStatus();
    }
  }, [user, loading]);

  // Debug logging to help track the authentication flow
  console.log("AdminProtectedRoute state:", { 
    user: user?.id, 
    loading, 
    checkingRole, 
    isAdmin 
  });

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (isAdmin === false) {
    return <Navigate to="/admin/login" state={{ from: location, notAdmin: true }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
