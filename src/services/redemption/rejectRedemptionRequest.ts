
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
    
    // Update the status to REJECTED
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
    
    console.log('Successfully rejected request:', requestId);
    return true;
  } catch (error) {
    console.error("Error in rejectRedemptionRequest:", error);
    return false;
  }
};
