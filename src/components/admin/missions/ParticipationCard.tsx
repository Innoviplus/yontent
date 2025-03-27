
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Eye, Check, X, ExternalLink, FileImage, Award, Tag } from 'lucide-react';
import { MissionParticipation } from '@/hooks/admin/useMissionParticipations';
import ParticipationStatusBadge from './ParticipationStatusBadge';
import PointsBadge from '@/components/PointsBadge';

interface ParticipationCardProps {
  participation: MissionParticipation;
  processingId: string | null;
  onViewDetails: (participation: MissionParticipation) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
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
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card key={participation.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                {participation.userAvatar ? (
                  <AvatarImage src={participation.userAvatar} alt={participation.userName} />
                ) : null}
                <AvatarFallback>{getInitials(participation.userName || "")}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{participation.userName}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(participation.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <ParticipationStatusBadge status={participation.status} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">{participation.missionTitle}</h4>
              <div className="text-sm text-muted-foreground line-clamp-3">
                {participation.missionDescription}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-brand-teal" />
                <PointsBadge points={participation.missionPointsReward || 0} size="sm" />
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {participation.missionType === 'RECEIPT' ? 'Receipt Submission' : 'Review'}
                </span>
              </div>
              <div className="flex items-center">
                {participation.missionType === 'RECEIPT' ? (
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
