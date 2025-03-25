
import { CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

const EmptyRequestsState = () => {
  return (
    <CardContent>
      <div className="text-center py-8">
        <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium">No redemption requests</h3>
        <p className="text-sm text-gray-500 mt-1">Requests will appear here when users redeem their points</p>
      </div>
    </CardContent>
  );
};

export default EmptyRequestsState;
