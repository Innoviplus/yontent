
import { Loader2, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

interface AdminPanelLoadingStateProps {
  retryCount: number;
  handleRetry: () => void;
}

const AdminPanelLoadingState = ({ retryCount, handleRetry }: AdminPanelLoadingStateProps) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="container mx-auto px-4 pt-28 pb-16 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-brand-teal animate-spin" />
        <p className="text-gray-600">Loading admin panel...</p>
        <div className="text-sm text-gray-500 max-w-xs text-center mt-2">
          {retryCount > 0 ? `Attempt ${retryCount + 1}...` : 'If loading takes too long, try clicking the retry button.'}
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={handleRetry}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Loading
        </Button>
      </div>
    </div>
  </div>
);

export default AdminPanelLoadingState;
