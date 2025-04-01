
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel } from '@/components/ui/form';
import FileUpload from '@/components/FileUpload';
import { MissionFormData } from '../../MissionFormSchema';

const ProductImagesSection = () => {
  const form = useFormContext<MissionFormData>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  // Get existing product images from form
  const existingImages = form.watch('productImages') || [];

  const handleImageFilesSelected = (files: File[]) => {
    setImageFiles(files);
    
    // Store files in the parent component's state through form context
    if (form.setValue) {
      // We're just saving the Files in a field that the parent form will access
      // The actual URLs will be set by the parent after upload
      form.setValue('_productImageFiles', files);
    }
  };

  return (
    <FormItem>
      <FormLabel>Product Images</FormLabel>
      <div className="mt-2">
        <FileUpload 
          onFilesSelected={handleImageFilesSelected}
          maxFiles={5}
          accept="image/*"
          previewUrls={existingImages}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Add up to 5 images of the product that participants will review.
      </p>
    </FormItem>
  );
};

export default ProductImagesSection;
