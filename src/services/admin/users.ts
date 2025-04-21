
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
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user_id);

    if (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }
    
    if (!data) return [];
    
    // Type assertion to ensure data is processed correctly
    return (data as { role: string }[]).map(row => row.role);
  } catch (error) {
    console.error("Exception fetching user roles:", error);
    return [];
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

    if (error || !profiles) return [];

    // Fetch all user_roles
    const { data: rolesRows } = await supabase
      .from("user_roles")
      .select("user_id, role");

    // Map user_id to roles array
    const roleMap: { [user_id: string]: string[] } = {};
    if (rolesRows) {
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

// Grant admin role to a user
export async function grantAdminRole(user_id: string) {
  try {
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
