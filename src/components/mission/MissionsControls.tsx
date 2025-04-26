
import { RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MissionSortDropdown from './MissionSortDropdown';
import type { SortOption } from '@/hooks/mission/useMissionsList';

interface MissionsControlsProps {
  isLoading: boolean;
  activeMissionsCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onRefresh: () => void;
}

const MissionsControls = ({
  isLoading,
  activeMissionsCount,
  sortBy,
  onSortChange,
  onRefresh
}: MissionsControlsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'}`}>
      <p className="text-gray-500 text-sm">
        {isLoading ? 'Loading missions...' : `${activeMissionsCount} active missions available`}
      </p>
      
      <div className="flex gap-2">
        <MissionSortDropdown 
          sortBy={sortBy} 
          onSortChange={onSortChange}
          className={isMobile ? 'w-full' : ''}
        />
        
        <button 
          className="flex items-center justify-center p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default MissionsControls;
