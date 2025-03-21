
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-10 w-32 mt-4" />
      <Skeleton className="h-60 w-full rounded-xl mt-6" />
    </div>
  );
};

export default DashboardSkeleton;
