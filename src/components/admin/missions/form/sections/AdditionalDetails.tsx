
import { useFormContext } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import RichTextEditor from '@/components/RichTextEditor';
import { MissionFormData } from '../../MissionFormSchema';

interface AdditionalDetailsProps {
  form: ReturnType<typeof useFormContext<MissionFormData>>;
}

const AdditionalDetails = ({ form }: AdditionalDetailsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Additional Details</h3>
      
      <FormField
        control={form.control}
        name="requirementDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Requirement Description</FormLabel>
            <FormControl>
              <RichTextEditor 
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Enter detailed requirements for completing this mission"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="termsConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Terms & Conditions</FormLabel>
            <FormControl>
              <RichTextEditor 
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Enter terms and conditions"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalDetails;
