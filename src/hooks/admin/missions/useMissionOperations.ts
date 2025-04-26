
import { useState } from 'react';
import { toast } from 'sonner';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useMissionFormatters } from './useMissionFormatters';

export const useMissionOperations = (refreshMissions: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { formatMissionForDatabase, formatMissionUpdatesForDatabase } = useMissionFormatters();

  const addMission = async (missionData: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Log before saving to check data integrity
      console.log('Adding mission with rich text:', {
        requirementDescription: missionData.requirementDescription?.substring(0, 50) + '...',
        termsConditions: missionData.termsConditions?.substring(0, 50) + '...',
        completionSteps: missionData.completionSteps?.substring(0, 50) + '...',
        productDescription: missionData.productDescription?.substring(0, 50) + '...'
      });

      const dbData = formatMissionForDatabase(missionData);
      const { error } = await supabase.from('missions').insert(dbData);

      if (error) {
        throw error;
      }

      // Use a unique ID for the toast to prevent duplicates
      toast.success("Mission added successfully", {
        id: "mission-added",
      });
      
      await refreshMissions();
      return true;
    } catch (error: any) {
      console.error('Error adding mission:', error.message);
      toast.error('Failed to add mission', {
        id: "mission-add-error",
      });
      return false;
    }
  };

  const updateMission = async (id: string, updates: Partial<Mission>) => {
    try {
      // Log before updating to check data integrity
      console.log('Updating mission with rich text:', {
        id,
        requirementDescription: updates.requirementDescription?.substring(0, 50) + '...',
        termsConditions: updates.termsConditions?.substring(0, 50) + '...',
        completionSteps: updates.completionSteps?.substring(0, 50) + '...',
        productDescription: updates.productDescription?.substring(0, 50) + '...'
      });
      
      // Convert from client schema to database schema
      const dbUpdates = formatMissionUpdatesForDatabase(updates);

      const { error } = await supabase
        .from('missions')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Use a unique ID for the toast to prevent duplicates
      toast.success("Mission updated successfully", {
        id: `mission-updated-${id}`,
      });
      
      await refreshMissions();
      return true;
    } catch (error: any) {
      console.error('Error updating mission:', error.message);
      toast.error('Failed to update mission', {
        id: `mission-update-error-${id}`,
      });
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

      // Use a unique ID for the toast to prevent duplicates
      toast.success("Mission deleted successfully", {
        id: `mission-deleted-${id}`,
      });
      
      await refreshMissions();
      return true;
    } catch (error: any) {
      console.error('Error deleting mission:', error.message);
      toast.error('Failed to delete mission', {
        id: `mission-delete-error-${id}`,
      });
      return false;
    }
  };

  return {
    isLoading,
    addMission,
    updateMission,
    deleteMission
  };
};
