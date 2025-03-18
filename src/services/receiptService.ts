
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubmitReceiptParams {
  userId: string;
  missionId: string;
  image: File;
  storeTitle: string;
  purchaseDate: Date;
  totalAmount?: number;
}

export const uploadReceiptImage = async (userId: string, image: File): Promise<string> => {
  if (!userId || !image) {
    throw new Error('Missing required parameters for upload');
  }
  
  const fileExt = image.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filePath, image);
  
  if (uploadError) {
    console.error('Error uploading receipt image:', uploadError);
    throw new Error('Failed to upload receipt image');
  }
  
  // Get public URL for the uploaded image
  const { data: { publicUrl } } = supabase.storage
    .from('receipts')
    .getPublicUrl(filePath);
  
  return publicUrl;
};

export const submitReceipt = async ({ userId, missionId, image, storeTitle, purchaseDate, totalAmount }: SubmitReceiptParams) => {
  // Upload image first
  const imageUrl = await uploadReceiptImage(userId, image);
  
  // Insert the receipt submission into the database
  const { error } = await supabase
    .from('receipt_submissions')
    .insert({
      user_id: userId,
      mission_id: missionId,
      image: imageUrl,
      store_title: storeTitle,
      purchase_date: purchaseDate.toISOString(),
      total_amount: totalAmount,
      status: 'PENDING'
    });
    
  if (error) {
    console.error('Error submitting receipt:', error);
    throw new Error('Failed to submit receipt');
  }
  
  return { success: true };
};
