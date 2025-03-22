
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type SortOption = 'recent' | 'views' | 'relevant';

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  labelOverrides?: {
    recent?: string;
    views?: string;
    relevant?: string;
  };
}

const SortDropdown = ({ sortBy, onSortChange, labelOverrides }: SortDropdownProps) => {
  const getLabel = (option: SortOption) => {
    if (labelOverrides && labelOverrides[option]) {
      return labelOverrides[option];
    }
    
    switch (option) {
      case 'recent': return 'Latest';
      case 'views': return 'Most Viewed';
      case 'relevant': return 'Most Relevant';
      default: return '';
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort by</span>
          <span>{getLabel(sortBy)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange('recent')}>
          {getLabel('recent')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('views')}>
          {getLabel('views')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange('relevant')}>
          {getLabel('relevant')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
