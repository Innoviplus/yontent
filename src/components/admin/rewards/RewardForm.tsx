
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RedemptionItem } from '@/types/redemption';
import { rewardSchema, RewardFormData } from './RewardFormSchema';
import BasicInfoFields from './form-fields/BasicInfoFields';
import RedemptionFields from './form-fields/RedemptionFields';
import StatusField from './form-fields/StatusField';
import ImageFields from './form-fields/ImageFields';
import ContentFields from './form-fields/ContentFields';

interface RewardFormProps {
  reward?: RedemptionItem;
  title: string;
  onSubmit: (data: RewardFormData) => Promise<boolean>;
  onCancel: () => void;
}

const RewardForm = ({ 
  reward, 
  title, 
  onSubmit, 
  onCancel 
}: RewardFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      name: reward?.name || '',
      description: reward?.description || '',
      points_required: reward?.points_required || 100,
      image_url: reward?.image_url || '',
      banner_image: reward?.banner_image || '',
      is_active: reward?.is_active !== false, // default to true if not provided
      terms_conditions: reward?.terms_conditions || '',
      redemption_details: reward?.redemption_details || '',
      redemption_type: reward?.redemption_type || 'GIFT_VOUCHER'
    }
  });

  const handleSubmit = async (data: RewardFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for this reward item.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoFields form={form} />
            
            <RedemptionFields form={form} />
            
            <StatusField form={form} />
            
            <ImageFields form={form} />

            <ContentFields form={form} />
          
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Reward'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RewardForm;
