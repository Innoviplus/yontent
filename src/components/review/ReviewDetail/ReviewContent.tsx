
import HTMLContent from '@/components/HTMLContent';

interface ReviewContentProps {
  content: string;
}

const ReviewContent = ({ content }: ReviewContentProps) => {
  return (
    <div className="prose max-w-none">
      <HTMLContent content={content} />
    </div>
  );
};

export default ReviewContent;
