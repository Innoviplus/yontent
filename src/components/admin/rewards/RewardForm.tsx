
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
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RedemptionItem } from '@/types/redemption';
import { rewardSchema, RewardFormData } from './RewardFormSchema';
import ImageUploader from './ImageUploader';
import RichTextEditor from '@/components/RichTextEditor';

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Apple Gift Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Redeem for an Apple Gift Card that can be used on the App Store..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="points_required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Required</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="redemption_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redemption Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GIFT_VOUCHER">Gift Voucher</SelectItem>
                        <SelectItem value="CASH">Cash Out</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Type of redemption this reward represents
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Make this reward available for redemption
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      label="Logo Image"
                      imageUrl={field.value || ''}
                      onImageChange={field.onChange}
                      placeholder="Upload logo"
                      folderName="logos"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="banner_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image (435 x 244px recommended)</FormLabel>
                  <FormControl>
                    <ImageUploader
                      label="Banner Image"
                      imageUrl={field.value || ''}
                      onImageChange={field.onChange}
                      placeholder="Upload banner image"
                      folderName="banners"
                    />
                  </FormControl>
                  <FormDescription>
                    Banner image for the reward detail page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="redemption_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redemption Details</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Enter redemption details here..."
                    />
                  </FormControl>
                  <FormDescription>
                    This content will be displayed in the Redemption Details section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="terms_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Enter terms and conditions here..."
                    />
                  </FormControl>
                  <FormDescription>
                    Terms and conditions for this reward
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
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
