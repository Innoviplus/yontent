
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

interface RichTextFormFieldProps {
  name: keyof MissionFormData;
  label: string;
  placeholder: string;
}

const RichTextFormField = ({ name, label, placeholder }: RichTextFormFieldProps) => {
  const form = useFormContext<MissionFormData>();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RichTextEditor 
              value={field.value || ''}
              onChange={field.onChange}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RichTextFormField;
