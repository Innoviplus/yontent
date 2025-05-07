
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
    const { error } = await supabase
      .from('mission_participations')
      .insert({
        mission_id: missionId,
        user_id_p: userId,
        status: 'PENDING',
        submission_data: {
          receipt_images: receiptImages,
          submission_type: 'RECEIPT'
        }
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error submitting mission receipt:", error.message);
    toast.error("Failed to submit receipt");
    return false;
  }
};
