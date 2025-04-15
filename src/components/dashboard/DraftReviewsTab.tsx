
import { Link } from 'react-router-dom';
import { Review } from '@/lib/types';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import HTMLContent from '@/components/HTMLContent';

interface DraftReviewsTabProps {
  drafts: Review[];
}

const DraftReviewsTab = ({ drafts }: DraftReviewsTabProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const deleteDraft = async (reviewId: string) => {
    try {
      setDeletingId(reviewId);
      
      // First, check if there are any likes for this review
      const { data: likesData } = await supabase
        .from('review_likes')
        .select('id')
        .eq('review_id', reviewId);
        
      // Delete likes if they exist
      if (likesData && likesData.length > 0) {
        const { error: likesError } = await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', reviewId);
          
        if (likesError) {
          console.error('Error deleting likes:', likesError);
        }
      }
      
      // Check for comments
      const { data: commentsData } = await supabase
        .from('review_comments')
        .select('id')
        .eq('review_id', reviewId);
        
      // Delete comments if they exist
      if (commentsData && commentsData.length > 0) {
        const { error: commentsError } = await supabase
          .from('review_comments')
          .delete()
          .eq('review_id', reviewId);
          
        if (commentsError) {
          console.error('Error deleting comments:', commentsError);
        }
      }
      
      // Now delete the review
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
        
      if (error) throw error;
      
      toast.success('Draft deleted successfully');
      // In a real app, you'd want to refresh the reviews list here
      window.location.reload();
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    } finally {
      setDeletingId(null);
    }
  };
  
  if (drafts.length === 0) {
    return (
      <div className="text-center py-14 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">No draft reviews</h3>
        <p className="text-gray-500 mb-8">You haven't saved any reviews as drafts yet.</p>
        <Button asChild className="bg-brand-teal hover:bg-brand-teal/90">
          <Link to="/submit-review">Create a Review</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {drafts.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                    Draft
                  </span>
                  <span className="text-sm text-gray-500">
                    Last edited {format(review.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="line-clamp-2 text-gray-700">
                    {review.content ? (
                      <HTMLContent content={review.content} />
                    ) : (
                      <span className="text-gray-400">No content</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.images && review.images.map((image, idx) => (
                    <div 
                      key={idx} 
                      className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden"
                    >
                      <img 
                        src={image} 
                        alt={`Preview ${idx}`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/submit-review?draft=${review.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500" 
                  onClick={() => deleteDraft(review.id)}
                  disabled={deletingId === review.id}
                >
                  {deletingId === review.id ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DraftReviewsTab;
