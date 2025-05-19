
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import ImageUpload from '@/components/review/ImageUpload';
import VideoUpload from '@/components/review/VideoUpload';
import RichTextEditor from '@/components/RichTextEditor';
import { useSubmitReview } from '@/hooks/useSubmitReview';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const EditReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    form,
    uploading,
    isLoading, // Use isLoading instead of loading
    imagePreviewUrls,
    imageError,
    videoPreviewUrl,
    videoError,
    isDraft,
    isEditing,
    onSubmit,
    saveDraft,
    handleImageSelection,
    removeImage,
    reorderImages,
    handleVideoSelection,
    removeVideo
  } = useSubmitReview();
  
  // Debug logging
  useEffect(() => {
    console.log('EditReview component rendered with:', {
      id,
      isDraft,
      isLoading, // Use isLoading instead of loading
      imageCount: imagePreviewUrls.length,
      hasVideo: videoPreviewUrl.length > 0,
      formContent: form.getValues('content')?.substring(0, 50) || 'No content'
    });
  }, [id, isDraft, isLoading, imagePreviewUrls, videoPreviewUrl, form]);

  if (isLoading) { // Use isLoading instead of loading
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
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
          <h1 className="text-2xl font-bold mb-6">{isDraft ? 'Edit Draft Review' : 'Edit Review'}</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6">
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
                />
                
                {/* Video Upload Section */}
                <VideoUpload
                  videoPreviewUrls={videoPreviewUrl}
                  onFileSelect={handleVideoSelection}
                  onRemoveVideo={() => removeVideo()} // Fix: Remove the argument
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
                <div className="flex justify-between space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    disabled={uploading}
                  >
                    Save as Draft
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-brand-teal hover:bg-brand-teal/90"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : isDraft ? "Publish Review" : "Update Review"}
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

export default EditReview;
