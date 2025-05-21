
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewSorterProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

const ReviewSorter = ({ sortBy, onSortChange }: ReviewSorterProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}>
      <span className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className={`w-[140px] ${isMobile ? 'flex-1' : ''}`}>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="popular">Most Views</SelectItem>
          <SelectItem value="trending">Trending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReviewSorter;
