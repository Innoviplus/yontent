
import { supabase } from '@/integrations/supabase/client';

export const updateUserPoints = async (userId: string, points: number) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ points })
      .eq('id', userId);
      
    if (error) {
      console.error("Error updating user points:", error);
      return { error };
    }
    
    return { error: null };
  } catch (error: any) {
    console.error("Exception updating user points:", error);
    return { error };
  }
};

