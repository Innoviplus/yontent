
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const reviewSchema = z.object({
  content: z.string().min(20, { message: "Review content must be at least 20 characters" }),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const useEditReview = () => {
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

  // Fetch the review data
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
  
  // Submit the updated review
  const onSubmit = async (values: ReviewFormValues) => {
    if (!user || !id) {
      toast.error('You must be logged in to update a review');
      return;
    }
    
    try {
      setUploading(true);
      
      let imagePaths = [...existingImages];
      
      // Upload new images if there are any
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
  
  // Handle image selection
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
  
  // Remove an image
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

  return {
    form,
    loading,
    uploading,
    imagePreviewUrls,
    imageError,
    user,
    onSubmit,
    handleImageSelection,
    removeImage
  };
};
