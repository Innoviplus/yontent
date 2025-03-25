
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches all users with their points information
 */
export const fetchUsersWithPoints = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar, points')
      .order('username', { ascending: true });
      
    if (error) {
      console.error("Error fetching users with points:", error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error in fetchUsersWithPoints:", error);
    throw error;
  }
};
