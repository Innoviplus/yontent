
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, userProfile } = useAuth();

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
        return;
      }
      
      setUserPoints(data?.points || 0);
    } catch (error) {
      console.error('Error fetching user points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up a subscription to listen for point transactions
  useEffect(() => {
    if (!user) return;

    // Subscribe to the user's profile changes to detect point updates
    const profilesChannel = supabase
      .channel('profile-points-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Profile updated:', payload);
          // Update points when profile is updated
          if (payload.new && 'points' in payload.new) {
            setUserPoints(payload.new.points as number);
          }
        }
      )
      .subscribe();

    // Subscribe to point transactions to know when new points are added
    const transactionsChannel = supabase
      .channel('point-transactions')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public',
          table: 'point_transactions',
          filter: `user_id_point=eq.${user.id}`  // Using the correct column name here
        }, 
        () => {
          // When a new transaction is added, refresh the points
          fetchUserPoints();
        }
      )
      .subscribe();

    // Fetch initial points
    fetchUserPoints();

    return () => {
      // Clean up subscriptions
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [user]); 

  // Also fetch points when userProfile changes
  useEffect(() => {
    if (user && userProfile) {
      console.log("PointsProvider: Profile updated, refreshing points");
      fetchUserPoints();
    }
  }, [userProfile]);

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
