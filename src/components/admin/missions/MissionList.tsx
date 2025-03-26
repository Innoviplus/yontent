
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Mission } from '@/lib/types';

interface MissionListProps {
  missions: Mission[];
  onEdit: (mission: Mission) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (mission: Mission) => Promise<boolean>;
}

const MissionList = ({ 
  missions, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: MissionListProps) => {
  return (
    <>
      {missions.length === 0 ? (
        <div className="text-center py-8">
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No missions found</h3>
          <p className="text-sm text-gray-500 mt-1">Add a mission to get started</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Points</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[150px]">Dates</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.title}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="line-clamp-2">{mission.description}</div>
                </TableCell>
                <TableCell>{mission.pointsReward}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {mission.type === 'REVIEW' ? 'Review' : 'Receipt'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Start: {format(new Date(mission.startDate), 'MMM d, yyyy')}</span>
                  </div>
                  {mission.expiresAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Expires: {format(new Date(mission.expiresAt), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={mission.status === 'ACTIVE'} 
                      onCheckedChange={() => onToggleStatus(mission)}
                      aria-label={`${mission.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${mission.title}`}
                    />
                    <Badge variant={mission.status === 'ACTIVE' ? "default" : "secondary"}>
                      {mission.status === 'ACTIVE' ? "Active" : "Draft"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(mission)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(mission.id)}
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

export default MissionList;
