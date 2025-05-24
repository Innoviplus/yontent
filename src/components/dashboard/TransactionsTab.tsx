
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
      
      try {
        console.log("TransactionsTab: Fetching transactions for user:", user?.id);
        
        // Fetch all transactions including redemptions
        const { data, error } = await supabase
          .from('point_transactions')
          .select('*')
          .eq('user_id_point', user?.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("TransactionsTab: Error fetching transactions:", error);
          throw error;
        }
        
        console.log('TransactionsTab: Transactions from database:', data);
        
        // Transform the data to match our expected format
        const processedTransactions = (data || []).map(item => {
          // Try to extract source from description [SOURCE:ID] or [SOURCE]
          let source: 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT' = 'ADMIN_ADJUSTMENT';
          let sourceId: string | undefined = undefined;
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
          
          // Check for mission rewards that don't follow the tagging pattern
          if (!sourceMatch && cleanDescription.toLowerCase().includes('mission')) {
            source = cleanDescription.toLowerCase().includes('review') 
              ? 'MISSION_REVIEW' 
              : 'RECEIPT_SUBMISSION';
          }
          
          return {
            id: item.id,
            userId: item.user_id_point,
            amount: item.amount,
            type: item.type,
            source,
            description: cleanDescription || '',
            createdAt: new Date(item.created_at)
          };
        });
        
        console.log('TransactionsTab: Processed transactions:', processedTransactions);
        setIsLoading(false);
        return processedTransactions;
      } catch (error) {
        console.error('TransactionsTab: Error in transaction processing:', error);
        setIsLoading(false);
        throw error;
      }
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
            {transaction.source === 'MISSION_REVIEW' && (
              <span className="text-xs text-green-600">Mission review reward</span>
            )}
            {transaction.source === 'RECEIPT_SUBMISSION' && (
              <span className="text-xs text-green-600">Mission receipt submission reward</span>
            )}
            {transaction.source === 'REDEMPTION' && (
              <span className="text-xs text-orange-600">Points redeemed for reward</span>
            )}
            {transaction.source === 'ADMIN_ADJUSTMENT' && (
              <span className="text-xs text-gray-500">Manual adjustment by admin</span>
            )}
          </div>
          
          <div className={`font-semibold ${
            transaction.type === 'REDEEMED' ? 'text-red-600' : 
            transaction.type === 'EARNED' || transaction.type === 'ADJUSTED' ? 'text-green-600' : 
            'text-red-600'
          }`}>
            {transaction.type === 'EARNED' || transaction.type === 'ADJUSTED' ? '+' : '-'}
            {transaction.amount} points
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsTab;
