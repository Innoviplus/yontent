
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/lib/types";
import { toast } from "sonner";

/**
 * Fetches all active missions
 */
export const fetchActiveMissions = async (): Promise<Mission[]> => {
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mission => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      pointsReward: mission.points_reward,
      type: mission.type as 'REVIEW' | 'RECEIPT',
      status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
      merchantName: mission.merchant_name || undefined,
      merchantLogo: mission.merchant_logo || undefined,
      bannerImage: mission.banner_image || undefined,
      maxSubmissionsPerUser: mission.max_submissions_per_user,
      termsConditions: mission.terms_conditions || undefined,
      requirementDescription: mission.requirement_description || undefined,
      startDate: new Date(mission.start_date),
      expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at)
    }));
  } catch (error: any) {
    console.error("Error fetching missions:", error.message);
    toast.error("Failed to load missions");
    return [];
  }
};

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
        user_id: userId,
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

/**
 * Create a Supabase storage bucket for missions if it doesn't exist
 */
export const ensureMissionStorageBucketExists = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const missionBucketExists = buckets?.some(bucket => bucket.name === 'missions');
    
    if (!missionBucketExists) {
      // Create the bucket for mission receipts
      const { error } = await supabase.storage.createBucket('missions', {
        public: true
      });
      
      if (error) {
        console.error("Error creating missions bucket:", error);
      }
    }
  } catch (error) {
    console.error("Error checking/creating mission storage bucket:", error);
  }
};

// Create a function to be called when the app initializes
export const initializeMissionService = () => {
  ensureMissionStorageBucketExists();
};
