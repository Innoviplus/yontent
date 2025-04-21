
import { supabase } from "@/integrations/supabase/client";

// Type-safe interface for user_roles
type UserRoleRow = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
};

// Returns the roles array for a given user id
export async function fetchUserRoles(user_id: string): Promise<string[]> {
  try {
    if (!user_id) {
      console.error("Error fetching user roles: No user ID provided");
      return [];
    }
    
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user_id);

    if (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.log("No roles found for user:", user_id);
      return [];
    }
    
    // Type assertion to ensure data is processed correctly
    const roles = (data as { role: string }[]).map(row => row.role);
    console.log(`User ${user_id} has roles:`, roles);
    return roles;
  } catch (error) {
    console.error("Exception fetching user roles:", error);
    return [];
  }
}

// Check if a user has admin role
export async function checkIsAdmin(user_id: string): Promise<boolean> {
  try {
    if (!user_id) return false;
    
    const roles = await fetchUserRoles(user_id);
    return roles.includes("admin");
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Returns all users with their roles
export async function fetchAllUsersWithRoles() {
  try {
    // Get all users (profiles: id, username, email)
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, email")
      .limit(200);

    if (error || !profiles) {
      console.error("Error fetching profiles:", error);
      return [];
    }

    // Fetch all user_roles
    const { data: rolesRows } = await supabase
      .from("user_roles")
      .select("user_id, role");

    // Map user_id to roles array
    const roleMap: { [user_id: string]: string[] } = {};
    if (rolesRows && Array.isArray(rolesRows)) {
      // Type assertion to make TypeScript happy
      for (const row of rolesRows as { user_id: string; role: string }[]) {
        if (!roleMap[row.user_id]) roleMap[row.user_id] = [];
        roleMap[row.user_id].push(row.role);
      }
    }

    return profiles.map((user: any) => ({
      ...user,
      roles: roleMap[user.id] || [],
    }));
  } catch (error) {
    console.error("Error fetching users with roles:", error);
    return [];
  }
}

// Search users by username or email
export async function searchUsersByUsernameOrEmail(query: string) {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    // Search for profiles that match the query for username or email
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, email")
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error("Error searching users:", error);
      throw error;
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Get user IDs for role lookup
    const userIds = profiles.map(profile => profile.id);
    
    // Fetch roles for these users
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .in("user_id", userIds);

    if (rolesError) {
      console.error("Error fetching roles for searched users:", rolesError);
      throw rolesError;
    }

    // Map user_id to roles array
    const roleMap: { [user_id: string]: string[] } = {};
    if (rolesData && Array.isArray(rolesData)) {
      for (const row of rolesData) {
        if (!roleMap[row.user_id]) roleMap[row.user_id] = [];
        roleMap[row.user_id].push(row.role);
      }
    }

    // Combine profile data with roles
    return profiles.map(user => ({
      ...user,
      roles: roleMap[user.id] || [],
    }));
  } catch (error) {
    console.error("Error in searchUsersByUsernameOrEmail:", error);
    throw error;
  }
}

// Grant admin role to a user
export async function grantAdminRole(user_id: string) {
  try {
    if (!user_id) {
      throw new Error("No user ID provided");
    }
    
    // Check if the user already has the admin role
    const roles = await fetchUserRoles(user_id);
    if (roles.includes("admin")) {
      console.log("User already has admin role:", user_id);
      return { data: null, error: null };
    }
    
    return await supabase
      .from("user_roles")
      .insert([{ user_id, role: "admin" }]);
  } catch (error) {
    console.error("Error granting admin role:", error);
    throw error;
  }
}

// Remove admin role from a user
export async function revokeAdminRole(user_id: string) {
  try {
    if (!user_id) {
      throw new Error("No user ID provided");
    }
    
    return await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user_id)
      .eq("role", "admin");
  } catch (error) {
    console.error("Error revoking admin role:", error);
    throw error;
  }
}
