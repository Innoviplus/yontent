
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Mission } from '@/lib/types';
import MissionList from './MissionList';
import MissionFormWrapper from './MissionFormWrapper';
import DeleteConfirmationDialog from '../rewards/DeleteConfirmationDialog';
import MissionsLoadingState from './MissionsLoadingState';

interface MissionsManagementProps {
  missions: Mission[];
  isLoading: boolean;
  onAdd: (mission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<Mission>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const MissionsManagement = ({ 
  missions, 
  isLoading, 
  onAdd, 
  onUpdate, 
  onDelete 
}: MissionsManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [deletingMissionId, setDeletingMissionId] = useState<string | null>(null);

  const handleAddSubmit = async (mission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => {
    const success = await onAdd(mission);
    if (success) {
      setShowAddForm(false);
      // No toast here as it's handled by useMissionOperations
    }
    return success;
  };

  const handleEditSubmit = async (updates: Partial<Mission>) => {
    if (!editingMission?.id) return false;
    
    const success = await onUpdate(editingMission.id, updates);
    if (success) {
      setEditingMission(null);
      // No toast here as it's handled by useMissionOperations
    }
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMissionId) return false;
    
    const success = await onDelete(deletingMissionId);
    if (success) {
      setDeletingMissionId(null);
      // No toast here as it's handled by useMissionOperations
    }
    return success;
  };

  const handleToggleStatus = async (mission: Mission) => {
    const newStatus = mission.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    const success = await onUpdate(mission.id, { status: newStatus });
    
    // No toast here as it's handled by useMissionOperations
    return success;
  };

  const handleDuplicate = async (mission: Mission) => {
    // Create a shallow copy of the mission object
    const duplicatedMission = {
      ...mission,
      title: `${mission.title} (Copy)`,
      status: 'DRAFT' as const,
    };
    
    // Create a type-safe version without the fields we want to exclude
    const missionToAdd: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'> = {
      title: duplicatedMission.title,
      description: mission.description,
      pointsReward: mission.pointsReward,
      type: mission.type,
      status: duplicatedMission.status,
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
      faqContent: mission.faqContent
    };
    
    const success = await onAdd(missionToAdd);
    // No toast here as it's handled by useMissionOperations
    return success;
  };

  if (isLoading) {
    return <MissionsLoadingState />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Missions Management</CardTitle>
            <CardDescription>Add, edit or remove missions for users to complete</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Mission
          </Button>
        </CardHeader>
        <CardContent>
          <MissionList 
            missions={missions}
            onEdit={setEditingMission}
            onDelete={setDeletingMissionId}
            onToggleStatus={handleToggleStatus}
            onDuplicate={handleDuplicate}
          />
        </CardContent>
      </Card>

      {/* Form modals */}
      {showAddForm && (
        <MissionFormWrapper 
          isAdding={true}
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingMission && (
        <MissionFormWrapper 
          mission={editingMission}
          isAdding={false}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingMission(null)}
        />
      )}

      {/* Confirmation dialog */}
      {deletingMissionId && (
        <DeleteConfirmationDialog
          title="Delete Mission"
          description="Are you sure you want to delete this mission? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingMissionId(null)}
        />
      )}
    </>
  );
};

export default MissionsManagement;
