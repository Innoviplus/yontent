
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function AdminPrivileges() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdminChecking, setIsAdminChecking] = React.useState(false);

  // Check if user is an admin
  const checkAdminAccess = async () => {
    try {
      setIsAdminChecking(true);
      
      if (!user) {
        toast.error('You must be logged in to check admin status');
        return;
      }

      // Call the is_admin_user() function
      const { data, error } = await supabase.rpc('is_admin_user');
      
      if (error) {
        throw error;
      }

      if (data === true) {
        // User is an admin
        navigate('/admin');
      } else {
        // User is not an admin
        toast.error('You do not have admin privileges');
      }
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      toast.error(`Failed to check admin status: ${error.message}`);
    } finally {
      setIsAdminChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Access</CardTitle>
        <CardDescription>
          Access the admin dashboard if you have administrator privileges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Administrator access is required to manage missions, user accounts, and platform settings.
          This section is restricted to authorized personnel only.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={checkAdminAccess}
          disabled={isAdminChecking}
          variant="outline"
        >
          {isAdminChecking ? 'Checking...' : 'Access Admin Dashboard'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminPrivileges;
