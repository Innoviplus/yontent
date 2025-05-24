
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';

const socialProofFormSchema = z.object({
  proofUrl: z.string().optional(),
  additionalRemarks: z.string().optional(),
  proofImages: z.array(z.string()).min(1, 'Please upload at least one proof image'),
});

export type SocialProofFormData = z.infer<typeof socialProofFormSchema>;

interface UseSocialProofFormProps {
  mission: Mission;
  userId: string;
  onSubmissionComplete: (success: boolean) => void;
}

export const useSocialProofForm = ({ mission, userId, onSubmissionComplete }: UseSocialProofFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SocialProofFormData>({
    resolver: zodResolver(socialProofFormSchema),
    defaultValues: {
      proofUrl: '',
      additionalRemarks: '',
      proofImages: [],
    },
  });

  const onSubmit = async (data: SocialProofFormData, uploadedImages: string[]) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one proof image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        proofUrl: data.proofUrl || '',
        additionalRemarks: data.additionalRemarks || '',
        proofImages: uploadedImages,
        submittedAt: new Date().toISOString(),
        type: 'SOCIAL_PROOF'
      };

      // Check if user already has a participation record for this mission
      const { data: existingParticipation, error: checkError } = await supabase
        .from('mission_participations')
        .select('id, status')
        .eq('mission_id', mission.id)
        .eq('user_id_p', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingParticipation) {
        // Update existing participation record
        const { error: updateError } = await supabase
          .from('mission_participations')
          .update({
            status: 'PENDING',
            submission_data: submissionData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingParticipation.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new mission participation
        const { error: participationError } = await supabase
          .from('mission_participations')
          .insert({
            mission_id: mission.id,
            user_id_p: userId,
            status: 'PENDING',
            submission_data: submissionData
          });

        if (participationError) {
          throw participationError;
        }
      }

      toast.success('Social proof submission completed successfully!');
      onSubmissionComplete(true);
      
      return true;
      
    } catch (error: any) {
      console.error('Error submitting social proof:', error);
      toast.error(error.message || 'Failed to submit social proof');
      onSubmissionComplete(false);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit
  };
};
