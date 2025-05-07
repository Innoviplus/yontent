
import { Transaction } from '@/types/transactions';
import { supabase } from '@/integrations/supabase/client';

/**
 * Extracts source information from transaction description
 */
export const extractTransactionSource = (description: string) => {
  let cleanDescription = description;
  let source: string | undefined = undefined;
  let itemId: string | undefined = undefined;
  
  const sourceMatch = description.match(/\[(.*?)(?::([^\]]+))?\]$/);
  if (sourceMatch) {
    source = sourceMatch[1];
    itemId = sourceMatch[2];
    cleanDescription = description.replace(/\s*\[.*?\]$/, '').trim();
  }
  
  // Check for mission rewards that don't follow the tagging pattern
  if (!sourceMatch && cleanDescription.toLowerCase().includes('mission')) {
    source = cleanDescription.toLowerCase().includes('review') 
      ? 'MISSION_REVIEW' 
      : 'RECEIPT_SUBMISSION';
  }
  
  return { cleanDescription, source, itemId };
};

/**
 * Processes raw point transactions to extract source and item information
 */
export const processPointTransactions = async (pointTransactions: any[]) => {
  return await Promise.all(pointTransactions.map(async (row) => {
    const { cleanDescription, source, itemId } = extractTransactionSource(row.description);
    
    let itemName: string | undefined = undefined;
    
    // Extract mission name if available in the description
    if (source === 'MISSION_REVIEW' || source === 'RECEIPT_SUBMISSION') {
      const missionMatch = cleanDescription.match(/Earned from (.*?) mission$/);
      if (missionMatch) {
        itemName = missionMatch[1];
      }
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
};

/**
 * Processes redemption requests into transaction format
 */
export const processRedemptionRequests = (redemptionRequests: any[]) => {
  return (redemptionRequests || []).map(request => {
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
};

/**
 * Combines and sorts transactions from different sources
 */
export const combineAndSortTransactions = (transactions: Transaction[]) => {
  // Sort by date (newest first)
  return transactions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
