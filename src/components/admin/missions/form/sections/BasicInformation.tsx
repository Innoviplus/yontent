
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MissionFormData } from '../../MissionFormSchema';
import RichTextFormField from '../fields/RichTextFormField';

interface BasicInformationProps {
  form: UseFormReturn<MissionFormData>;
}

const BasicInformation = ({ form }: BasicInformationProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mission Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter mission title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <RichTextFormField
        name="description"
        label="Mission Description"
        placeholder="Describe the mission objectives and details..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mission type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REVIEW">Review Mission</SelectItem>
                  <SelectItem value="RECEIPT">Receipt Submission</SelectItem>
                  <SelectItem value="SOCIAL_PROOF">Social Proof Mission</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pointsReward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Reward</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="100" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInformation;
