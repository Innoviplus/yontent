
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import { useSubmitReview } from '@/hooks/useSubmitReview';
import { Skeleton } from '@/components/ui/skeleton';
import ImageUpload from '@/components/review/ImageUpload';
import { Textarea } from '@/components/ui/textarea';

const SubmitReview = () => {
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
    setImageError
  } = useSubmitReview();

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
                <form onSubmit={form.handleSubmit((values) => onSubmit(values, false))} className="space-y-6">
                  {/* Image Upload Section */}
                  <ImageUpload
                    imagePreviewUrls={imagePreviewUrls}
                    onFileSelect={handleImageSelection}
                    onRemoveImage={removeImage}
                    error={imageError}
                    uploading={uploading}
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
                            {...field}
                            placeholder="Share your experience..."
                            className="min-h-[200px]"
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
