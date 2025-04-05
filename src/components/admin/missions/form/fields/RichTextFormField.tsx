
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
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
  
  // Add debugging to see the field value
  useEffect(() => {
    console.log(`RichTextFormField "${name}" initialized:`, {
      value: form.getValues(name),
      valuePreview: form.getValues(name)?.substring(0, 100),
      hasValue: !!form.getValues(name)
    });
  }, [form, name]);
  
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
