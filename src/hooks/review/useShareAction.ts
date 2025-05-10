
import { toast } from 'sonner';

export const useShareAction = () => {
  // Copy the current URL to clipboard
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Link copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
        toast.error('Failed to copy link to clipboard');
      });
  };

  // Could add more sharing methods here in the future

  return { handleCopyLink };
};
