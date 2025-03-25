
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
import ImageUploader from '../ImageUploader';

interface ImageFieldsProps {
  form: UseFormReturn<RewardFormData>;
}

const ImageFields = ({ form }: ImageFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo Image</FormLabel>
            <FormControl>
              <ImageUploader
                label="Logo Image"
                imageUrl={field.value || ''}
                onImageChange={field.onChange}
                placeholder="Upload logo"
                folderName="logos"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="banner_image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner Image (435 x 244px recommended)</FormLabel>
            <FormControl>
              <ImageUploader
                label="Banner Image"
                imageUrl={field.value || ''}
                onImageChange={field.onChange}
                placeholder="Upload banner image"
                folderName="banners"
              />
            </FormControl>
            <FormDescription>
              Banner image for the reward detail page
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ImageFields;
