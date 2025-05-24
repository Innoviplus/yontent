
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';
import { reviewSchema, type ReviewFormValues } from './ReviewFormSchema';
import ReviewFormButtons from './ReviewFormButtons';

interface MissionReviewFormProps {
  mission: Mission;
  userId: string;
  onSubmissionComplete?: (success: boolean) => void;
}

const MissionReviewForm = ({ mission, userId, onSubmissionComplete }: MissionReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: participation, error } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: mission.id,
          user_id_p: userId,
          status: 'PENDING',
          submission_data: {
            content: data.content,
            submission_type: 'REVIEW'
          }
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Review submitted successfully!');
      onSubmissionComplete?.(true);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
      onSubmissionComplete?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ReviewFormButtons isSubmitting={isSubmitting} missionId={mission.id} />
      </form>
    </Form>
  );
};

export default MissionReviewForm;
