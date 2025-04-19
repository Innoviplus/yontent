import React from "react";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { PointsProvider } from "@/contexts/PointsContext";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PointsProvider>
          {children}
          <Toaster position="top-right" />
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
