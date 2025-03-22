
import { Loader2 } from "lucide-react";
import { usePointsManagement } from "@/hooks/admin/usePointsManagement";
import UserSearchCard from "@/components/admin/points/UserSearchCard";
import PointsFormCard from "@/components/admin/points/PointsFormCard";

const PointsManagement = () => {
  const {
    users,
    isLoading,
    selectedUser,
    form,
    handleAddPoints,
    handleSelectUser,
    handleClearUser
  } = usePointsManagement();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Points Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        />
      </div>
    </div>
  );
};

export default PointsManagement;
