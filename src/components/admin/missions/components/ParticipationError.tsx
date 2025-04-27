
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Bug, Database, TableProperties, Search } from 'lucide-react';

interface ParticipationErrorProps {
  error: string;
  onRefresh: () => void;
}

const ParticipationError: React.FC<ParticipationErrorProps> = ({
  error,
  onRefresh
}) => {
  const supabaseProjectUrl = "https://supabase.com/dashboard/project/qoycoypkyqxrcqdpfqhd";

  // Check if the error is related to the relationship issue
  const isRelationshipError = error.includes("relationship") && error.includes("mission_participations") && error.includes("profiles");
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-1">Error loading participations</h4>
          <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
          
          {isRelationshipError && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <p className="font-medium mb-1">Potential cause:</p>
              <p className="mb-2">This error typically occurs when Supabase can't find the foreign key relationship between the 'mission_participations' and 'profiles' tables.</p>
              <p>The system is now using a multi-query approach to work around this limitation.</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
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
              onClick={() => window.open(`${supabaseProjectUrl}/editor`, '_blank')}
            >
              <Database className="h-4 w-4 mr-1" />
              View Database
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-indigo-50"
              onClick={() => window.open(`${supabaseProjectUrl}/editor/mission_participations`, '_blank')}
            >
              <TableProperties className="h-4 w-4 mr-1" />
              Participations Table
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-green-50"
              onClick={() => window.open(`${supabaseProjectUrl}/editor/profiles`, '_blank')}
            >
              <Search className="h-4 w-4 mr-1" />
              Profiles Table
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationError;
