
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import RichTextEditor from '@/components/RichTextEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MissionDetailsFormProps {
  formData: {
    title: string;
    description: string;
    requirementDescription: string;
    pointsReward: number;
    type: string;
    status: string;
    startDate: Date;
    expiresAt: Date | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (name: string, date: Date | null) => void;
  handleRichTextChange: (name: string, value: string) => void;
}

const MissionDetailsForm = ({
  formData,
  handleChange,
  handleSelectChange,
  handleDateChange,
  handleRichTextChange
}: MissionDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission Details</CardTitle>
        <CardDescription>Basic information about this mission</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter mission title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pointsReward">Points Reward <span className="text-red-500">*</span></Label>
            <Input
              id="pointsReward"
              name="pointsReward"
              type="number"
              value={formData.pointsReward}
              onChange={handleChange}
              min={0}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter mission description"
            rows={3}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="requirementDescription">Requirement Description <span className="text-red-500">*</span></Label>
          <RichTextEditor
            value={formData.requirementDescription}
            onChange={(value) => handleRichTextChange('requirementDescription', value)}
            placeholder="Enter mission requirements"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Mission Type <span className="text-red-500">*</span></Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="RECEIPT">Receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mission status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
            <DatePicker
              value={formData.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date</Label>
            <DatePicker
              value={formData.expiresAt}
              onChange={(date) => handleDateChange('expiresAt', date)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionDetailsForm;
