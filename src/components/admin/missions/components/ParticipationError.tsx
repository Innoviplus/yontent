
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Bug, Database, TableProperties, Search, ChevronDown, ChevronUp, Code, Users, Lock } from 'lucide-react';

interface ParticipationErrorProps {
  error: string;
  onRefresh: () => void;
}

const ParticipationError: React.FC<ParticipationErrorProps> = ({
  error,
  onRefresh
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const supabaseProjectUrl = "https://supabase.com/dashboard/project/qoycoypkyqxrcqdpfqhd";

  // Check for common error types
  const isAmbiguousColumnError = error.includes("column reference") && error.includes("is ambiguous");
  const isRlsError = error.includes("permission") || error.includes("access") || error.includes("violates row-level security");
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-1">Error loading participations</h4>
          <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
          
          {isAmbiguousColumnError && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <p className="font-medium mb-1">Ambiguous Column Error Detected:</p>
              <p className="mb-2">This error occurs when a column name exists in multiple tables in the query and isn't properly qualified with the table name.</p>
              <p className="mb-2">The system is using qualified column names to work around this:</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Using <code>table_name.column_name</code> syntax in queries</li>
                <li>Specifying aliases for joined tables</li>
                <li>Using explicit column selection instead of <code>*</code></li>
              </ul>
            </div>
          )}
          
          {isRlsError && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <p className="font-medium mb-1">Possible Row-Level Security (RLS) Issue:</p>
              <p className="mb-2">This error is related to Supabase Row Level Security policies restricting access.</p>
              <p className="mb-2">Possible solutions:</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Ensure admin users have proper RLS policies</li>
                <li>The service role key may be needed for admin operations</li>
                <li>Check that the user has the proper admin role in the user_roles table</li>
              </ul>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="mt-2 flex items-center text-xs"
          >
            {showDebugInfo ? (
              <><ChevronUp className="h-3 w-3 mr-1" /> Hide Debug Info</>
            ) : (
              <><ChevronDown className="h-3 w-3 mr-1" /> Show Debug Info</>
            )}
          </Button>
          
          {showDebugInfo && (
            <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
              <p className="font-mono overflow-x-auto py-1">
                <Code className="h-3 w-3 inline mr-1" />
                Error Type: {isAmbiguousColumnError ? "Ambiguous Column Reference" : 
                            isRlsError ? "Possible RLS Issue" : "General Error"}
              </p>
              <p className="font-mono overflow-x-auto py-1">Affected tables: mission_participations, profiles, missions</p>
              <p className="font-mono overflow-x-auto py-1">User role check: Try using is_admin() function</p>
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
              <Users className="h-4 w-4 mr-1" />
              Profiles Table
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-white hover:bg-yellow-50"
              onClick={() => window.open(`${supabaseProjectUrl}/auth/policies`, '_blank')}
            >
              <Lock className="h-4 w-4 mr-1" />
              RLS Policies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipationError;
