import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/lib/types";
import { toast } from "sonner";

/**
 * Fetches all active missions
 */
export const fetchActiveMissions = async (): Promise<Mission[]> => {
  try {
    console.log('Fetching active missions');
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('No missions found in database');
    } else {
      console.log(`Found ${data.length} missions in database`);
    }

    const missions = data.map(mission => ({
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

    console.log('Transformed missions:', missions);

    return missions;
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

/**
 * Update a mission's expiry date
 */
export const updateMissionExpiryDate = async (
  missionId: string,
  expiryDate: Date
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('missions')
      .update({
        expires_at: expiryDate.toISOString()
      })
      .eq('id', missionId);

    if (error) {
      throw error;
    }

    toast.success("Mission expiry date updated successfully");
    return true;
  } catch (error: any) {
    console.error("Error updating mission expiry date:", error.message);
    toast.error("Failed to update mission expiry date");
    return false;
  }
};

// Execute the update for "Review ITOEN" mission
// This will run when the file is loaded/imported
(async () => {
  try {
    // Get all missions to debug
    const { data: allMissions, error: listError } = await supabase
      .from('missions')
      .select('id, title, status');
    
    if (listError) {
      console.error("Error listing all missions:", listError.message);
    } else {
      console.log("All missions in database:", allMissions);
    }
    
    // Get the mission ID for "Review ITOEN"
    const { data, error } = await supabase
      .from('missions')
      .select('id, title, status, expires_at')
      .eq('title', 'Review ITOEN')
      .single();

    if (error) {
      console.error("Error finding the Review ITOEN mission:", error.message);
      
      // Try creating a test mission if none exists
      if (error.code === 'PGRST116') { // No rows returned
        const { data: newData, error: createError } = await supabase
          .from('missions')
          .insert({
            title: 'Review ITOEN',
            description: 'Write a review about ITOEN products',
            points_reward: 100,
            type: 'REVIEW',
            status: 'ACTIVE',
            start_date: new Date().toISOString(),
            expires_at: new Date('2025-03-26T23:59:59').toISOString()
          })
          .select();
          
        if (createError) {
          console.error("Error creating test mission:", createError.message);
        } else {
          console.log("Created test mission:", newData);
        }
      }
      return;
    }

    console.log("Found mission:", data);

    if (data) {
      // Set expiry date to March 26, 2025
      const newExpiryDate = new Date('2025-03-26T23:59:59');
      const success = await updateMissionExpiryDate(data.id, newExpiryDate);
      
      if (success) {
        console.log("Successfully updated Review ITOEN mission expiry date to:", newExpiryDate.toISOString());
      }
    }
  } catch (err) {
    console.error("Unexpected error updating mission expiry date:", err);
  }
})();
