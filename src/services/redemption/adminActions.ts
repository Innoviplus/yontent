
import { supabase } from '@/integrations/supabase/client';

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
      `Refund: ${itemName}`,
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
