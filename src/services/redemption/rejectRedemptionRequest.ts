
import { supabase } from "@/integrations/supabase/client";

// Reject a redemption request
export const rejectRedemptionRequest = async (
  requestId: string,
  adminNotes?: string
): Promise<boolean> => {
  try {
    console.log('Rejecting redemption request with ID:', requestId);
    
    // First, verify that the request exists and isn't already rejected
    const { data: checkData, error: checkError } = await supabase
      .from('redemption_requests')
      .select('status')
      .eq('id', requestId)
      .single();
    
    if (checkError || !checkData) {
      console.error("Error checking redemption request:", checkError || "Request not found");
      return false;
    }
    
    if (checkData.status === 'REJECTED') {
      console.log("Request already rejected:", requestId);
      return true; // Already rejected, consider it a success
    }
    
    // Begin transaction by updating the status
    console.log('Updating redemption request status to REJECTED...');
    
    const { error: updateError } = await supabase
      .from('redemption_requests')
      .update({ 
        status: 'REJECTED',
        admin_notes: adminNotes || "Request rejected by admin",
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    if (updateError) {
      console.error("Error rejecting redemption request:", updateError);
      return false;
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
    
    // Check if the status is now REJECTED
    if (verifyData.status !== 'REJECTED') {
      console.error("Status not updated correctly. Current status:", verifyData.status);
      return false;
    }
    
    console.log('Successfully rejected request:', requestId);
    return true;
  } catch (error) {
    console.error("Error in rejectRedemptionRequest:", error);
    return false;
  }
};
