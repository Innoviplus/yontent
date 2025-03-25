
import { supabase } from '@/integrations/supabase/client';

/**
 * Get a user's current points balance
 */
export const getUserPointsBalance = async (userId: string): Promise<{ points: number; success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { points: data?.points || 0, success: true };
  } catch (error: any) {
    console.error('Error getting user points balance:', error);
    return { points: 0, success: false, error: error.message };
  }
};
