
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function usePointsData() {
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
        .maybeSingle();

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

  useEffect(() => {
    fetchUserPoints();
  }, [user]);

  return {
    userPoints,
    isLoading,
    refreshPoints: fetchUserPoints
  };
}
