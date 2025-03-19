
interface ReviewContentProps {
  content: string;
}

const ReviewContent = ({ content }: ReviewContentProps) => {
  return (
    <div className="prose max-w-none">
      <p className="whitespace-pre-line text-gray-800">{content}</p>
    </div>
  );
};

export default ReviewContent;
