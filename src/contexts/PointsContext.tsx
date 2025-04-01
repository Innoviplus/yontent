
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface PointsContextType {
  userPoints: number;
  isLoading: boolean;
  refreshPoints: () => Promise<void>;
}

const PointsContext = createContext<PointsContextType>({
  userPoints: 0,
  isLoading: true,
  refreshPoints: async () => { console.log('Default refreshPoints called') }
});

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
  const auth = useContext(AuthContext);
  const user = auth?.user;

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

      if (error) {
        console.error('Error fetching user points:', error);
        // Don't show toast on initial load to prevent spam
        // Only show toast on explicit refresh or subsequent failures
        return;
      }
      
      setUserPoints(data?.points || 0);
    } catch (error) {
      console.error('Error fetching user points:', error);
      // Don't show toast on initial load
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("PointsProvider: User available, fetching points");
      fetchUserPoints();
    } else {
      console.log("PointsProvider: No user available");
      setUserPoints(0);
      setIsLoading(false);
    }
  }, [user]);

  const refreshPoints = async () => {
    try {
      await fetchUserPoints();
    } catch (error) {
      toast.error('Failed to load points');
    }
  };

  return (
    <PointsContext.Provider value={{ userPoints, isLoading, refreshPoints }}>
      {children}
    </PointsContext.Provider>
  );
};
