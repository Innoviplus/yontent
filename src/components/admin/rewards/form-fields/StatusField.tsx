
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription, 
  FormControl
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { RewardFormData } from '../RewardFormSchema';

interface StatusFieldProps {
  form: UseFormReturn<RewardFormData>;
}

const StatusField = ({ form }: StatusFieldProps) => {
  return (
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
  );
};

export default StatusField;
