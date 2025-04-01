
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { PointsProvider } from '@/contexts/PointsContext';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Create a client
const queryClient = new QueryClient();

// Create a wrapper component to ensure proper provider nesting
const AppWithProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PointsProvider>
            <App />
          </PointsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithProviders />
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
