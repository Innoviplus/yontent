
import { AlertCircle } from 'lucide-react';

interface MissionsErrorProps {
  error: string;
  onRetry: () => void;
}

const MissionsError = ({ error, onRetry }: MissionsErrorProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start">
      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
      <div>
        <h3 className="text-sm font-medium text-red-800">Error loading missions</h3>
        <p className="text-sm text-red-700 mt-1">{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default MissionsError;
