
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SortDropdown from './SortDropdown';

type SortOption = 'recent' | 'views' | 'relevant';

interface FeedHeaderProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  isAuthenticated: boolean;
}

const FeedHeader = ({ sortBy, onSortChange, isAuthenticated }: FeedHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Review Feed</h1>
      
      <div className="flex items-center gap-4">
        <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />

        {isAuthenticated && (
          <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white">
            <Link to="/submit-review">
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeedHeader;
