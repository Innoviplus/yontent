
import { Eye } from 'lucide-react';

interface ReviewStatsProps {
  viewsCount: number;
}

const ReviewStats = ({ viewsCount }: ReviewStatsProps) => {
  return (
    <div className="flex items-center text-sm text-gray-500">
      <Eye className="h-4 w-4 mr-1.5" />
      <span>{viewsCount || 0} views</span>
    </div>
  );
};

export default ReviewStats;
