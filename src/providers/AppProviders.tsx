
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
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                duration: 4000,
                closeButton: true,
                // Add custom styling to make toasts more visible
                className: "rounded-lg shadow-md",
              }}
              // Set this to prevent multiple toasts with same content
              richColors
            />
          </PointsProvider>
        </AuthProvider>
      </RegistrationProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
