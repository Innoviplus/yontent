
import { useEditReview } from '@/hooks/review/useEditReview';
import Navbar from '@/components/Navbar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import ImageUpload from '@/components/review/ImageUpload';
import { Textarea } from '@/components/ui/textarea';

const EditReview = () => {
  const {
    form,
    loading,
    uploading,
    imagePreviewUrls,
    imageError,
    user,
    onSubmit,
    handleImageSelection,
    removeImage
  } = useEditReview();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Review</h1>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-end space-x-4">
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <ImageUpload
                    imagePreviewUrls={imagePreviewUrls}
                    onFileSelect={handleImageSelection}
                    onRemoveImage={removeImage}
                    error={imageError}
                    uploading={uploading}
                  />
                  
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
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : "Update Review"}
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

export default EditReview;
