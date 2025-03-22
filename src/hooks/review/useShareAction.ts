
import { toast } from 'sonner';

export const useShareAction = () => {
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return { handleCopyLink };
};
