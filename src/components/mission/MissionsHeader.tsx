
import { Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionsHeaderProps {
  activeMissionsCount: number;
  isLoading: boolean;
}

const MissionsHeader = ({ activeMissionsCount, isLoading }: MissionsHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'} mb-4`}>
      <div className="flex items-center gap-3">
        <Award className="h-6 w-6 text-brand-teal" />
        <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
      </div>
      
      <p className="text-lg text-gray-600 mb-4">
        Complete missions to earn points and unlock rewards.
      </p>
    </div>
  );
};

export default MissionsHeader;
