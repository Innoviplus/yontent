
import { supabase } from "@/integrations/supabase/client";
import { deductPointsFromUser } from "@/hooks/admin/utils/points/deductPoints";

// Function to approve the latest pending redemption request
export const approveLatestPendingRequest = async (): Promise<boolean> => {
  try {
    console.log('Finding and approving the latest pending redemption request...');
    
    // First, find the latest pending request
    const { data: latestPendingRequest, error: findError } = await supabase
      .from('redemption_requests')
      .select('id, user_id, points_amount, redemption_type, payment_details')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (findError || !latestPendingRequest) {
      console.error("Error finding latest pending request:", findError || "No pending requests found");
      return false;
    }
    
    console.log('Found latest pending request:', latestPendingRequest);
    
    // Update the status to APPROVED
    const { error: updateError } = await supabase
      .from('redemption_requests')
      .update({ 
        status: 'APPROVED',
        updated_at: new Date().toISOString()
      })
      .eq('id', latestPendingRequest.id);
    
    if (updateError) {
      console.error("Error approving redemption request:", updateError);
      return false;
    }
    
    console.log('Successfully approved request:', latestPendingRequest.id);
    
    // Record the transaction in point_transactions
    if (latestPendingRequest.user_id && latestPendingRequest.points_amount > 0) {
      // Safely extract reward_name from payment_details
      let rewardName = 'Points Redemption';
      
      // Check if payment_details exists and is an object
      if (latestPendingRequest.payment_details && typeof latestPendingRequest.payment_details === 'object') {
        // Access reward_name safely with typecasting
        const paymentDetails = latestPendingRequest.payment_details as Record<string, any>;
        if (paymentDetails.reward_name) {
          rewardName = paymentDetails.reward_name as string;
        }
      }
      
      const description = `Redemption approved: ${rewardName}`;
      
      console.log(`Recording transaction for user ${latestPendingRequest.user_id}: ${description}`);
      
      // Use the deductPointsFromUser utility to handle the points transaction
      const { success: pointsDeducted } = await deductPointsFromUser(
        latestPendingRequest.user_id,
        latestPendingRequest.points_amount,
        'REDEMPTION',
        description,
        latestPendingRequest.id
      );
      
      if (!pointsDeducted) {
        console.warn(`Points transaction not recorded for redemption ${latestPendingRequest.id}, but approval succeeded`);
      }
    }
    
    // Execute the function immediately upon import
    return true;
  } catch (error) {
    console.error("Error in approveLatestPendingRequest:", error);
    return false;
  }
};

// Run the function immediately to approve the latest pending request
approveLatestPendingRequest().then(success => {
  if (success) {
    console.log("✅ Latest pending redemption request has been approved");
  } else {
    console.error("❌ Failed to approve latest pending redemption request");
  }
});
