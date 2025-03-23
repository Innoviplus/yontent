
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { PointsProvider } from '@/contexts/PointsContext';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PointsProvider>
          <Toaster position="top-right" />
          <App />
        </PointsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
