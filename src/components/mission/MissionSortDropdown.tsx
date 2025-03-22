
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

type SortOption = 'recent' | 'expiringSoon' | 'highestReward';

interface MissionSortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const MissionSortDropdown = ({ sortBy, onSortChange }: MissionSortDropdownProps) => {
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'recent':
        return 'Most Recent';
      case 'expiringSoon':
        return 'Expiring Soon';
      case 'highestReward':
        return 'Highest Reward';
      default:
        return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {getSortLabel(sortBy)}
          <ChevronDown className="h-4 w-4" />
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
