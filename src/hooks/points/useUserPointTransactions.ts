
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: Date;
}

export function useUserPointTransactions() {
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('point_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user point transactions:', error);
          return;
        }
        
        // Transform the data to match our interface
        const formattedTransactions: PointTransaction[] = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          amount: item.amount,
          type: item.type,
          description: item.description,
          createdAt: new Date(item.created_at)
        }));
        
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error fetching user point transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return {
    transactions,
    isLoading,
  };
}
