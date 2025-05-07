
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transaction } from '@/types/transactions';

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      console.log("Fetching transactions for user:", userId);
      
      // First fetch the standard point transactions
      const { data: pointTransactions, error } = await supabase
        .from("point_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching point transactions:", error);
        toast.error("Failed to load transactions");
        setTransactions([]);
        return;
      }
      
      // Fetch redemption requests with their status and item names
      const { data: redemptionRequests, error: redemptionError } = await supabase
        .from("redemption_requests")
        .select(`
          *,
          redemption_items(name)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (redemptionError) {
        console.error("Error fetching redemption requests:", redemptionError);
        toast.error("Failed to load redemption requests");
      }

      console.log("Raw transactions fetched:", pointTransactions);
      console.log("Redemption requests fetched:", redemptionRequests);
      
      if ((!pointTransactions || pointTransactions.length === 0) && 
          (!redemptionRequests || redemptionRequests.length === 0)) {
        console.log("No transactions or redemptions found");
        setTransactions([]);
        setLoading(false);
        return;
      }
      
      // Process transactions to extract source and item information
      const parsedPointTransactions = await Promise.all((pointTransactions || []).map(async (row) => {
        let cleanDescription = row.description;
        let source: string | undefined = undefined;
        let itemId: string | undefined = undefined;
        let itemName: string | undefined = undefined;
        
        // Enhanced regex to better extract mission information
        // This ensures we properly identify and extract mission rewards
        const sourceMatch = row.description.match(/\[(.*?)(?::([^\]]+))?\]$/);
        if (sourceMatch) {
          source = sourceMatch[1];
          itemId = sourceMatch[2];
          cleanDescription = row.description.replace(/\s*\[.*?\]$/, '').trim();
          
          // Enhance mission-related information extraction
          if (source === 'MISSION_REVIEW' || source === 'RECEIPT_SUBMISSION') {
            // Extract mission name if available in the description
            const missionMatch = cleanDescription.match(/Earned from (.*?) mission$/);
            if (missionMatch) {
              itemName = missionMatch[1];
            }
          }
        }
        
        // Add specific extraction for mission rewards that may have a different format
        if (!source && cleanDescription.includes('mission')) {
          source = cleanDescription.includes('review') ? 'MISSION_REVIEW' : 'RECEIPT_SUBMISSION';
        }
        
        // Fetch item name for redemption transactions
        if (source === 'REDEMPTION' && itemId) {
          try {
            const { data: itemData } = await supabase
              .from('redemption_items')
              .select('name')
              .eq('id', itemId)
              .single();
              
            if (itemData) {
              itemName = itemData.name;
              console.log(`Found item name for ${itemId}: ${itemName}`);
            }
          } catch (err) {
            console.error(`Error fetching item name for ${itemId}:`, err);
          }
        }

        return {
          id: row.id,
          description: cleanDescription,
          amount: row.amount,
          type: row.type as Transaction["type"],
          createdAt: row.created_at,
          source,
          itemName,
          redemptionStatus: undefined
        };
      }));
      
      // Process redemption requests into transaction format
      const parsedRedemptionRequests = (redemptionRequests || []).map(request => {
        const itemName = request.redemption_items?.name;
        return {
          id: request.id,
          description: `Redeemed: ${itemName || 'Reward item'}`,
          amount: request.points_amount,
          type: "REDEEMED" as Transaction["type"],
          createdAt: request.created_at,
          source: "REDEMPTION",
          itemName: itemName,
          redemptionStatus: request.status
        };
      });
      
      // Combine both types of transactions
      const allTransactions = [...parsedPointTransactions, ...parsedRedemptionRequests];
      
      // Sort by date (newest first)
      allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
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
