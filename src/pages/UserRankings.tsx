
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopUsers } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { usePageTitle } from '@/hooks/usePageTitle';

// Define a type for the top user data that matches what's returned from the API
interface TopUser {
  id: string;
  username: string;
  points: number;
  avatar?: string;
}

const UserRankings = () => {
  usePageTitle('Rankings');
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState<TopUser[] | null>(null);
  const { isLoading, error, data } = useQuery({
    queryKey: ['topUsers'],
    queryFn: getTopUsers,
  });

  useEffect(() => {
    if (data) {
      setTopUsers(data);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-brand-teal">
          <Sparkles className="h-6 w-6" />
          User Rankings
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topUsers && topUsers.map((topUser, index) => (
            <div key={topUser.id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">
                {index + 1}. {topUser.username}
              </h2>
              <p className="text-gray-600">Points: {topUser.points}</p>
              {user && user.email && topUser.username && (
                <>
                  {user.email !== topUser.username && (
                    <Link to={`/user/${topUser.username}`} className="text-brand-teal hover:underline block mt-4">
                      View Profile
                    </Link>
                  )}
                  {user.email === topUser.username && (
                    <p className="text-gray-500 mt-4">This is you!</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRankings;
