
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  isLoadingTooLong: boolean;
  handleRetry: () => void;
}

const AdminHeader = ({ isLoadingTooLong, handleRetry }: AdminHeaderProps) => (
  <div>
    <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
    <p className="text-gray-600">Manage your application</p>
    {isLoadingTooLong && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <div className="flex items-center">
          <AlertCircle className="text-yellow-500 h-5 w-5 mr-2" />
          <p className="text-yellow-700 text-sm">
            Some data may still be loading. If you experience issues, try refreshing the page.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleRetry}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
        </div>
      </div>
    )}
  </div>
);

export default AdminHeader;
