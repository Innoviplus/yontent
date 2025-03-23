
import { Loader2, Shield, CreditCard, Database } from "lucide-react";
import { usePointsManagement } from "@/hooks/admin/usePointsManagement";
import UserSearchCard from "@/components/admin/points/UserSearchCard";
import PointsFormCard from "@/components/admin/points/PointsFormCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionFormCard from "@/components/admin/points/TransactionFormCard";

const PointsManagement = () => {
  const {
    users,
    isLoading,
    selectedUser,
    form,
    handleAddPoints,
    handleSelectUser,
    handleClearUser,
    handleSetAsSuperAdmin,
    handleAddInitialPoints,
    handleAddTransaction,
    transactionForm,
    isAddingPoints,
    isSettingSuperAdmin,
    isAddingInitialPoints,
    isAddingTransaction
  } = usePointsManagement();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }
  
  // Find yyleung user for super admin assignment
  const yyleungUser = users?.find(user => user.username === "yyleung");
  
  // Find hotmail.com user for initial points
  const hotmailUser = users?.find(user => user.username?.includes("hotmail.com"));
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Points Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* User Search */}
        <UserSearchCard
          users={users}
          isLoading={isLoading}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          onClearUser={handleClearUser}
        />
        
        {/* Points Form */}
        <PointsFormCard
          form={form}
          onSubmit={handleAddPoints}
          isUserSelected={!!selectedUser}
          isSubmitting={isAddingPoints}
        />
      </div>
      
      {/* Transaction Form Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Transaction Record</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFormCard 
            form={transactionForm}
            onSubmit={handleAddTransaction}
            isUserSelected={!!selectedUser}
            isSubmitting={isAddingTransaction}
          />
        </CardContent>
      </Card>
      
      {/* Admin Actions Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {yyleungUser && (
              <Button 
                onClick={() => handleSetAsSuperAdmin(yyleungUser.id)}
                disabled={isSettingSuperAdmin}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isSettingSuperAdmin && <Loader2 className="h-4 w-4 animate-spin" />}
                <Shield className="h-4 w-4" />
                Set "yyleung" as Super Admin
              </Button>
            )}
            
            {hotmailUser && (
              <Button 
                onClick={() => handleAddInitialPoints(hotmailUser.username || "")}
                disabled={isAddingInitialPoints}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isAddingInitialPoints && <Loader2 className="h-4 w-4 animate-spin" />}
                <CreditCard className="h-4 w-4" />
                Add 100 Points to "{hotmailUser.username}"
              </Button>
            )}
          </div>
          
          {!yyleungUser && (
            <p className="text-yellow-600">User "yyleung" not found in the system.</p>
          )}
          
          {!hotmailUser && (
            <p className="text-yellow-600">No user with "hotmail.com" found in the system.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsManagement;
