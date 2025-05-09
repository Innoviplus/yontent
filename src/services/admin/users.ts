/**
 * Search for users by username or email
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

/**
 * Check if a user has admin role
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Checking admin status for user: ${userId}`);
    const roles = await fetchUserRoles(userId);
    return roles.includes('admin');
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Fetch all users with their roles
 */
export const fetchAllUsersWithRoles = async () => {
  try {
    console.log("Fetching all users with roles");
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, username, email')
      .order('username', { ascending: true })
      .limit(100);
      
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    // Get roles for all users
    const usersWithRoles = await Promise.all(users.map(async (user) => {
      const roles = await fetchUserRoles(user.id);
      return { 
        ...user, 
        roles 
      };
    }));
    
    return usersWithRoles;
  } catch (error) {
    console.error("Error in fetchAllUsersWithRoles:", error);
    throw error;
  }
};

/**
 * Fetch roles for a specific user
 */
export const fetchUserRoles = async (userId: string): Promise<string[]> => {
  try {
    console.log(`Fetching roles for user: ${userId}`);
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
      
    if (error) {
      console.error(`Error fetching roles for user ${userId}:`, error);
      return [];
    }
    
    return roleData.map(r => r.role);
  } catch (error) {
    console.error(`Error in fetchUserRoles for ${userId}:`, error);
    return [];
  }
};

/**
 * Grant admin role to a user
 */
export const grantAdminRole = async (userId: string) => {
  try {
    console.log(`Granting admin role to user: ${userId}`);
    
    // Check if user already has the admin role
    const roles = await fetchUserRoles(userId);
    if (roles.includes('admin')) {
      console.log(`User ${userId} already has admin role`);
      return { error: null };
    }
    
    // Insert new admin role
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });
      
    if (error) {
      console.error(`Error granting admin role to user ${userId}:`, error);
      return { error };
    }
    
    console.log(`Admin role granted to user: ${userId}`);
    return { error: null, data };
  } catch (error: any) {
    console.error(`Exception granting admin role to ${userId}:`, error);
    return { error };
  }
};

/**
 * Revoke admin role from a user
 */
export const revokeAdminRole = async (userId: string) => {
  try {
    console.log(`Revoking admin role from user: ${userId}`);
    
    const { data, error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'admin');
      
    if (error) {
      console.error(`Error revoking admin role from user ${userId}:`, error);
      return { error };
    }
    
    console.log(`Admin role revoked from user: ${userId}`);
    return { error: null, data };
  } catch (error: any) {
    console.error(`Exception revoking admin role from ${userId}:`, error);
    return { error };
  }
};
