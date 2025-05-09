
import { useState } from 'react';
import { Mission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MissionList from './MissionList';
import MissionFormWrapper from './MissionFormWrapper';
import MissionsLoadingState from './MissionsLoadingState';
import MissionDialog from './dialog/MissionDialog';
import { toast } from 'sonner';

interface MissionsManagementProps {
  missions: Mission[];
  isLoading: boolean;
  addMission: (mission: Partial<Mission>) => Promise<boolean>;
  updateMission: (id: string, updates: Partial<Mission>) => Promise<boolean>;
  deleteMission: (id: string) => Promise<boolean>;
  refreshMissions: () => Promise<void>;
  maxLoadingTime?: boolean;
}

const MissionsManagement = ({
  missions,
  isLoading,
  addMission,
  updateMission,
  deleteMission,
  refreshMissions,
  maxLoadingTime
}: MissionsManagementProps) => {
  const [isAddingMission, setIsAddingMission] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isMissionDialogOpen, setIsMissionDialogOpen] = useState(false);

  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
    setIsMissionDialogOpen(true);
  };

  const handleCloseMissionDialog = () => {
    setIsMissionDialogOpen(false);
    setSelectedMission(null);
  };

  const handleMissionUpdated = async () => {
    await refreshMissions();
  };

  const handleToggleStatus = async (mission: Mission) => {
    const newStatus = mission.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    const result = await updateMission(mission.id, { status: newStatus });
    
    if (result) {
      toast.success(
        `Mission ${mission.title} ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`
      );
    }
    
    return result;
  };

  const handleDuplicateMission = async (mission: Mission) => {
    const timestamp = new Date().toLocaleTimeString();
    // Create a properly typed duplicate with the correct status type
    const duplicateMission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'> = {
      title: `${mission.title} (Copy - ${timestamp})`,
      description: mission.description,
      pointsReward: mission.pointsReward,
      type: mission.type,
      status: 'DRAFT' as const, // Explicitly typed as 'DRAFT'
      startDate: mission.startDate,
      expiresAt: mission.expiresAt,
      requirementDescription: mission.requirementDescription,
      merchantName: mission.merchantName,
      merchantLogo: mission.merchantLogo,
      bannerImage: mission.bannerImage,
      maxSubmissionsPerUser: mission.maxSubmissionsPerUser,
      totalMaxSubmissions: mission.totalMaxSubmissions,
      termsConditions: mission.termsConditions,
      completionSteps: mission.completionSteps,
      productDescription: mission.productDescription,
      productImages: mission.productImages,
      faqContent: mission.faqContent,
      displayOrder: 0 // Set default display order
    };
    
    const result = await addMission(duplicateMission);
    if (result) {
      toast.success(`Mission "${mission.title}" duplicated successfully`);
      await refreshMissions();
    }
  };

  const handleUpdateOrder = async (missionId: string, direction: 'up' | 'down') => {
    try {
      // Find the current mission and its index
      const currentIndex = missions.findIndex(m => m.id === missionId);
      if (currentIndex === -1) return false;
      
      const mission = missions[currentIndex];
      let newDisplayOrder = mission.displayOrder || 0;
      
      // Calculate the target index based on direction
      let targetIndex;
      if (direction === 'up') {
        if (currentIndex === 0) return false; // Already at the top
        targetIndex = currentIndex - 1;
      } else {
        if (currentIndex === missions.length - 1) return false; // Already at the bottom
        targetIndex = currentIndex + 1;
      }
      
      const targetMission = missions[targetIndex];
      const targetOrder = targetMission.displayOrder || 0;
      
      // Update the current mission's order
      const result = await updateMission(missionId, { 
        displayOrder: targetOrder 
      });
      
      // Update the target mission's order
      await updateMission(targetMission.id, { 
        displayOrder: newDisplayOrder 
      });
      
      if (result) {
        await refreshMissions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating mission order:', error);
      toast.error('Failed to update mission order');
      return false;
    }
  };

  if (isLoading && !maxLoadingTime) {
    return <MissionsLoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Missions</h2>
        <Button onClick={() => setIsAddingMission(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add Mission
        </Button>
      </div>

      <MissionList 
        missions={missions} 
        onDelete={deleteMission}
        onEdit={(mission) => {
          setSelectedMission(mission);
          setIsAddingMission(true);
        }}
        onToggleStatus={handleToggleStatus}
        onDuplicate={handleDuplicateMission}
        onMissionClick={handleMissionClick}
        onUpdateOrder={handleUpdateOrder}
      />

      {isAddingMission && (
        <MissionFormWrapper
          mission={selectedMission || undefined}
          isAdding={!selectedMission}
          onSubmit={async (data) => {
            if (selectedMission) {
              const result = await updateMission(selectedMission.id, data);
              if (result) {
                setIsAddingMission(false);
                setSelectedMission(null);
              }
              return result;
            } else {
              const result = await addMission(data);
              if (result) {
                setIsAddingMission(false);
              }
              return result;
            }
          }}
          onCancel={() => {
            setIsAddingMission(false);
            setSelectedMission(null);
          }}
        />
      )}

      {selectedMission && isMissionDialogOpen && (
        <MissionDialog
          mission={selectedMission}
          isOpen={isMissionDialogOpen}
          onClose={handleCloseMissionDialog}
          onUpdated={handleMissionUpdated}
        />
      )}
    </div>
  );
};

export default MissionsManagement;
