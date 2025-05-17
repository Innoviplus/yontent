
import { toast } from 'sonner';

// Re-export the toast function directly
export { toast };

// Create a simple hook for backward compatibility
export const useToast = () => {
  return {
    toast
  };
};
