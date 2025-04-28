
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { signOut } from '@/services/auth/sessionAuth';
import { useAuth } from '@/contexts/AuthContext';

// Add debounce utility to prevent multiple toast notifications
const createDebouncer = () => {
  let timeout: NodeJS.Timeout | null = null;
  return (fn: Function, delay: number) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn();
    }, delay);
  };
};

const debounceToast = createDebouncer();

export const useAccountActions = (
  navigate: (path: string) => void
) => {
  const { toast } = useToast();
  const { user, signOut: authSignOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (!confirmed) return;
    
    try {
      // In a real application, this would typically be handled by a secure server-side function
      debounceToast(() => {
        sonnerToast.info('Account deletion would be processed here. Signing you out for demo purposes.');
      }, 300);
      await authSignOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      // Call both the context signOut and the service signOut to ensure session is cleared
      try {
        await authSignOut();
        console.log("Auth context signOut successful");
      } catch (authError) {
        console.error("Auth context signOut error:", authError);
      }

      try {
        await signOut();
        console.log("Service signOut successful");
      } catch (serviceError) {
        console.error("Service signOut error:", serviceError);
      }

      console.log("Sign out processes completed");
      debounceToast(() => {
        sonnerToast.success("You have been logged out");
      }, 300);
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    handleDeleteAccount,
    handleLogout
  };
};
