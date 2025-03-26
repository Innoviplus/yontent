
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export const useMissionsAdmin = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedMissions: Mission[] = data.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        pointsReward: mission.points_reward,
        type: mission.type as 'REVIEW' | 'RECEIPT',
        status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
        merchantName: mission.merchant_name || undefined,
        merchantLogo: mission.merchant_logo || undefined,
        bannerImage: mission.banner_image || undefined,
        maxSubmissionsPerUser: mission.max_submissions_per_user || 1,
        termsConditions: mission.terms_conditions || undefined,
        requirementDescription: mission.requirement_description || undefined,
        startDate: new Date(mission.start_date),
        expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
        createdAt: new Date(mission.created_at),
        updatedAt: new Date(mission.updated_at)
      }));

      setMissions(formattedMissions);
    } catch (error: any) {
      console.error('Error fetching missions:', error.message);
      toast.error('Failed to load missions');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMissions = async () => {
    setIsRefreshing(true);
    await fetchMissions();
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Ensure the storage bucket exists
    ensureMissionsStorageBucketExists();
    fetchMissions();
  }, []);

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

  const addMission = async (missionData: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase.from('missions').insert({
        title: missionData.title,
        description: missionData.description,
        points_reward: missionData.pointsReward,
        type: missionData.type,
        status: missionData.status,
        merchant_name: missionData.merchantName,
        merchant_logo: missionData.merchantLogo,
        banner_image: missionData.bannerImage,
        max_submissions_per_user: missionData.maxSubmissionsPerUser,
        terms_conditions: missionData.termsConditions,
        requirement_description: missionData.requirementDescription,
        start_date: missionData.startDate.toISOString(),
        expires_at: missionData.expiresAt ? missionData.expiresAt.toISOString() : null
      });

      if (error) {
        throw error;
      }

      toast.success("Mission added successfully");
      await refreshMissions();
      return true;
    } catch (error: any) {
      console.error('Error adding mission:', error.message);
      toast.error('Failed to add mission');
      return false;
    }
  };

  const updateMission = async (id: string, updates: Partial<Mission>) => {
    try {
      // Convert from client schema to database schema
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.pointsReward !== undefined) dbUpdates.points_reward = updates.pointsReward;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.merchantName !== undefined) dbUpdates.merchant_name = updates.merchantName;
      if (updates.merchantLogo !== undefined) dbUpdates.merchant_logo = updates.merchantLogo;
      if (updates.bannerImage !== undefined) dbUpdates.banner_image = updates.bannerImage;
      if (updates.maxSubmissionsPerUser !== undefined) dbUpdates.max_submissions_per_user = updates.maxSubmissionsPerUser;
      if (updates.termsConditions !== undefined) dbUpdates.terms_conditions = updates.termsConditions;
      if (updates.requirementDescription !== undefined) dbUpdates.requirement_description = updates.requirementDescription;
      if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate.toISOString();
      if (updates.expiresAt !== undefined) dbUpdates.expires_at = updates.expiresAt ? updates.expiresAt.toISOString() : null;

      const { error } = await supabase
        .from('missions')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success("Mission updated successfully");
      await refreshMissions();
      return true;
    } catch (error: any) {
      console.error('Error updating mission:', error.message);
      toast.error('Failed to update mission');
      return false;
    }
  };

  const deleteMission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success("Mission deleted successfully");
      setMissions(missions.filter(mission => mission.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting mission:', error.message);
      toast.error('Failed to delete mission');
      return false;
    }
  };

  return {
    missions,
    isLoading,
    isRefreshing,
    refreshMissions,
    addMission,
    updateMission,
    deleteMission
  };
};
