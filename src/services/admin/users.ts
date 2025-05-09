/**
 * Search for users by username or email
 */
import { supabase } from "@/integrations/supabase/client";

export const searchUsersByUsernameOrEmail = async (query: string) => {
  if (!query || query.length < 2) {
    return [];
  }
  
  try {
    console.log(`Searching users with query: ${query}`);
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, username, email, points, avatar')
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
      .order('points', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }
    
    // Get each user's roles
    const usersWithRoles = await Promise.all(users.map(async (user) => {
      try {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesError) {
          console.warn(`Error fetching roles for user ${user.id}:`, rolesError);
          return { ...user, roles: [] };
        }
        
        return { ...user, roles: roles.map(r => r.role) };
      } catch (err) {
        console.error(`Error processing roles for user ${user.id}:`, err);
        return { ...user, roles: [] };
      }
    }));
    
    return usersWithRoles;
  } catch (error) {
    console.error("Error in searchUsersByUsernameOrEmail:", error);
    throw error;
  }
};
