
import React from 'react';
import { Mission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Award, Clock, Tag, CalendarDays, Users, ToggleLeft, ToggleRight, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { format, isPast, isAfter } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import PointsBadge from '@/components/PointsBadge';

interface MissionListProps {
  missions: Mission[];
  onEdit: (mission: Mission) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (mission: Mission) => Promise<boolean>;
  onDuplicate?: (mission: Mission) => void;
  onMissionClick?: (mission: Mission) => void;
  onUpdateOrder?: (id: string, direction: 'up' | 'down') => Promise<boolean>;
}

const MissionList: React.FC<MissionListProps> = ({ 
  missions, 
  onEdit, 
  onDelete,
  onToggleStatus,
  onDuplicate,
  onMissionClick,
  onUpdateOrder 
}) => {
  const [processingOrderIds, setProcessingOrderIds] = useState<Record<string, boolean>>({});
  
  const getMissionStatusColor = (status: string, expiresAt?: Date) => {
    if (status === 'DRAFT') return 'bg-gray-200 text-gray-800';
    if (status === 'COMPLETED') return 'bg-green-100 text-green-800';
    if (status === 'ACTIVE') {
      if (expiresAt && isPast(expiresAt)) {
        return 'bg-orange-100 text-orange-800';
      }
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getMissionStatus = (mission: Mission) => {
    if (mission.status === 'COMPLETED') return 'COMPLETED';
    if (mission.status === 'DRAFT') return 'DRAFT';
    if (mission.status === 'ACTIVE') {
      if (mission.expiresAt && isPast(mission.expiresAt)) {
        return 'EXPIRED';
      }
      if (mission.startDate && isAfter(mission.startDate, new Date())) {
        return 'UPCOMING';
      }
      return 'ACTIVE';
    }
    return mission.status;
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleToggleStatus = async (mission: Mission) => {
    if (onToggleStatus) {
      await onToggleStatus(mission);
    }
  };

  const handleCardClick = (mission: Mission) => {
    if (onMissionClick) {
      onMissionClick(mission);
    }
  };

  const handleUpdateOrder = async (id: string, direction: 'up' | 'down') => {
    if (!onUpdateOrder || processingOrderIds[id]) return;
    
    setProcessingOrderIds(prev => ({ ...prev, [id]: true }));
    
    try {
      await onUpdateOrder(id, direction);
    } catch (error) {
      console.error("Error updating mission order:", error);
    } finally {
      setProcessingOrderIds(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {missions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No missions found. Create your first mission to get started.
            </div>
          </CardContent>
        </Card>
      ) : (
        missions.map((mission) => (
          <Card 
            key={mission.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCardClick(mission)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{mission.title}</CardTitle>
                    <Badge className={getMissionStatusColor(mission.status, mission.expiresAt)}>
                      {getMissionStatus(mission)}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {mission.merchantName && (
                      <div className="flex items-center gap-2 mb-1">
                        {mission.merchantLogo ? (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={mission.merchantLogo} alt={mission.merchantName} />
                            <AvatarFallback>{mission.merchantName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : null}
                        <span>{mission.merchantName}</span>
                      </div>
                    )}
                  </CardDescription>
                </div>
                <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                  {onUpdateOrder && (
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleUpdateOrder(mission.id, 'up')}
                        className="h-7 w-7 p-0"
                        disabled={processingOrderIds[mission.id]}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleUpdateOrder(mission.id, 'down')}
                        className="h-7 w-7 p-0"
                        disabled={processingOrderIds[mission.id]}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {onToggleStatus && mission.status !== 'COMPLETED' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleStatus(mission)}
                    >
                      {mission.status === 'ACTIVE' ? (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  )}
                  {onDuplicate && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDuplicate(mission)}
                      title="Duplicate mission"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onEdit(mission)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(mission.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {stripHtml(mission.description)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="h-4 w-4 mr-1 text-brand-teal" />
                      <PointsBadge points={mission.pointsReward} size="sm" />
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Tag className="h-4 w-4 mr-1" />
                      {mission.type === 'RECEIPT' ? 'Receipt Submission' : 'Review'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {format(new Date(mission.startDate), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {mission.expiresAt ? format(new Date(mission.expiresAt), 'MMM d, yyyy') : 'No expiration'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      Per user: {mission.maxSubmissionsPerUser || 1}
                    </div>
                    {mission.totalMaxSubmissions && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        Total limit: {mission.totalMaxSubmissions}
                      </div>
                    )}
                  </div>
                </div>
                {mission.bannerImage && (
                  <div className="hidden md:block h-32 border rounded overflow-hidden">
                    <img
                      src={mission.bannerImage}
                      alt={mission.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MissionList;
