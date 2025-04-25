
import { RedemptionItem } from '@/types/redemption';
import { getRedemptionItems, getRedeemedPoints } from './redemption';
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
      `Redemption: ${itemName}`, // Include the item name for clarity
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
        username: username // Add the username to the request
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

// Get all redemption requests for a user
export const getUserRedemptionRequests = async (userId: string, page = 1, limit = 10) => {
  try {
    const { data, error, count } = await supabase
      .from('redemption_requests')
      .select('*, item:item_id(name)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
      
    if (error) {
      throw error;
    }
    
    return { 
      requests: data || [], 
      totalCount: count || 0 
    };
  } catch (error) {
    console.error('Error getting user redemption requests:', error);
    return { requests: [], totalCount: 0 };
  }
};

// Approve a redemption request (admin function)
export const approveRedemptionRequest = async (requestId: string) => {
  try {
    // Update the request status to APPROVED
    const { data, error } = await supabase
      .from('redemption_requests')
      .update({ status: 'APPROVED' })
      .eq('id', requestId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      request: data,
      message: 'Redemption request approved successfully' 
    };
  } catch (error: any) {
    console.error('Error approving redemption request:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred while approving the redemption request' 
    };
  }
};

// Reject a redemption request and return points to the user (admin function)
export const rejectRedemptionRequest = async (requestId: string) => {
  try {
    // Get the request details
    const { data: request, error: requestError } = await supabase
      .from('redemption_requests')
      .select('user_id, points_amount, status, item_id')
      .eq('id', requestId)
      .single();
      
    if (requestError) {
      throw requestError;
    }
    
    // Ensure request is in PENDING status
    if (request.status !== 'PENDING') {
      throw new Error(`Cannot reject request with status ${request.status}`);
    }
    
    // Get item name for the refund description
    const { data: itemData } = await supabase
      .from('redemption_items')
      .select('name')
      .eq('id', request.item_id)
      .single();
      
    const itemName = itemData?.name || `Item ${request.item_id}`;
    
    // Return points to user
    const { returnPointsToUser } = await import('@/hooks/admin/utils/points');
    
    const refundResult = await returnPointsToUser(
      request.user_id, 
      request.points_amount, 
      `Refund: ${itemName}`, // Include the item name for clarity
      request.item_id
    );
    
    if (!refundResult.success) {
      throw new Error(refundResult.error || 'Failed to return points to user');
    }
    
    // Update request status to REJECTED
    const { data, error } = await supabase
      .from('redemption_requests')
      .update({ status: 'REJECTED' })
      .eq('id', requestId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { 
      success: true, 
      request: data,
      message: 'Redemption request rejected and points returned to user' 
    };
  } catch (error: any) {
    console.error('Error rejecting redemption request:', error);
    return { 
      success: false, 
      message: error.message || 'An error occurred while rejecting the redemption request' 
    };
  }
};

export {
  getRedemptionItems,
  getRedeemedPoints
};
