
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { RewardFormData } from '../RewardFormSchema';
import { Textarea } from '@/components/ui/textarea';

interface ContentFieldsProps {
  form: UseFormReturn<RewardFormData>;
}

const ContentFields = ({ form }: ContentFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="redemption_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Redemption Details</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="Enter redemption details here..."
                className="min-h-[150px]"
              />
            </FormControl>
            <FormDescription>
              This content will be displayed in the Redemption Details section.
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
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder="Enter terms and conditions here..."
                className="min-h-[150px]"
              />
            </FormControl>
            <FormDescription>
              Terms and conditions for this reward.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContentFields;
