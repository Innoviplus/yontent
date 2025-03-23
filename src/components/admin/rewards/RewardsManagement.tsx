
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Gift } from 'lucide-react';
import { RedemptionItem } from '@/types/redemption';
import RewardForm from './RewardForm';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface RewardsManagementProps {
  rewards: RedemptionItem[];
  isLoading: boolean;
  onAdd: (reward: Omit<RedemptionItem, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<RedemptionItem>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const RewardsManagement = ({ 
  rewards, 
  isLoading, 
  onAdd, 
  onUpdate, 
  onDelete 
}: RewardsManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState<RedemptionItem | null>(null);
  const [deletingRewardId, setDeletingRewardId] = useState<string | null>(null);

  const handleAddSubmit = async (reward: Omit<RedemptionItem, 'id'>) => {
    const success = await onAdd(reward);
    if (success) {
      setShowAddForm(false);
    }
  };

  const handleEditSubmit = async (updates: Partial<RedemptionItem>) => {
    if (!editingReward?.id) return;
    
    const success = await onUpdate(editingReward.id, updates);
    if (success) {
      setEditingReward(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRewardId) return;
    
    const success = await onDelete(deletingRewardId);
    if (success) {
      setDeletingRewardId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rewards Management</CardTitle>
          <CardDescription>Loading rewards...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rewards Management</CardTitle>
            <CardDescription>Add, edit or remove rewards available for redemption</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Reward
          </Button>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">No rewards found</h3>
              <p className="text-sm text-gray-500 mt-1">Add a reward to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Points</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-md flex items-center justify-center overflow-hidden">
                        {reward.image_url ? (
                          <img
                            src={reward.image_url}
                            alt={reward.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Gift className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{reward.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-2">{reward.description}</div>
                    </TableCell>
                    <TableCell>{reward.points_required}</TableCell>
                    <TableCell>
                      <Badge variant={reward.is_active ? "default" : "secondary"}>
                        {reward.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingReward(reward)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setDeletingRewardId(reward.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showAddForm && (
        <RewardForm 
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
          title="Add New Reward"
        />
      )}

      {editingReward && (
        <RewardForm 
          reward={editingReward}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingReward(null)}
          title="Edit Reward"
        />
      )}

      {deletingRewardId && (
        <DeleteConfirmationDialog
          title="Delete Reward"
          description="Are you sure you want to delete this reward? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingRewardId(null)}
        />
      )}
    </>
  );
};

export default RewardsManagement;
