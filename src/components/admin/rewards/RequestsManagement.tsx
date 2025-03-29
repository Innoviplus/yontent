
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import { RedemptionRequest } from '@/lib/types';
import EmptyRequestsState from './EmptyRequestsState';
import RequestsLoadingState from './RequestsLoadingState';
import RequestStatusBadge from './RequestStatusBadge';

interface RequestsManagementProps {
  requests: RedemptionRequest[];
  isLoading: boolean;
  isRefreshing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => Promise<void>;
  onApprove: (requestId: string) => Promise<boolean>;
  onReject: (requestId: string) => Promise<boolean>;
}

const RequestsManagement = ({
  requests,
  isLoading,
  isRefreshing,
  activeTab,
  setActiveTab,
  onRefresh,
  onApprove,
  onReject
}: RequestsManagementProps) => {
  
  // Filter requests based on active tab
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') return req.status === 'PENDING';
    if (activeTab === 'approved') return req.status === 'APPROVED';
    if (activeTab === 'rejected') return req.status === 'REJECTED';
    return true;
  });

  if (isLoading) {
    return <RequestsLoadingState />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Redemption Requests</CardTitle>
          <CardDescription>Manage user reward redemption requests</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="ml-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredRequests.length === 0 ? (
              <EmptyRequestsState />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.userId.slice(0, 8)}...</TableCell>
                      <TableCell>{request.itemId.slice(0, 8)}...</TableCell>
                      <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <RequestStatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        {request.status === 'PENDING' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => onApprove(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => onReject(request.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RequestsManagement;
