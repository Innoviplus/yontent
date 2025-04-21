
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Gift, Wallet, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { RedemptionItem } from '@/types/redemption';
import { useState } from 'react';

interface RewardListProps {
  rewards: RedemptionItem[];
  onEdit: (reward: RedemptionItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (reward: RedemptionItem) => Promise<boolean>;
  onDuplicate: (reward: RedemptionItem) => void;
  onUpdateOrder: (id: string, direction: 'up' | 'down') => Promise<boolean>;
}

const RewardList = ({ 
  rewards, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onDuplicate,
  onUpdateOrder
}: RewardListProps) => {
  const [processingOrderIds, setProcessingOrderIds] = useState<Record<string, boolean>>({});
  
  const getRedemptionTypeIcon = (type?: string) => {
    if (!type || type === 'GIFT_VOUCHER') {
      return <Gift className="h-4 w-4 text-purple-500" />;
    } else {
      return <Wallet className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleUpdateOrder = async (id: string, direction: 'up' | 'down') => {
    // Prevent multiple clicks while processing
    if (processingOrderIds[id]) return;
    
    // Mark this reward as being processed
    setProcessingOrderIds(prev => ({ ...prev, [id]: true }));
    
    try {
      await onUpdateOrder(id, direction);
    } catch (error) {
      console.error("Error updating reward order:", error);
    } finally {
      // Clear processing state
      setProcessingOrderIds(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
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
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead className="w-[160px] text-right">Actions</TableHead>
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
                  <div className="flex items-center gap-1.5">
                    {getRedemptionTypeIcon(reward.redemption_type)}
                    <span className="text-sm">
                      {reward.redemption_type === 'CASH' ? 'Cash Out' : 'Gift Voucher'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={reward.is_active} 
                      onCheckedChange={() => onToggleStatus(reward)}
                      aria-label={`${reward.is_active ? 'Deactivate' : 'Activate'} ${reward.name}`}
                    />
                    <Badge variant={reward.is_active ? "default" : "secondary"}>
                      {reward.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdateOrder(reward.id, 'up')}
                      className="h-7 w-7 p-0"
                      disabled={processingOrderIds[reward.id]}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdateOrder(reward.id, 'down')}
                      className="h-7 w-7 p-0"
                      disabled={processingOrderIds[reward.id]}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(reward)}
                      title="Edit reward"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDuplicate(reward)}
                      title="Duplicate reward"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(reward.id)}
                      title="Delete reward"
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
    </>
  );
};

export default RewardList;
