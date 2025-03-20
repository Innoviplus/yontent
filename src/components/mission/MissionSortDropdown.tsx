
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type SortOption = 'recent' | 'expiringSoon' | 'highestReward';

interface MissionSortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const MissionSortDropdown = ({ sortBy, onSortChange }: MissionSortDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort by</span>
          {sortBy === 'recent' && ' Most Recent'}
          {sortBy === 'expiringSoon' && ' Expiring Soon'}
          {sortBy === 'highestReward' && ' Highest Reward'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange('recent')}>
          Most Recent
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('expiringSoon')}>
          Expiring Soon
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('highestReward')}>
          Highest Reward
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MissionSortDropdown;
