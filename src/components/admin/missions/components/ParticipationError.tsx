
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Bug, Database } from 'lucide-react';

interface ParticipationErrorProps {
  error: string;
  onRefresh: () => void;
}

const ParticipationError: React.FC<ParticipationErrorProps> = ({
  error,
  onRefresh
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-1">Error loading participations</h4>
          <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-red-50"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-amber-50"
              onClick={() => console.log('Debugging participations issue')}
            >
              <Bug className="h-4 w-4 mr-1" />
              Debug Info
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-blue-50"
              onClick={() => window.open('https://supabase.com/dashboard/project/qoycoypkyqxrcqdpfqhd/editor', '_blank')}
            >
              <Database className="h-4 w-4 mr-1" />
              View Database
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationError;
