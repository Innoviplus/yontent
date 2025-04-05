
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import ImageUpload from '@/components/review/ImageUpload';
import RichTextEditor from '@/components/RichTextEditor';
import { useEditReview } from '@/hooks/review/useEditReview';

const EditReview = () => {
  const { id } = useParams<{ id: string }>();
  const {
    form,
    loading,
    uploading,
    imagePreviewUrls,
    imageError,
    user,
    onSubmit,
    handleImageSelection,
    removeImage,
    reorderImages
  } = useEditReview();

  if (loading) {
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
          <h1 className="text-2xl font-bold mb-6">Edit Review</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ImageUpload
                  imagePreviewUrls={imagePreviewUrls}
                  onFileSelect={handleImageSelection}
                  onRemoveImage={removeImage}
                  onReorderImages={reorderImages}
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
                
                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-brand-teal hover:bg-brand-teal/90"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : "Update Review"}
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
