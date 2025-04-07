
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { PointTransaction } from '@/lib/types';

const TransactionsTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Add a welcome bonus transaction
  const addWelcomeBonus = async (userId: string) => {
    const { data: existingBonus } = await supabase
      .from('point_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('description', 'Welcome Bonus')
      .single();

    if (!existingBonus) {
      await supabase
        .from('point_transactions')
        .insert({
          user_id: userId,
          amount: 10,
          type: 'WELCOME',
          description: 'Welcome Bonus'
        });
    }
  };

  // Fetch transactions
  const { data: transactions, error } = useQuery({
    queryKey: ['user-transactions', user?.id],
    queryFn: async () => {
      setIsLoading(true);
      
      // First ensure welcome bonus exists
      if (user?.id) {
        await addWelcomeBonus(user.id);
      }
      
      // Then fetch all transactions
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      setIsLoading(false);
      
      if (error) throw error;
      
      // Transform the data to match the PointTransaction interface
      return (data || []).map(item => {
        // Create a transaction object with default values for missing properties
        const transaction: PointTransaction = {
          id: item.id,
          userId: item.user_id,
          amount: item.amount,
          type: (item.type || 'EARNED') as 'EARNED' | 'REDEEMED' | 'REFUNDED' | 'ADJUSTED' | 'WELCOME',
          source: 'ADMIN_ADJUSTMENT', // Default value since it doesn't exist in database
          sourceId: undefined,  // Default to undefined as it's optional
          description: item.description || '',
          createdAt: new Date(item.created_at)
        };
        
        return transaction;
      });
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading transactions</p>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">No transactions found.</p>
    );
  }

  return (
    <div className="space-y-4">
      {transactions && transactions.map((transaction) => (
        <div 
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
        >
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{transaction.description}</span>
            <span className="text-sm text-gray-500">
              {format(transaction.createdAt, 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className={`font-semibold ${transaction.type === 'EARNED' || transaction.type === 'WELCOME' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'EARNED' || transaction.type === 'WELCOME' ? '+' : '-'}
            {transaction.amount} points
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsTab;
