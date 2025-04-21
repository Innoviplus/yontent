
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/auth/useAdminAuth";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { fetchUserRoles } from "@/services/admin/users";

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  
  // Check if redirected from admin page with notAdmin flag
  const notAdmin = (location.state as any)?.notAdmin;

  // Check if current user is admin and redirect if so
  useEffect(() => {
    const checkIsAdmin = async () => {
      if (!currentUser) return;
      
      setCheckingAdmin(true);
      try {
        const roles = await fetchUserRoles(currentUser.id);
        if (roles.includes("admin")) {
          navigate("/admin", { replace: true });
        } else if (notAdmin) {
          setError("You do not have admin privileges.");
        }
      } catch (err) {
        console.error("Error checking admin role:", err);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!authLoading && currentUser) {
      checkIsAdmin();
    }
  }, [currentUser, authLoading, navigate, notAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(identifier, password);
    if (result?.error) {
      setError(result.error.message || "Login failed");
      return;
    }
    // Redirect to /admin panel after successful login
    navigate("/admin", { replace: true });
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <Shield className="h-10 w-10 text-brand-teal mb-2" />
          <h2 className="text-2xl font-bold mb-1">Admin Panel Login</h2>
          <span className="text-gray-500 text-sm text-center mb-2">
            Please log in with your admin account.
          </span>
        </div>
        
        {notAdmin && !error && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 flex items-start">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm">You need admin privileges to access this area.</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full py-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Log In"}
          </Button>
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/")}
              className="text-sm text-gray-500"
            >
              Back to Home
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
