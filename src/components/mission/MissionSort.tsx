
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type SortOption = 'recent' | 'expiring' | 'points';

interface MissionSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const MissionSort = ({ sortBy, onSortChange }: MissionSortProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Sort by
          {sortBy === 'recent' && ' Newest'}
          {sortBy === 'expiring' && ' Expiring Soon'}
          {sortBy === 'points' && ' Highest Points'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange('recent')}>
          Newest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('expiring')}>
          Expiring Soon
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('points')}>
          Highest Points
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MissionSort;
