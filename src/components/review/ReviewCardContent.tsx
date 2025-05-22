
interface ReviewCardContentProps {
  content: string;
}

const ReviewCardContent = ({ content }: ReviewCardContentProps) => {
  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="text-gray-600 text-xs mb-1.5">
      <p className="line-clamp-2">
        {stripHtml(content)}
      </p>
    </div>
  );
};

export default ReviewCardContent;
