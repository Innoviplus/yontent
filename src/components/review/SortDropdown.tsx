
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type SortOption = 'recent' | 'views' | 'relevant';

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortDropdown = ({ sortBy, onSortChange }: SortDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Sort by
          {sortBy === 'recent' && ' Latest'}
          {sortBy === 'views' && ' Most Viewed'}
          {sortBy === 'relevant' && ' Most Relevant'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange('recent')}>
          Latest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('views')}>
          Most Viewed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('relevant')}>
          Most Relevant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
