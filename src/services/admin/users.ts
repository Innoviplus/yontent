
import { supabase } from "@/integrations/supabase/client";

// Returns the roles array for a given user id
export async function fetchUserRoles(user_id: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user_id);

  if (error || !data) return [];
  return data.map((row) => row.role);
}

// Returns all users with their roles
export async function fetchAllUsersWithRoles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email')
    .limit(200);

  if (error || !data) return [];

  // Get roles for all users
  const { data: rolesRows } = await supabase
    .from('user_roles')
    .select('user_id, role');

  const roleMap: { [user_id: string]: string[] } = {};
  if (rolesRows) {
    for (const row of rolesRows) {
      if (!roleMap[row.user_id]) roleMap[row.user_id] = [];
      roleMap[row.user_id].push(row.role);
    }
  }

  return data.map((user: any) => ({
    ...user,
    roles: roleMap[user.id] || []
  }));
}

// Grant admin role to a user
export async function grantAdminRole(user_id: string) {
  return await supabase
    .from('user_roles')
    .insert({ user_id, role: 'admin' });
}

// Remove admin role from a user
export async function revokeAdminRole(user_id: string) {
  return await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', user_id)
    .eq('role', 'admin');
}
