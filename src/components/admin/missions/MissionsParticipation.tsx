
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Eye, Check, X, ExternalLink, FileImage, Award, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ParticipationStatusBadge from './ParticipationStatusBadge';
import ParticipationsLoadingState from './ParticipationsLoadingState';
import { MissionParticipation } from '@/hooks/admin/useMissionParticipations';
import PointsBadge from '@/components/PointsBadge';

interface MissionsParticipationProps {
  participations: MissionParticipation[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
}

const MissionsParticipation = ({
  participations,
  isLoading,
  isRefreshing,
  onRefresh,
  onApprove,
  onReject
}: MissionsParticipationProps) => {
  const [viewingParticipation, setViewingParticipation] = useState<MissionParticipation | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await onApprove(id);
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    await onReject(id);
    setProcessingId(null);
  };

  if (isLoading) {
    return <ParticipationsLoadingState />;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const openReviewLink = (reviewId: string) => {
    if (reviewId) {
      window.open(`/review/${reviewId}`, '_blank');
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Missions Participation</CardTitle>
            <CardDescription>Review and manage mission submissions from users</CardDescription>
          </div>
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {participations.length === 0 ? (
            <div className="text-center p-6 border rounded-md bg-muted/50">
              <p className="text-muted-foreground">No mission submissions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {participations.map(participation => (
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
                          onClick={() => setViewingParticipation(participation)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        
                        {participation.status === 'PENDING' && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleApprove(participation.id)}
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
                              onClick={() => handleReject(participation.id)}
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {viewingParticipation && (
        <Dialog open={!!viewingParticipation} onOpenChange={() => setViewingParticipation(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    {viewingParticipation.userAvatar ? (
                      <AvatarImage src={viewingParticipation.userAvatar} alt={viewingParticipation.userName} />
                    ) : null}
                    <AvatarFallback>{getInitials(viewingParticipation.userName || "")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{viewingParticipation.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(viewingParticipation.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <ParticipationStatusBadge status={viewingParticipation.status} />
              </div>
              
              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="font-medium text-lg mb-2">{viewingParticipation.missionTitle}</h3>
                <p className="text-muted-foreground mb-4">{viewingParticipation.missionDescription}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-brand-teal" />
                    <span>Reward: </span>
                    <PointsBadge points={viewingParticipation.missionPointsReward || 0} size="sm" className="ml-1" />
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>Type: {viewingParticipation.missionType === 'RECEIPT' ? 'Receipt Submission' : 'Review'}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Submission Content:</h4>
                  
                  {viewingParticipation.missionType === 'RECEIPT' && viewingParticipation.submissionData?.receipt_images?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {viewingParticipation.submissionData.receipt_images.map((image, index) => (
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
                  ) : viewingParticipation.missionType === 'REVIEW' && viewingParticipation.submissionData?.review_id ? (
                    <div className="flex flex-col space-y-4">
                      <Button 
                        variant="outline" 
                        className="flex items-center w-fit"
                        onClick={() => openReviewLink(viewingParticipation.submissionData.review_id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Review in New Tab
                      </Button>

                      {viewingParticipation.submissionData.review_images && viewingParticipation.submissionData.review_images.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium mb-2">Review Images:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {viewingParticipation.submissionData.review_images.map((image, index) => (
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
              
              {viewingParticipation.status === 'PENDING' && (
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="default" 
                    onClick={() => {
                      handleApprove(viewingParticipation.id);
                      setViewingParticipation(null);
                    }}
                    disabled={!!processingId}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Submission
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleReject(viewingParticipation.id);
                      setViewingParticipation(null);
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
      )}
    </>
  );
};

export default MissionsParticipation;
