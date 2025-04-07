
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

// Create a client
const queryClient = new QueryClient();

// Create a wrapper component to ensure proper provider nesting
const AppWithProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithProviders />
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
