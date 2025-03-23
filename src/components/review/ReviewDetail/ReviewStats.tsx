
import { Eye } from 'lucide-react';
import { formatNumber } from '@/lib/formatUtils';

interface ReviewStatsProps {
  viewsCount: number;
}

const ReviewStats = ({ viewsCount }: ReviewStatsProps) => {
  return (
    <div className="flex items-center text-sm text-gray-500">
      <Eye className="h-4 w-4 mr-1.5" />
      <span>{formatNumber(viewsCount)} views</span>
    </div>
  );
};

export default ReviewStats;
