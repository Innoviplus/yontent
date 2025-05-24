
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '@/lib/types';

export const updateProfileData = async (userId: string, profileData: ExtendedProfile): Promise<boolean> => {
  if (!userId) {
    console.error("User not authenticated.");
    return false;
  }

  try {
    console.log("Updating profile with data:", profileData);
    
    // Update the profile with the new column structure
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: profileData.firstName || null,
        last_name: profileData.lastName || null,
        bio: profileData.bio || null,
        gender: profileData.gender || null,
        birth_date: profileData.birthDate ? profileData.birthDate.toISOString() : null,
        website_url: profileData.websiteUrl || null,
        facebook_url: profileData.facebookUrl || null,
        instagram_url: profileData.instagramUrl || null,
        youtube_url: profileData.youtubeUrl || null,
        tiktok_url: profileData.tiktokUrl || null,
        twitter_url: profileData.twitterUrl || null,
        country: profileData.country || null,
        phone_number: profileData.phoneNumber || null,
        phone_country_code: profileData.phoneCountryCode || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      throw updateError;
    }
    
    console.log("Profile updated successfully in Supabase!");
    
    // Check if user should receive profile completion bonus
    await checkAndAwardProfileCompletionBonus(userId);
    
    return true;
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    throw error;
  }
};

const checkAndAwardProfileCompletionBonus = async (userId: string): Promise<void> => {
  try {
    // Check if user has already received profile completion bonus
    const { data: existingBonus, error: checkError } = await supabase
      .from('point_transactions')
      .select('id')
      .eq('user_id_point', userId)
      .ilike('description', '%Profile Completion%')
      .limit(1);

    if (checkError) {
      console.error("Error checking existing profile completion bonus:", checkError);
      return;
    }

    // If user hasn't received the bonus yet, award it
    if (!existingBonus || existingBonus.length === 0) {
      console.log("Awarding profile completion bonus to user:", userId);
      
      // Get current user points
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching user points for bonus:', userError);
        return;
      }
      
      const currentPoints = userData?.points || 0;
      const newPointsTotal = currentPoints + 150;
      
      // Update user points
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({ points: newPointsTotal, updated_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (pointsError) {
        console.error('Error updating user points for profile completion bonus:', pointsError);
        return;
      }
      
      // Create transaction record
      const { error: transactionError } = await supabase.rpc(
        'create_point_transaction',
        {
          p_user_id: userId,
          p_amount: 150,
          p_type: 'EARNED',
          p_description: 'Profile Completion Bonus - First Profile Update'
        }
      );
      
      if (transactionError) {
        console.error('Error creating profile completion bonus transaction:', transactionError);
        // Try to revert the points if transaction logging fails
        try {
          await supabase
            .from('profiles')
            .update({ points: currentPoints, updated_at: new Date().toISOString() })
            .eq('id', userId);
          console.log('Points reverted due to transaction error');
        } catch (revertError) {
          console.error('Failed to revert points after transaction error:', revertError);
        }
        return;
      }
      
      console.log(`Profile completion bonus awarded: 150 points to user ${userId}`);
    } else {
      console.log("User has already received profile completion bonus");
    }
  } catch (error: any) {
    console.error("Error in profile completion bonus logic:", error);
  }
};
