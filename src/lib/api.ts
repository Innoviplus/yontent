
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch top users ranked by points
 */
export const getTopUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, points, avatar')
    .not('username', 'is', null)  // Filter out profiles without usernames
    .order('points', { ascending: false })
    .limit(50);
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};
