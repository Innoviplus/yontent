
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedProfile } from '@/lib/types';
import { updateProfileData as updateProfileInDb } from '@/services/profile/profileUpdateService';

export const useProfileData = () => {
  // Access only what's available in the AuthContext
  const { user, refreshUserProfile } = useAuth();

  // Update profile data with proper type handling
  const updateProfileData = async (profileData: ExtendedProfile): Promise<boolean> => {
    if (!user) {
      return false;
    }
    
    const success = await updateProfileInDb(user.id, profileData);
    
    if (success && refreshUserProfile) {
      // Refresh user profile data after updating
      await refreshUserProfile();
    }
    
    return success;
  };

  return {
    updateProfileData,
  };
};
