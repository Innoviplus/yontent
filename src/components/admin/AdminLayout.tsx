
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

const AdminLayout = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is admin
  useEffect(() => {
    if (!userProfile?.isAdmin) {
      navigate("/dashboard");
    }
  }, [userProfile, navigate]);

  if (!userProfile?.isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <Shield className="h-6 w-6 text-brand-teal mr-2" />
          <h1 className="text-xl font-semibold text-brand-slate">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <a 
            href="/admin" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a 
            href="/admin/users" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            Users Management
          </a>
          <a 
            href="/admin/redemption-items" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            Redemption Items
          </a>
          <a 
            href="/admin/points" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            Points Management
          </a>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-brand-teal mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Admin</h1>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
