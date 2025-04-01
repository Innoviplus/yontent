
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
import RichTextEditor from '@/components/RichTextEditor';

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
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Enter redemption details here..."
              />
            </FormControl>
            <FormDescription>
              This content will be displayed in the Redemption Details section. 
              To add hyperlinks: select text, click the link button, enter URL, and click Set Link.
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
              Terms and conditions for this reward.
              To add hyperlinks: select text, click the link button, enter URL, and click Set Link.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContentFields;
