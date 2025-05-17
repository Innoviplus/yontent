
import { toast } from 'sonner';

export { toast };

// Re-export the useToast hook for backward compatibility
export const useToast = () => {
  return { 
    toast
  };
};
