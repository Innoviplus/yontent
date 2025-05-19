
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import { useSubmitReview } from '@/hooks/useSubmitReview';
import { Skeleton } from '@/components/ui/skeleton';
import ImageUpload from '@/components/review/ImageUpload';
import VideoUpload from '@/components/review/VideoUpload';
import RichTextEditor from '@/components/RichTextEditor';
import { useEffect } from 'react';
import { toast } from 'sonner';

const SubmitReview = () => {
  // All hooks must be called at the top level, in the same order on every render
  const {
    form,
    uploading,
    isLoading,
    imagePreviewUrls,
    imageError,
    isDraft,
    isEditing,
    onSubmit,
    saveDraft,
    handleImageSelection,
    removeImage,
    reorderImages,
    setImageError,
    videoPreviewUrl,
    videoError,
    handleVideoSelection,
    removeVideo,
    reviewContent
  } = useSubmitReview();

  // Single useEffect for logging - always present
  useEffect(() => {
    // Log key info on initial load
    console.log('SubmitReview component mounted with:', {
      isLoading,
      isEditing,
      isDraft,
      hasContent: reviewContent ? 'Yes' : 'No',
      contentPreview: reviewContent ? reviewContent.substring(0, 50) + '...' : 'None',
      imageCount: imagePreviewUrls?.length || 0,
      videoCount: videoPreviewUrl?.length || 0,
      formContent: form.getValues('content'),
    });
    
    // Display toast if the form has content from a draft
    if (isEditing && reviewContent) {
      toast.success('Draft review loaded successfully');
    }
  }, []); // Empty dependency array to run only once on mount

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
              {isEditing ? (isDraft ? 'Loading Draft Review...' : 'Loading Review...') : 'Submit a Review'}
            </h1>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-end space-x-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? (isDraft ? 'Edit Draft Review' : 'Edit Review') : 'Submit a Review'}
          </h1>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload Section */}
                <ImageUpload
                  imagePreviewUrls={imagePreviewUrls}
                  onFileSelect={handleImageSelection}
                  onRemoveImage={removeImage}
                  onReorderImages={reorderImages}
                  error={imageError}
                  uploading={uploading}
                  maxImages={12}
                />
                
                {/* Video Upload Section - using the refactored component */}
                <VideoUpload
                  videoPreviewUrls={videoPreviewUrl}
                  onFileSelect={handleVideoSelection}
                  onRemoveVideo={removeVideo}
                  error={videoError}
                  uploading={uploading}
                  maxDuration={60}
                />
                
                {/* Review Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review</FormLabel>
                      <FormControl>
                        <RichTextEditor 
                          value={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Share your experience..."
                          simpleToolbar={true}
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
                    className="order-1 sm:order-2 bg-brand-teal hover:bg-brand-teal/90"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? 'Updating...' : 'Uploading...'}
                      </>
                    ) : (isEditing ? (isDraft ? "Publish Review" : "Update Review") : "Publish Review")}
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
