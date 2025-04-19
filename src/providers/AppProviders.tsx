
import React from "react";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { PointsProvider } from "@/contexts/PointsContext";
import { RegistrationProvider } from "@/contexts/auth/RegistrationContext";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <RegistrationProvider>
        <AuthProvider>
          <PointsProvider>
            {children}
            <Toaster position="top-right" />
          </PointsProvider>
        </AuthProvider>
      </RegistrationProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
