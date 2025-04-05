
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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
    const fieldValue = form.getValues(name);
    console.log(`RichTextFormField "${name}" initialized:`, {
      value: fieldValue,
      valuePreview: typeof fieldValue === 'string' ? fieldValue.substring(0, 100) : 'not a string',
      hasValue: !!fieldValue,
      valueType: typeof fieldValue
    });
  }, [form, name]);
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Ensure field.value is a string to avoid "undefined" being passed to the textarea
        const textValue = typeof field.value === 'string' ? field.value : '';
        
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea 
                {...field}
                value={textValue}
                placeholder={placeholder}
                className="min-h-[150px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default RichTextFormField;
