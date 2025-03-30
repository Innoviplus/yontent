
import { createContext, useContext, ReactNode } from 'react';
import { usePointsData } from '@/hooks/points/usePointsData';

interface PointsContextType {
  userPoints: number;
  isLoading: boolean;
  refreshPoints: () => Promise<void>;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const { userPoints, isLoading, refreshPoints } = usePointsData();

  return (
    <PointsContext.Provider value={{ userPoints, isLoading, refreshPoints }}>
      {children}
    </PointsContext.Provider>
  );
};
