
import { supabase } from '@/integrations/supabase/client';
import { deductPointsFromUser } from '@/hooks/admin/utils/points';
import { toast } from 'sonner';

// Create a new redemption request
export const createRedemptionRequest = async ({
  userId,
  itemId,
  pointsAmount,
  paymentDetails = null
}: {
  userId: string;
  itemId: string;
  pointsAmount: number;
  paymentDetails?: any;
}) => {
  try {
    console.log('Creating redemption request:', { userId, itemId, pointsAmount });
    
    // Get the user's username from the profiles table
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
    }
    
    const { data: itemData, error: itemError } = await supabase
      .from('redemption_items')
      .select('name')
      .eq('id', itemId)
      .single();
      
    if (itemError) {
      console.error('Error fetching item data:', itemError);
    }
    
    const username = userData?.username || null;
    const itemName = itemData?.name || `Item ${itemId}`;
    
    // First deduct points from the user's account
    const deductResult = await deductPointsFromUser(
      userId, 
      pointsAmount,
      'REDEMPTION',
      `Redeemed: ${itemName}`, // Include the item name in the transaction description
      itemId
    );
    
    if (!deductResult.success) {
      throw new Error(deductResult.error || 'Failed to deduct points');
    }
    
    // Then create the redemption request record
    const { data, error } = await supabase
      .from('redemption_requests')
      .insert({
        user_id: userId,
        item_id: itemId,
        points_amount: pointsAmount,
        status: 'PENDING',
        payment_details: paymentDetails,
        username: username
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating redemption request:', error);
      throw error;
    }
    
    return { 
      success: true, 
      requestId: data.id,
      message: 'Redemption request created successfully' 
    };
  } catch (error: any) {
    console.error('Error in createRedemptionRequest:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred while creating your redemption request' 
    };
  }
};
