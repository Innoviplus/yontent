
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Eye, Check, X, ExternalLink, FileImage, Award, Tag } from 'lucide-react';
import { MissionParticipation } from '@/hooks/admin/api/types/participationTypes';
import ParticipationStatusBadge from './ParticipationStatusBadge';
import PointsBadge from '@/components/PointsBadge';

interface ParticipationCardProps {
  participation: MissionParticipation;
  processingId: string | null;
  onViewDetails: (participation: MissionParticipation) => void;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
  openReviewLink: (reviewId: string) => void;
}

const ParticipationCard: React.FC<ParticipationCardProps> = ({
  participation,
  processingId,
  onViewDetails,
  onApprove,
  onReject,
  openReviewLink
}) => {
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Format the date properly, ensuring we have a valid Date object
  const formattedDate = (participation.createdAt instanceof Date) 
    ? participation.createdAt.toLocaleDateString() 
    : (typeof participation.createdAt === 'string' 
        ? new Date(participation.createdAt).toLocaleDateString()
        : 'Unknown date');

  // Get user data from the user object
  const userName = participation.user?.username || "Unknown User";
  const userAvatar = participation.user?.avatar;
  
  // Get mission data from the mission object
  const missionTitle = participation.mission?.title || "Unknown Mission";
  const missionDescription = participation.mission?.description || "No description available";
  const missionPointsReward = participation.mission?.pointsReward || 0;
  const missionType = participation.mission?.type || "REVIEW";

  // Log for debugging
  console.log('Rendering card for participation:', {
    id: participation.id,
    userName,
    date: formattedDate,
    status: participation.status,
    createdAt: participation.createdAt
  });

  return (
    <Card key={participation.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                {userAvatar ? (
                  <AvatarImage src={userAvatar} alt={userName || ""} />
                ) : null}
                <AvatarFallback>{getInitials(userName || "")}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{userName || "Unknown User"}</h4>
                <p className="text-sm text-muted-foreground">
                  {formattedDate}
                </p>
              </div>
            </div>
            <ParticipationStatusBadge status={participation.status} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">{missionTitle || "Unknown Mission"}</h4>
              <div className="text-sm text-muted-foreground line-clamp-3">
                {missionDescription || "No description available"}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-brand-teal" />
                <PointsBadge points={missionPointsReward || 0} size="sm" />
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {missionType === 'RECEIPT' ? 'Receipt Submission' : 'Review'}
                </span>
              </div>
              <div className="flex items-center">
                {missionType === 'RECEIPT' ? (
                  <>
                    <FileImage className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {participation.submissionData?.receipt_images?.length || 0} image(s)
                    </span>
                  </>
                ) : (
                  <Button 
                    variant="link" 
                    className="flex items-center p-0 h-auto text-sm text-blue-600"
                    onClick={() => {
                      const reviewId = participation.submissionData?.review_id;
                      if (reviewId) {
                        openReviewLink(reviewId);
                      }
                    }}
                    disabled={!participation.submissionData?.review_id}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span>View Review</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(participation)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            
            {participation.status === 'PENDING' && (
              <>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => onApprove(participation.id)}
                  disabled={!!processingId}
                >
                  {processingId === participation.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onReject(participation.id)}
                  disabled={!!processingId}
                >
                  {processingId === participation.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipationCard;
