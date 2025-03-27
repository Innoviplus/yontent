
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, ExternalLink, Award, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MissionParticipation } from '@/hooks/admin/useMissionParticipations';
import ParticipationStatusBadge from './ParticipationStatusBadge';
import PointsBadge from '@/components/PointsBadge';

interface ParticipationDetailsDialogProps {
  participation: MissionParticipation | null;
  processingId: string | null;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  openReviewLink: (reviewId: string) => void;
}

const ParticipationDetailsDialog: React.FC<ParticipationDetailsDialogProps> = ({
  participation,
  processingId,
  onClose,
  onApprove,
  onReject,
  openReviewLink
}) => {
  if (!participation) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={!!participation} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                {participation.userAvatar ? (
                  <AvatarImage src={participation.userAvatar} alt={participation.userName} />
                ) : null}
                <AvatarFallback>{getInitials(participation.userName || "")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{participation.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(participation.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <ParticipationStatusBadge status={participation.status} />
          </div>
          
          <div className="border rounded-md p-4 bg-muted/30">
            <h3 className="font-medium text-lg mb-2">{participation.missionTitle}</h3>
            <p className="text-muted-foreground mb-4">{participation.missionDescription}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-brand-teal" />
                <span>Reward: </span>
                <PointsBadge points={participation.missionPointsReward || 0} size="sm" className="ml-1" />
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span>Type: {participation.missionType === 'RECEIPT' ? 'Receipt Submission' : 'Review'}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Submission Content:</h4>
              
              {participation.missionType === 'RECEIPT' && participation.submissionData?.receipt_images?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {participation.submissionData.receipt_images.map((image, index) => (
                    <a 
                      key={index} 
                      href={image} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block overflow-hidden rounded-md border"
                    >
                      <img 
                        src={image} 
                        alt={`Receipt ${index + 1}`} 
                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity" 
                      />
                    </a>
                  ))}
                </div>
              ) : participation.missionType === 'REVIEW' && participation.submissionData?.review_id ? (
                <div className="flex flex-col space-y-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center w-fit"
                    onClick={() => openReviewLink(participation.submissionData.review_id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Review in New Tab
                  </Button>

                  {participation.submissionData.review_images && participation.submissionData.review_images.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Review Images:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {participation.submissionData.review_images.map((image, index) => (
                          <a 
                            key={index} 
                            href={image} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block overflow-hidden rounded-md border"
                          >
                            <img 
                              src={image} 
                              alt={`Review image ${index + 1}`} 
                              className="w-full h-48 object-cover hover:opacity-90 transition-opacity" 
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No submission content available</p>
              )}
            </div>
          </div>
          
          {participation.status === 'PENDING' && (
            <div className="flex justify-end space-x-2">
              <Button 
                variant="default" 
                onClick={() => {
                  onApprove(participation.id);
                  onClose();
                }}
                disabled={!!processingId}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Submission
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onReject(participation.id);
                  onClose();
                }}
                disabled={!!processingId}
              >
                <X className="h-4 w-4 mr-2" />
                Reject Submission
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationDetailsDialog;
