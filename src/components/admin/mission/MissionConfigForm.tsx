
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/RichTextEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface MissionConfigFormProps {
  formData: {
    merchantName: string;
    merchantLogo: string;
    bannerImage: string;
    maxSubmissionsPerUser: number;
    termsConditions: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleRichTextChange: (name: string, value: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  savingMission: boolean;
}

const MissionConfigForm = ({
  formData,
  handleChange,
  handleRichTextChange,
  handleFileUpload,
  savingMission
}: MissionConfigFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission Configuration</CardTitle>
        <CardDescription>Additional settings for this mission</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="merchantName">Merchant Name</Label>
            <Input
              id="merchantName"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleChange}
              placeholder="Enter merchant name (optional)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxSubmissionsPerUser">Max Submissions Per User</Label>
            <Input
              id="maxSubmissionsPerUser"
              name="maxSubmissionsPerUser"
              type="number"
              value={formData.maxSubmissionsPerUser}
              onChange={handleChange}
              min={1}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="merchantLogo">Merchant Logo URL</Label>
          <Input
            id="merchantLogo"
            name="merchantLogo"
            value={formData.merchantLogo}
            onChange={handleChange}
            placeholder="Enter merchant logo URL (optional)"
          />
          <div className="mt-2">
            <Label htmlFor="merchantLogoUpload">Or upload merchant logo:</Label>
            <Input
              id="merchantLogoUpload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'merchantLogo')}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bannerImage">Banner Image URL</Label>
          <Input
            id="bannerImage"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            placeholder="Enter banner image URL (optional)"
          />
          <div className="mt-2">
            <Label htmlFor="bannerImageUpload">Or upload banner image:</Label>
            <Input
              id="bannerImageUpload"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'bannerImage')}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="termsConditions">Terms & Conditions</Label>
          <RichTextEditor
            value={formData.termsConditions}
            onChange={(value) => handleRichTextChange('termsConditions', value)}
            placeholder="Enter terms and conditions (optional)"
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            type="submit" 
            disabled={savingMission}
            className="bg-brand-teal hover:bg-brand-teal/90"
          >
            {savingMission && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Mission
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionConfigForm;
