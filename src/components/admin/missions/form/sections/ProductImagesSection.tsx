
import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel } from '@/components/ui/form';
import FileUpload from '@/components/FileUpload';
import { MissionFormData } from '../../MissionFormSchema';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleRemoveExistingImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    form.setValue('productImages', updatedImages);
    
    console.log('Image removed, remaining images:', updatedImages.length);
  };

  return (
    <FormItem>
      <FormLabel>Product Images</FormLabel>
      
      {/* Display existing images with delete buttons */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Current images:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {existingImages.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="relative group aspect-square">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 w-6 h-6 rounded-full opacity-90"
                  onClick={() => handleRemoveExistingImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-2">
        <FileUpload 
          onFilesSelected={handleImageFilesSelected}
          maxFiles={5 - (existingImages?.length || 0)}
          accept="image/*"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Add up to 5 images of the product that participants will review.
      </p>
    </FormItem>
  );
};

export default ProductImagesSection;
