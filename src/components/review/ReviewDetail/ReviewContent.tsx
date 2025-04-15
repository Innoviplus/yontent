
import HTMLContent from '@/components/HTMLContent';

interface ReviewContentProps {
  content: string;
}

const ReviewContent = ({ content }: ReviewContentProps) => {
  return (
    <div className="prose max-w-none">
      <style jsx global>{`
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #2563eb;
        }
      `}</style>
      <HTMLContent content={content} />
    </div>
  );
};

export default ReviewContent;
