
import { useState } from 'react';
import { searchUsersByUsernameOrEmail } from '@/services/admin/users';
import { toast } from 'sonner';

type UserWithRoles = {
  id: string;
  username: string | null;
  email: string | null;
  roles: string[];
};

export function useUserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserWithRoles[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    try {
      console.log(`Searching users with query: ${query}`);
      const results = await searchUsersByUsernameOrEmail(query);
      console.log(`Found ${results.length} results`);
      setSearchResults(results);
    } catch (error: any) {
      console.error("Error searching users:", error);
      setSearchError(error?.message || "Failed to search users");
      toast.error("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    searching,
    searchError,
    handleSearch
  };
}
