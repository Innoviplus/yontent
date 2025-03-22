
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

const AdminPrivileges = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  const isAdmin = userProfile?.isAdmin === true;

  const handleToggleAdminStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get current profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('extended_data')
        .eq('id', user.id)
        .single();
      
      if (fetchError) throw fetchError;

      // Prepare new extended data
      let extendedData = profile?.extended_data || {};
      if (typeof extendedData !== 'object' || Array.isArray(extendedData)) {
        extendedData = {};
      }
      
      // Toggle isAdmin value
      const updatedExtendedData = {
        ...extendedData,
        isAdmin: !isAdmin
      };

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          extended_data: updatedExtendedData
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Show success message
      sonnerToast.success(isAdmin 
        ? 'Admin privileges removed' 
        : 'You now have admin privileges'
      );
      
      // Force reload to refresh auth context
      window.location.reload();
      
    } catch (error: any) {
      toast({
        title: "Failed to update admin status",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-purple-500" />
          Admin Privileges
        </CardTitle>
        <CardDescription>
          Enable or disable admin privileges for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Admin Status</p>
              <p className="text-sm text-gray-500">
                {isAdmin 
                  ? 'You currently have admin privileges' 
                  : 'You do not have admin privileges'}
              </p>
            </div>
            <Button
              variant={isAdmin ? "destructive" : "default"}
              onClick={handleToggleAdminStatus}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span>{isAdmin ? 'Remove Admin Status' : 'Make Me Admin'}</span>
              )}
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">What are admin privileges?</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Access to the admin dashboard</li>
              <li>Ability to manage all users</li>
              <li>Control over redemption items</li>
              <li>Points management capabilities</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPrivileges;
