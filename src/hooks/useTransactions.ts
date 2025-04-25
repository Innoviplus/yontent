
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
      const { data, error } = await supabase
        .from("point_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
        setTransactions([]);
        return;
      }
      
      if (!data || data.length === 0) {
        console.log("No transactions found");
        setTransactions([]);
        setLoading(false);
        return;
      }
      
      console.log("Raw transactions fetched:", data);
      
      // Process transactions to extract source and item information
      const parsedTransactions = await Promise.all(data.map(async (row) => {
        let cleanDescription = row.description;
        let source: string | undefined = undefined;
        let itemId: string | undefined = undefined;
        let itemName: string | undefined = undefined;
        
        const sourceMatch = row.description.match(/\[(.*?)(?::([^\]]+))?\]$/);
        if (sourceMatch) {
          source = sourceMatch[1];
          itemId = sourceMatch[2];
          cleanDescription = row.description.replace(/\s*\[.*?\]$/, '').trim();
        }
        
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
          itemName
        };
      }));
      
      console.log("Processed transactions:", parsedTransactions);
      setTransactions(parsedTransactions);
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
