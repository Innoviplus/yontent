
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Camera, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';

// Form validation schema
const reviewSchema = z.object({
  content: z.string().min(20, { message: "Review content must be at least 20 characters" }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const SubmitReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to a maximum of 10 images total
      const availableSlots = 10 - selectedImages.length;
      const filesToAdd = newFiles.slice(0, availableSlots);
      
      if (filesToAdd.length > 0) {
        setSelectedImages((prevImages) => [...prevImages, ...filesToAdd]);
        
        // Create preview URLs for the images
        const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
        setImagePreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
        
        // Clear any previous image errors if we now have at least one image
        if ([...selectedImages, ...filesToAdd].length > 0) {
          setImageError(null);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    // Remove the image and its preview
    setSelectedImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      
      // If we removed the last image, set an error
      if (newImages.length === 0) {
        setImageError("At least one image is required");
      }
      
      return newImages;
    });
    
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prevUrls => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!user || selectedImages.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    
    for (const image of selectedImages) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('reviews')
        .upload(filePath, image);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error('Failed to upload an image');
        continue;
      }
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('reviews')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const onSubmit = async (values: ReviewFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    // Validate that at least one image is selected
    if (selectedImages.length === 0) {
      setImageError("At least one image is required");
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload images first
      const imageUrls = await uploadImages();
      
      if (imageUrls.length === 0) {
        toast.error('Failed to upload images. Please try again.');
        return;
      }
      
      // Insert the review into the database
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_name: "Review", // Default value since we're not collecting product name
          rating: 5, // Default value since we're not collecting rating
          content: values.content,
          images: imageUrls,
        });
        
      if (error) {
        console.error('Error submitting review:', error);
        toast.error('Failed to submit review');
        return;
      }
      
      toast.success('Review submitted successfully!');
      navigate('/feed');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Submit a Review</h1>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload - Now mandatory */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Images <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500">At least 1 image is required (maximum 10)</p>
                  
                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative h-24 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-1"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                        imageError ? 'border-red-300' : 'border-gray-300'
                      } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max 10 photos)</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={imagePreviewUrls.length >= 10}
                      />
                    </label>
                  </div>
                  
                  {imageError && (
                    <p className="text-xs text-red-500">{imageError}</p>
                  )}
                  
                  {imagePreviewUrls.length >= 10 && (
                    <p className="text-xs text-amber-600">Maximum of 10 images reached</p>
                  )}
                </div>
                
                {/* Review Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your experience..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : "Submit Review"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;
