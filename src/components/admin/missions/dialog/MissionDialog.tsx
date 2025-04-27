
import React, { useState } from 'react';
import { Mission } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MissionInfo from './MissionInfo';
import { TipsSquare } from 'lucide-react';

interface MissionDialogProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

const MissionDialog = ({ mission, isOpen, onClose, onUpdated }: MissionDialogProps) => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{mission.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details">Mission Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <MissionInfo mission={mission} onMissionUpdated={onUpdated} />
          </TabsContent>
          
          <TabsContent value="requirements" className="mt-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <div className="flex items-start space-x-2">
                <TipsSquare className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Submission Requirements</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {mission.requirementDescription || 'No specific requirements provided.'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDialog;
