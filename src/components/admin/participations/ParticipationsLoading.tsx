
import { Loader2 } from 'lucide-react';

export const ParticipationsLoading = () => {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );
};
