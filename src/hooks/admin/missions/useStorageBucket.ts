
import { supabase } from '@/integrations/supabase/client';

export const useStorageBucket = () => {
  const ensureMissionsStorageBucketExists = async () => {
    try {
      // Check if the bucket already exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const missionBucketExists = buckets?.some(bucket => bucket.name === 'missions');
      
      if (!missionBucketExists) {
        // Create the bucket for mission images
        const { error } = await supabase.storage.createBucket('missions', {
          public: true
        });
        
        if (error) {
          console.error("Error creating missions bucket:", error);
        } else {
          console.log("Missions storage bucket created successfully");
        }
      }
    } catch (error) {
      console.error("Error checking/creating mission storage bucket:", error);
    }
  };

  return {
    ensureMissionsStorageBucketExists
  };
};
