
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch top users ranked by points
 */
export const getTopUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, points, avatar')
    .not('username', 'is', null)  // Filter out profiles without usernames
    .neq('username', 'Anonymous')  // Filter out Anonymous users
    .gt('points', 0)  // Filter out users with 0 points
    .order('points', { ascending: false })
    .limit(50);
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

