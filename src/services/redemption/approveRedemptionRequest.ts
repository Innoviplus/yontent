
import { supabase } from "@/integrations/supabase/client";

// Approve a redemption request
export const approveRedemptionRequest = async (
  requestId: string
): Promise<boolean> => {
  try {
    console.log('Approving redemption request with ID:', requestId);
    
    // First, verify that the request exists and isn't already approved
    const { data: checkData, error: checkError } = await supabase
      .from('redemption_requests')
      .select('status')
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
    
    // Use a simpler update approach without returning data in the same call
    const { error } = await supabase
      .from('redemption_requests')
      .update({ 
        status: 'APPROVED',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    if (error) {
      console.error("Error approving redemption request:", error);
      throw error;
    }
    
    // Verify the update was successful by making a separate query
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
      console.error("Status not updated correctly:", verifyData.status);
      return false;
    }
    
    console.log('Successfully approved request:', requestId);
    return true;
  } catch (error) {
    console.error("Error approving redemption request:", error);
    return false;
  }
};
