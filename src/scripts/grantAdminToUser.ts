
import { supabase } from '@/integrations/supabase/client';
import { grantAdminRole } from '@/services/admin/users';
import { toast } from 'sonner';

export const grantAdminToUser = async (username: string) => {
  try {
    // First, find the user by username
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (userError) {
      console.error("Error finding user:", userError);
      toast.error("Failed to find user");
      return false;
    }

    if (!userData) {
      console.error("No user found with username:", username);
      toast.error("No user found with username: " + username);
      return false;
    }

    // Grant admin role
    const result = await grantAdminRole(userData.id);
    
    if (result.error) {
      console.error("Failed to grant admin role:", result.error);
      toast.error("Failed to grant admin rights");
      return false;
    }

    console.log(`Admin rights granted to user: ${username}`);
    toast.success(`Admin rights granted to ${username}`);
    return true;
  } catch (error: any) {
    console.error("Unexpected error:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
};

// For direct script execution if needed
if (import.meta.env.DEV) {
  grantAdminToUser('yyleung');
}
