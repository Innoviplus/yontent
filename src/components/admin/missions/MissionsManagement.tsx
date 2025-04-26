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
      toast.success("Mission added successfully");
    }
    return success;
  };

  const handleEditSubmit = async (updates: Partial<Mission>) => {
    if (!editingMission?.id) return false;
    
    const success = await onUpdate(editingMission.id, updates);
    if (success) {
      setEditingMission(null);
      toast.success("Mission updated successfully");
    }
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMissionId) return false;
    
    const success = await onDelete(deletingMissionId);
    if (success) {
      setDeletingMissionId(null);
      toast.success("Mission deleted successfully");
    }
    return success;
  };

  const handleToggleStatus = async (mission: Mission) => {
    const newStatus = mission.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    const success = await onUpdate(mission.id, { status: newStatus });
    
    if (success) {
      const actionText = newStatus === 'ACTIVE' ? 'activated' : 'deactivated';
      toast.success(`Mission ${actionText} successfully`);
    }
    
    return success;
  };

  const handleDuplicate = async (mission: Mission) => {
    const duplicatedMission = {
      ...mission,
      title: `${mission.title} (Copy)`,
      status: 'DRAFT',
    };
    
    delete duplicatedMission.id;
    delete duplicatedMission.createdAt;
    delete duplicatedMission.updatedAt;
    
    const success = await onAdd(duplicatedMission);
    if (success) {
      toast.success("Mission duplicated successfully");
    }
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
