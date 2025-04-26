
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access this page");
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Only render children if user is logged in
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
