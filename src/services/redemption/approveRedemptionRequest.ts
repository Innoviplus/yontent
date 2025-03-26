
import { supabase } from "@/integrations/supabase/client";
import { deductPointsFromUser } from "@/hooks/admin/utils/points/deductPoints";

// Approve a redemption request
export const approveRedemptionRequest = async (
  requestId: string
): Promise<boolean> => {
  try {
    console.log('Approving redemption request with ID:', requestId);
    
    // First, verify that the request exists and isn't already approved
    const { data: checkData, error: checkError } = await supabase
      .from('redemption_requests')
      .select('status, user_id, points_amount, redemption_type, payment_details')
      .eq('id', requestId)
      .single();
    
    if (checkError || !checkData) {
      console.error("Error checking redemption request:", checkError || "Request not found");
      return false;
    }
    
    if (checkData.status === 'APPROVED') {
      console.log("Request already approved:", requestId);
      return true; // Already approved, consider it a success
    }
    
    // Begin transaction by updating the status
    console.log('Updating redemption request status to APPROVED...');
    
    const updatePromise = supabase
      .from('redemption_requests')
      .update({ 
        status: 'APPROVED',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    const { error: updateError } = await updatePromise;
    
    if (updateError) {
      console.error("Error approving redemption request:", updateError);
      throw updateError;
    }
    
    // Verify the update was successful with a separate query
    console.log('Verifying status update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('redemption_requests')
      .select('status')
      .eq('id', requestId)
      .single();
      
    if (verifyError) {
      console.error("Error verifying update:", verifyError);
      return false;
    }
    
    console.log('Verification response:', verifyData);
    
    // Check if the status is now APPROVED
    if (verifyData.status !== 'APPROVED') {
      console.error("Status not updated correctly. Current status:", verifyData.status);
      return false;
    }
    
    // Record the transaction in point_transactions
    if (checkData.user_id && checkData.points_amount > 0) {
      const rewardName = checkData.payment_details?.reward_name || 'Points Redemption';
      const description = `Redemption approved: ${rewardName}`;
      
      console.log(`Recording transaction for user ${checkData.user_id}: ${description}`);
      
      // Use the deductPointsFromUser utility to handle the points transaction
      const { success: pointsDeducted } = await deductPointsFromUser(
        checkData.user_id,
        checkData.points_amount,
        'REDEMPTION',
        description,
        requestId
      );
      
      if (!pointsDeducted) {
        console.warn(`Points transaction not recorded for redemption ${requestId}, but approval succeeded`);
      }
    }
    
    console.log('Successfully approved request:', requestId);
    return true;
  } catch (error) {
    console.error("Error in approveRedemptionRequest:", error);
    return false;
  }
};
