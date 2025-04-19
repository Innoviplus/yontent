
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PendingRegistration } from '@/hooks/auth/types/phoneSignUpTypes';

interface RegistrationContextType {
  pendingRegistrations: Map<string, PendingRegistration>;
  setPendingRegistration: (phone: string, data: PendingRegistration) => void;
  getPendingRegistration: (phone: string) => PendingRegistration | undefined;
  clearPendingRegistration: (phone: string) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [pendingRegistrations, setPendingRegistrations] = useState<Map<string, PendingRegistration>>(new Map());

  const setPendingRegistration = (phone: string, data: PendingRegistration) => {
    setPendingRegistrations(prev => {
      const newMap = new Map(prev);
      newMap.set(phone, data);
      return newMap;
    });
  };

  const getPendingRegistration = (phone: string) => {
    return pendingRegistrations.get(phone);
  };

  const clearPendingRegistration = (phone: string) => {
    setPendingRegistrations(prev => {
      const newMap = new Map(prev);
      newMap.delete(phone);
      return newMap;
    });
  };

  return (
    <RegistrationContext.Provider 
      value={{ 
        pendingRegistrations, 
        setPendingRegistration, 
        getPendingRegistration,
        clearPendingRegistration 
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
