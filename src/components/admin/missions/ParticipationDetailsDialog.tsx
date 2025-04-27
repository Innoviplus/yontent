
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MissionParticipation } from '@/hooks/admin/types/missionParticipationTypes';
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
            userName={participation.userName}
            userAvatar={participation.userAvatar}
            createdAt={participation.createdAt}
            status={participation.status}
          />
          
          <MissionInfo 
            title={participation.missionTitle}
            description={participation.missionDescription}
            pointsReward={participation.missionPointsReward}
            missionType={participation.missionType}
          />
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Submission Content:</h4>
            
            <SubmissionContent 
              missionType={participation.missionType}
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
