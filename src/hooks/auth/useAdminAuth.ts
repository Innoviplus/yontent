
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchUserRoles } from "@/services/admin/users";

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      // Accept both email or username as login identifier
      let email = identifier;
      if (!identifier.includes("@")) {
        // look up email by username
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .maybeSingle();
        if (error || !data) {
          toast.error("User not found");
          setLoading(false);
          return { error: { message: "Invalid username/email or password" } };
        }
        email = data.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Failed to login", { description: error.message });
        setLoading(false);
        return { error };
      }

      // Check if user is an admin
      const { user } = data;
      const roles = await fetchUserRoles(user.id);
      if (!roles.includes("admin")) {
        toast.error("You do not have admin privileges.");
        setLoading(false);
        // Immediately sign out user from session if not admin
        await supabase.auth.signOut();
        return { error: { message: "Not an admin user" } };
      }

      toast.success("Admin login successful");
      setLoading(false);
      return { user, session: data.session };
    } catch (error: any) {
      console.error(error);
      toast.error("Unexpected error logging in");
      setLoading(false);
      return { error };
    }
  };

  return { login, loading };
}
