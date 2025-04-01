
import { supabase } from "@/integrations/supabase/client";

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

// Function to be called when the app initializes
export const initializeMissionService = () => {
  ensureMissionStorageBucketExists();
};
