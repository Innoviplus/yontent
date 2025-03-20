
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MissionFormData } from '@/lib/types';

export const useMissionSave = (id: string | undefined) => {
  const [savingMission, setSavingMission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!id;

  const saveMission = async (formData: MissionFormData, isLoggedIn: boolean) => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to create or edit missions');
      return false;
    }
    
    try {
      setSavingMission(true);
      setError(null);
      
      const missionData = {
        title: formData.title,
        description: formData.description,
        requirement_description: formData.requirementDescription,
        points_reward: formData.pointsReward,
        type: formData.type,
        status: formData.status,
        merchant_name: formData.merchantName || null,
        merchant_logo: formData.merchantLogo || null,
        banner_image: formData.bannerImage || null,
        max_submissions_per_user: formData.maxSubmissionsPerUser || 1,
        terms_conditions: formData.termsConditions || null,
        start_date: formData.startDate.toISOString(),
        expires_at: formData.expiresAt ? formData.expiresAt.toISOString() : null,
      };
      
      console.log('Saving mission with data:', missionData);
      
      let result;
      
      if (isEditMode) {
        result = await supabase
          .from('missions')
          .update(missionData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('missions')
          .insert([missionData]);
      }
      
      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }
      
      console.log('Mission saved successfully:', result);
      toast.success(`Mission ${isEditMode ? 'updated' : 'created'} successfully!`);
      return true;
    } catch (error: any) {
      console.error('Error saving mission:', error);
      setError(error.message);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} mission: ${error.message}`);
      return false;
    } finally {
      setSavingMission(false);
    }
  };

  return {
    saveMission,
    savingMission,
    error,
    setError,
    isEditMode
  };
};
