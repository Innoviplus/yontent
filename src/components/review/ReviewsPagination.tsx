import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface ReviewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ReviewsPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: ReviewsPaginationProps) => {
  const isMobile = useIsMobile();
  
  if (totalPages <= 1) return null;
  
  const getVisiblePages = () => {
    if (isMobile) {
      return [currentPage];
    }
    
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  };
  
  const visiblePages = getVisiblePages();
  
  return (
    <Pagination className={isMobile ? "" : "mt-8"}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {!isMobile && currentPage > 3 && totalPages > 5 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          </>
        )}
        
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink 
              onClick={() => onPageChange(page)} 
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {!isMobile && currentPage < totalPages - 2 && totalPages > 5 && (
          <>
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ReviewsPagination;
