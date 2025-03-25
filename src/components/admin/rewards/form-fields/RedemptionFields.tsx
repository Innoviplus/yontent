
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RewardFormData } from '../RewardFormSchema';

interface RedemptionFieldsProps {
  form: UseFormReturn<RewardFormData>;
}

const RedemptionFields = ({ form }: RedemptionFieldsProps) => {
  return (
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
  );
};

export default RedemptionFields;
