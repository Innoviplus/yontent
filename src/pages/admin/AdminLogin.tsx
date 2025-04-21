
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/auth/useAdminAuth";
import { Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
