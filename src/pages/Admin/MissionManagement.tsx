
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const MissionManagement = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Mission Management</h1>
        <p className="text-gray-500">
          This page is under construction. Mission management functionality will be available soon.
        </p>
      </div>
    </AdminLayout>
  );
};

export default MissionManagement;
