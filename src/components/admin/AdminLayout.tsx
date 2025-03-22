
import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Users, Gift, CreditCard, LayoutDashboard } from "lucide-react";

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
          <Link 
            to="/admin" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="h-4 w-4 mr-2 text-gray-500" /> Dashboard
          </Link>
          <Link 
            to="/admin/users" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Users className="h-4 w-4 mr-2 text-gray-500" /> Users Management
          </Link>
          <Link 
            to="/admin/redemption-items" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Gift className="h-4 w-4 mr-2 text-gray-500" /> Redemption Items
          </Link>
          <Link 
            to="/admin/points" 
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <CreditCard className="h-4 w-4 mr-2 text-gray-500" /> Points Management
          </Link>
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
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile navigation */}
          <nav className="md:hidden px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/admin" 
              className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/users" 
              className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Users Management
            </Link>
            <Link 
              to="/admin/redemption-items" 
              className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Redemption Items
            </Link>
            <Link 
              to="/admin/points" 
              className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100"
            >
              Points Management
            </Link>
          </nav>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
