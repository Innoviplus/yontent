
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { MissionFormData } from '../../MissionFormSchema';
import RichTextEditor from '@/components/RichTextEditor';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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
              <Input {...field} placeholder="Enter mission title" />
            </FormControl>
            <FormDescription>
              This is the title that will be displayed to users.
            </FormDescription>
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
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Enter mission description"
              />
            </FormControl>
            <FormDescription>
              A brief description of the mission.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pointsReward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Reward</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))}
                  placeholder="Enter points reward" 
                />
              </FormControl>
              <FormDescription>
                The number of points a user will earn for completing this mission.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mission type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="RECEIPT">Receipt Submission</SelectItem>
                  <SelectItem value="REVIEW">Review Submission</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The type of mission determines what users need to submit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInformation;
