
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Shield } from "lucide-react";

interface UserSearchFormProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  searching: boolean;
}

export function UserSearchForm({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
  searching
}: UserSearchFormProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-brand-teal" />
        <h2 className="text-lg font-semibold">Find User to Grant Admin Rights</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 mb-4">
        <div>
          <Label htmlFor="searchQuery">Search by Username or Email</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Enter username or email"
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={searching || !searchQuery.trim()} 
              className="min-w-24"
            >
              {searching ? "Searching..." : "Search"}
              {!searching && <Search className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
