
import { Eye } from 'lucide-react';

interface ReviewStatsProps {
  viewsCount: number;
}

const ReviewStats = ({ viewsCount }: ReviewStatsProps) => {
  return (
    <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
      <div className="flex items-center">
        <Eye className="h-4 w-4 mr-1.5" />
        <span>{viewsCount || 0} views</span>
      </div>
    </div>
  );
};

export default ReviewStats;
