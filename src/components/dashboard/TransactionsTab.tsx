
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const TransactionsTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transactions
  const { data: transactions, error } = useQuery({
    queryKey: ['user-transactions', user?.id],
    queryFn: async () => {
      setIsLoading(true);
      
      // Fetch all transactions including welcome bonus
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      setIsLoading(false);
      
      if (error) throw error;
      
      console.log('Transactions from database:', data);
      
      // Transform the data to match our expected format
      return (data || []).map(item => {
        // Try to extract source from description [SOURCE:ID] or [SOURCE]
        let source: 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT' = 'ADMIN_ADJUSTMENT';
        let sourceId: string | undefined;
        let cleanDescription = item.description;
        
        const sourceMatch = item.description.match(/\[(.*?)(?::([^\]]+))?\]$/);
        if (sourceMatch) {
          const extractedSource = sourceMatch[1];
          if (
            extractedSource === 'MISSION_REVIEW' || 
            extractedSource === 'RECEIPT_SUBMISSION' || 
            extractedSource === 'REDEMPTION' || 
            extractedSource === 'ADMIN_ADJUSTMENT'
          ) {
            source = extractedSource as any;
          }
          
          sourceId = sourceMatch[2];
          
          // Remove the source tag from the description
          cleanDescription = item.description.replace(/\s*\[.*?\]$/, '').trim();
        }
        
        return {
          id: item.id,
          userId: item.user_id,
          amount: item.amount,
          type: item.type,
          source,
          description: cleanDescription || '',
          createdAt: new Date(item.created_at)
        };
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
            {transaction.source === 'ADMIN_ADJUSTMENT' && (
              <span className="text-xs text-gray-500">Manual adjustment by admin</span>
            )}
          </div>
          
          <div className={`font-semibold ${transaction.type === 'EARNED' || transaction.type === 'WELCOME' || transaction.type === 'ADJUSTED' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'EARNED' || transaction.type === 'WELCOME' || transaction.type === 'ADJUSTED' ? '+' : '-'}
            {transaction.amount} points
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsTab;
