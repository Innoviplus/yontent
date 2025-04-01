
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

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
  const [userPoints, setUserPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchUserPoints = async () => {
    if (!user) {
      setUserPoints(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setUserPoints(data?.points || 0);
    } catch (error) {
      console.error('Error fetching user points:', error);
      toast.error('Failed to load points');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPoints();
  }, [user]);

  const refreshPoints = async () => {
    await fetchUserPoints();
  };

  return (
    <PointsContext.Provider value={{ userPoints, isLoading, refreshPoints }}>
      {children}
    </PointsContext.Provider>
  );
};
