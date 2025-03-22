
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, FileText, Gift, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: usersCount }, 
        { count: reviewsCount },
        { count: missionsCount },
        { count: redemptionItemsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('missions').select('*', { count: 'exact', head: true }),
        supabase.from('redemption_items').select('*', { count: 'exact', head: true }),
      ]);
      
      // Get pending redemption requests count
      const { count: pendingRedemptionsCount } = await supabase
        .from('redemption_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');
      
      return {
        usersCount: usersCount || 0,
        reviewsCount: reviewsCount || 0,
        missionsCount: missionsCount || 0,
        redemptionItemsCount: redemptionItemsCount || 0,
        pendingRedemptionsCount: pendingRedemptionsCount || 0
      };
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats?.usersCount}</p>
              <Users className="h-8 w-8 text-brand-teal opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats?.reviewsCount}</p>
              <FileText className="h-8 w-8 text-blue-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats?.missionsCount}</p>
              <CreditCard className="h-8 w-8 text-purple-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Redemption Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{stats?.redemptionItemsCount}</p>
              <Gift className="h-8 w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/redemption-items">
                  <Gift className="mr-2 h-4 w-4" />
                  Manage Redemption Items
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link to="/admin/points">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Award Points to Users
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Redemption Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-2xl font-bold">{stats?.pendingRedemptionsCount}</p>
              <p className="text-sm text-gray-500">Pending Redemption Requests</p>
            </div>
            
            {stats?.pendingRedemptionsCount ? (
              <Button asChild>
                <Link to="/admin/redemption-requests">Review Pending Requests</Link>
              </Button>
            ) : (
              <p className="text-sm text-gray-500">No pending requests to review</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
