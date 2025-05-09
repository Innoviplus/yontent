
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOption = 'default' | 'recent' | 'expiringSoon' | 'highestReward';

interface MissionSortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

const MissionSortDropdown = ({ sortBy, onSortChange, className }: MissionSortDropdownProps) => {
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'default':
        return 'Default';
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
        <Button 
          variant="outline" 
          className={cn("gap-2", className)}
        >
          {getSortLabel(sortBy)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange('default')}>
          Default
        </DropdownMenuItem>
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
