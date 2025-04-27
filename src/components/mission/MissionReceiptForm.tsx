
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { AlertCircle, Loader2, Upload } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

interface MissionReceiptFormProps {
  mission: Mission;
  userId: string;
}

const MissionReceiptForm = ({ mission, userId }: MissionReceiptFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setError(null);
      
      // Generate preview URLs for the selected files
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please upload at least one receipt image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload each file to Supabase storage
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `receipts/${userId}/${mission.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('missions')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('missions')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(data.publicUrl);
      }
      
      // Save the participation record with the uploaded images
      const { error: insertError } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: mission.id,
          user_id: userId,
          status: 'PENDING',
          submission_data: {
            receipt_images: uploadedUrls,
            submission_type: 'RECEIPT'
          }
        });
        
      if (insertError) throw insertError;
      
      toast.success('Receipt submitted successfully!');
      navigate(`/mission/${mission.id}`);
    } catch (error) {
      console.error('Error submitting receipt:', error);
      toast.error('Failed to submit receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <>
      <FileUpload
        onFilesSelected={handleFilesSelected}
        maxFiles={10}
        accept="image/*"
        className="mb-4"
        previewUrls={previewUrls}
      />
      
      {error && (
        <div className="text-red-600 text-sm mt-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      <CardFooter className="flex justify-end space-x-4 px-0">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/mission/${mission.id}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={files.length === 0 || isSubmitting}
          className="bg-brand-teal hover:bg-brand-teal/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Submit Receipt
            </>
          )}
        </Button>
      </CardFooter>
    </>
  );
};

export default MissionReceiptForm;
