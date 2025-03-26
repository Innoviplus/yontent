
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ParticipationsLoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-[250px] mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-5 w-[120px]" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default ParticipationsLoadingState;
