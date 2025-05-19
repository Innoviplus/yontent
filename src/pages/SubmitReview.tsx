
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
import { useSearchParams } from 'react-router-dom';

const SubmitReview = () => {
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('draft') || searchParams.get('edit');
  
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
    // Video related props
    videoPreviewUrl,
    videoError,
    handleVideoSelection,
    removeVideo,
    setVideoError
  } = useSubmitReview();

  // Log for debugging
  useEffect(() => {
    console.log('SubmitReview component loaded with:', {
      reviewId,
      isDraft,
      isEditing,
      isLoading,
      imagePreviewUrlsCount: imagePreviewUrls.length,
      videoUrl: videoPreviewUrl.length > 0 ? 'Has video' : 'No video'
    });
    
    if (isLoading) {
      console.log('Loading review data...');
    }
  }, [reviewId, isDraft, isEditing, isLoading, imagePreviewUrls, videoPreviewUrl]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? (isDraft ? 'Edit Draft Review' : 'Edit Review') : 'Submit a Review'}
          </h1>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-end space-x-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ) : (
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
                  
                  {/* Video Upload Section */}
                  <VideoUpload
                    videoPreviewUrls={videoPreviewUrl ? [videoPreviewUrl] : []}
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
                            value={field.value}
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
                      ) : (isEditing ? "Update Review" : "Publish Review")}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;
