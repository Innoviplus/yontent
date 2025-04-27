
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

  // Check if the error is related to the relationship issue
  const isRelationshipError = error.includes("relationship") && 
    (error.includes("mission_participations") || error.includes("profiles"));
  
  // Check if this might be an RLS issue
  const isRlsError = error.includes("permission") || error.includes("access") || error.includes("violates row-level security");
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-1">Error loading participations</h4>
          <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
          
          {isRelationshipError && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <p className="font-medium mb-1">Relationship Error Detected:</p>
              <p className="mb-2">This error occurs because Supabase can't find the foreign key relationship between the 'mission_participations' and 'profiles' tables in your database schema.</p>
              <p className="mb-2">The system is using a multi-query approach to work around this limitation:</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Fetching mission participations directly</li>
                <li>Separately fetching user profiles and missions</li>
                <li>Manually combining the data</li>
                <li>Creating placeholder data for any missing records</li>
              </ul>
              <p>This approach ensures all submissions are visible regardless of user permissions.</p>
            </div>
          )}
          
          {isRlsError && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <p className="font-medium mb-1">Possible Row-Level Security (RLS) Issue:</p>
              <p className="mb-2">This error may be related to Supabase Row Level Security policies restricting access to records submitted by other users.</p>
              <p className="mb-2">The system has been updated to bypass these restrictions for admin users by:</p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Using separate queries to fetch all data</li>
                <li>Creating placeholder data for any missing profiles</li>
                <li>Ensuring all users' submissions are visible in the admin panel</li>
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
                Error Type: {isRelationshipError ? "Schema Relationship" : isRlsError ? "Possible RLS Issue" : "General Error"}
              </p>
              <p className="font-mono overflow-x-auto py-1">Tables: mission_participations, profiles</p>
              <p className="font-mono overflow-x-auto py-1">Expected FK: user_id references profiles(id)</p>
              {isRlsError && (
                <p className="font-mono overflow-x-auto py-1">
                  <Lock className="h-3 w-3 inline mr-1" />
                  RLS workaround: Using separate queries to bypass restrictions
                </p>
              )}
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
