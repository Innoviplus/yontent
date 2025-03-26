
import { Mission } from '@/lib/types';
import MissionForm from './MissionForm';

interface MissionFormWrapperProps {
  mission?: Mission;
  isAdding: boolean;
  onSubmit: (data: Partial<Mission>) => Promise<boolean>;
  onCancel: () => void;
}

const MissionFormWrapper = ({ 
  mission, 
  isAdding, 
  onSubmit, 
  onCancel 
}: MissionFormWrapperProps) => {
  if (!isAdding && !mission) return null;
  
  const title = isAdding ? "Add New Mission" : "Edit Mission";
  
  return (
    <MissionForm 
      mission={mission}
      onSubmit={onSubmit}
      onCancel={onCancel}
      title={title}
    />
  );
};

export default MissionFormWrapper;
