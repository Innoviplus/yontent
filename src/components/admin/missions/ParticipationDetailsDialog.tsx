
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MissionParticipation } from '@/hooks/admin/api/types/participationTypes';
import ParticipationUserInfo from './dialog/ParticipationUserInfo';
import MissionInfo from './dialog/MissionInfo';
import SubmissionContent from './dialog/SubmissionContent';
import DialogActionButtons from './dialog/DialogActionButtons';

interface ParticipationDetailsDialogProps {
  participation: MissionParticipation | null;
  processingId: string | null;
  onClose: () => void;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
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

  return (
    <Dialog open={!!participation} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <ParticipationUserInfo 
            userName={participation.user.username}
            userAvatar={participation.user.avatar}
            createdAt={participation.createdAt}
            status={participation.status}
          />
          
          <MissionInfo 
            title={participation.mission.title}
            description={participation.mission.description}
            pointsReward={participation.mission.pointsReward}
            missionType={participation.mission.type}
          />
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Submission Content:</h4>
            
            <SubmissionContent 
              missionType={participation.mission.type}
              submissionData={participation.submissionData}
              openReviewLink={openReviewLink}
            />
          </div>
          
          <DialogActionButtons 
            status={participation.status}
            id={participation.id}
            processingId={processingId}
            onApprove={onApprove}
            onReject={onReject}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipationDetailsDialog;
