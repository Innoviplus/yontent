
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import ImageUploadSection from '@/components/review/ImageUploadSection';
import { submitReview } from '@/services/reviewService';

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

  const onSubmit = async (values: ReviewFormValues, isDraft: boolean = false) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    // For published reviews, validate that at least one image is selected
    if (!isDraft && selectedImages.length === 0) {
      setImageError("At least one image is required");
      return;
    }
    
    try {
      setUploading(true);
      
      await submitReview({
        userId: user.id,
        content: values.content,
        images: selectedImages,
        isDraft
      });
      
      toast.success(isDraft ? 'Draft saved successfully!' : 'Review submitted successfully!');
      navigate(isDraft ? '/dashboard' : '/feed');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  const saveDraft = () => {
    // Since we're saving as draft, we'll validate manually to allow empty content
    const values = form.getValues();
    
    // For drafts, allow empty content
    if (values.content.length === 0 && selectedImages.length === 0) {
      toast.error('Please add some content or images to save as draft');
      return;
    }
    
    onSubmit(values, true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Submit a Review</h1>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="space-y-6">
                {/* Image Upload Section */}
                <ImageUploadSection
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  imagePreviewUrls={imagePreviewUrls}
                  setImagePreviewUrls={setImagePreviewUrls}
                  imageError={imageError}
                  setImageError={setImageError}
                />
                
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
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={saveDraft}
                    disabled={uploading}
                    className="order-2 sm:order-1"
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save as Draft
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="order-1 sm:order-2"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : "Publish Review"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;
