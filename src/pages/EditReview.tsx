import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const reviewSchema = z.object({
  content: z.string().min(20, { message: "Review content must be at least 20 characters" }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ImageUploadSection = ({ 
  imagePreviewUrls, 
  onFileSelect, 
  onRemoveImage, 
  error, 
  uploading 
}: { 
  imagePreviewUrls: string[];
  onFileSelect: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  error: string | null;
  uploading: boolean;
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">Images</h3>
        <span className="text-sm text-gray-500">Add up to 5 images</span>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {imagePreviewUrls.map((url, index) => (
          <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md"
              onClick={() => onRemoveImage(index)}
              disabled={uploading}
            >
              ×
            </button>
          </div>
        ))}
        
        {imagePreviewUrls.length < 5 && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files)}
              multiple
              disabled={uploading}
            />
            <span className="text-3xl text-gray-400">+</span>
          </label>
        )}
      </div>
      
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const EditReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReview = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          toast.error('Failed to load review');
          navigate('/dashboard');
          return;
        }
        
        if (!data) {
          toast.error('Review not found');
          navigate('/dashboard');
          return;
        }
        
        form.setValue('content', data.content);
        
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
          setImagePreviewUrls(data.images);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        toast.error('Failed to load review data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReview();
  }, [id, user, navigate, form]);
  
  const onSubmit = async (values: ReviewFormValues) => {
    if (!user || !id) {
      toast.error('You must be logged in to update a review');
      return;
    }
    
    try {
      setUploading(true);
      
      let imagePaths = [...existingImages];
      
      if (selectedImages.length > 0) {
        for (const file of selectedImages) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('reviews')
            .upload(filePath, file);
            
          if (uploadError) {
            throw uploadError;
          }
          
          const { data } = supabase.storage
            .from('reviews')
            .getPublicUrl(filePath);
            
          imagePaths.push(data.publicUrl);
        }
      }
      
      const { error } = await supabase
        .from('reviews')
        .update({
          content: values.content,
          images: imagePaths,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Review updated successfully!');
      navigate(`/reviews/${id}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };
  
  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    setImageError(null);
  };
  
  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    } 
    else {
      const newIndex = index - existingImages.length;
      setSelectedImages(prev => prev.filter((_, i) => i !== newIndex));
      setImagePreviewUrls(prev => {
        const newUrls = [...prev];
        newUrls.splice(index, 1);
        return newUrls;
      });
    }
  };

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
                  <ImageUploadSection
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
                            placeholder="Share your experience..."
                            className="min-h-32"
                            {...field}
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
