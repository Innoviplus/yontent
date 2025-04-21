
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
  const { data, error } = await supabase
    .from("user_roles" as any) // as any to avoid TS error until types are regenerated
    .select("role")
    .eq("user_id", user_id);

  if (error || !data) return [];
  // data will be {role: string}[]
  return data.map((row: { role: string }) => row.role);
}

// Returns all users with their roles
export async function fetchAllUsersWithRoles() {
  // Get all users (profiles: id, username, email)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, email")
    .limit(200);

  if (error || !profiles) return [];

  // Fetch all user_roles
  const { data: rolesRows } = await supabase
    .from("user_roles" as any)
    .select("user_id, role");

  // Map user_id to roles array
  const roleMap: { [user_id: string]: string[] } = {};
  if (rolesRows) {
    for (const row of rolesRows as { user_id: string; role: string }[]) {
      if (!roleMap[row.user_id]) roleMap[row.user_id] = [];
      roleMap[row.user_id].push(row.role);
    }
  }

  return profiles.map((user: any) => ({
    ...user,
    roles: roleMap[user.id] || [],
  }));
}

// Grant admin role to a user
export async function grantAdminRole(user_id: string) {
  // The 'role' property must exist in the 'user_roles' table
  return await supabase
    .from("user_roles" as any)
    .insert([{ user_id, role: "admin" }]);
}

// Remove admin role from a user
export async function revokeAdminRole(user_id: string) {
  return await supabase
    .from("user_roles" as any)
    .delete()
    .eq("user_id", user_id)
    .eq("role", "admin");
}
