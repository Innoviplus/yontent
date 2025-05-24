
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Submit a receipt for a mission
 */
export const submitMissionReceipt = async (
  userId: string,
  missionId: string,
  receiptImages: string[]
): Promise<boolean> => {
  try {
    // Check if user already has a participation record for this mission
    const { data: existingParticipation, error: checkError } = await supabase
      .from('mission_participations')
      .select('id, status')
      .eq('mission_id', missionId)
      .eq('user_id_p', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    const submissionData = {
      receipt_images: receiptImages,
      submission_type: 'RECEIPT'
    };

    if (existingParticipation) {
      // Update existing participation record
      const { error: updateError } = await supabase
        .from('mission_participations')
        .update({
          status: 'PENDING',
          submission_data: submissionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingParticipation.id);
        
      if (updateError) throw updateError;
    } else {
      // Create new participation record
      const { error: insertError } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: missionId,
          user_id_p: userId,
          status: 'PENDING',
          submission_data: submissionData
        });
        
      if (insertError) throw insertError;
    }

    return true;
  } catch (error: any) {
    console.error("Error submitting mission receipt:", error.message);
    toast.error("Failed to submit receipt");
    return false;
  }
};
