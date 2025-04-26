
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Only show the toast and redirect once
    if (!user && !redirectAttempted.current) {
      redirectAttempted.current = true;
      toast.error("Please log in to access this page", {
        id: "auth-redirect", // Adding an ID to prevent duplicates
        duration: 4000
      });
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
