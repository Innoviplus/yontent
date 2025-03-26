
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MissionsLoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missions Management</CardTitle>
        <CardDescription>Loading missions...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionsLoadingState;
