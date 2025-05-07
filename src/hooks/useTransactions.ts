
import { useState } from 'react';
import { toast } from 'sonner';
import { Transaction } from '@/types/transactions';
import { 
  fetchPointTransactions, 
  fetchRedemptionRequests 
} from '@/services/transactions/transactionsService';
import { 
  processPointTransactions, 
  processRedemptionRequests, 
  combineAndSortTransactions 
} from '@/services/transactions/transactionTransformer';

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch data from API
      const pointTransactions = await fetchPointTransactions(userId);
      const redemptionRequests = await fetchRedemptionRequests(userId);
      
      console.log("Raw transactions fetched:", pointTransactions);
      console.log("Redemption requests fetched:", redemptionRequests);
      
      if (pointTransactions.length === 0 && redemptionRequests.length === 0) {
        console.log("No transactions or redemptions found");
        setTransactions([]);
        setLoading(false);
        return;
      }
      
      // Process the data
      const parsedPointTransactions = await processPointTransactions(pointTransactions);
      const parsedRedemptionRequests = processRedemptionRequests(redemptionRequests);
      
      // Combine and sort
      const allTransactions = combineAndSortTransactions([
        ...parsedPointTransactions, 
        ...parsedRedemptionRequests
      ]);
      
      console.log("Processed transactions:", allTransactions);
      setTransactions(allTransactions);
    } catch (err) {
      console.error("Unexpected error fetching transactions:", err);
      toast.error("An error occurred while loading transactions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return { transactions, loading, refreshing, setRefreshing, fetchTransactions };
};
