
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserSearchCard from './UserSearchCard';
import TransactionFormCard from './TransactionFormCard';
import { transactionSchema, type TransactionFormValues } from './TransactionFormCard';
import { addPointsToUser } from '@/hooks/admin/utils/points';
import { searchUsersByUsernameOrEmail } from '@/services/admin/users';

interface UserData {
  id: string;
  username?: string;
  avatar?: string;
  points: number;
}

const PointsManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: 'ADD',
      source: 'ADMIN_ADJUSTMENT',
      description: '',
      userId: ''
    }
  });

  const searchUsers = async (query: string) => {
    if (!query) {
      setUsers([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchUsersByUsernameOrEmail(query);
      
      // Format results to match UserData interface
      const formattedUsers = results.map(user => ({
        id: user.id,
        username: user.username || 'Unknown',
        avatar: user.avatar || undefined,
        points: user.points || 0
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (user: UserData) => {
    setSelectedUser(user);
    form.setValue('userId', user.id);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    form.setValue('userId', '');
  };

  const onSubmit = async (values: TransactionFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Starting transaction submission with values:', values);

      const { amount, type, description, userId } = values;
      
      // Convert to correct transaction type format expected by the points service
      const transactionType = type === 'ADD' ? 'ADJUSTED' : 'DEDUCTED';
      const pointsAmount = type === 'ADD' ? amount : -amount;
      
      // Make sure we properly tag the source in the description
      const fullDescription = `${description.trim()} [ADMIN_ADJUSTMENT]`;
      
      // Call the points service to add/deduct points
      const result = await addPointsToUser(
        userId,
        pointsAmount,
        transactionType as any,
        'ADMIN_ADJUSTMENT',
        fullDescription
      );
      
      if (!result.success) {
        console.error('Error updating user points:', result.error);
        toast.error(`Failed to ${type === 'ADD' ? 'add' : 'deduct'} points: ${result.error}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log('Points transaction successful. New total:', result.newPointsTotal);
      toast.success(`Successfully ${type === 'ADD' ? 'added' : 'deducted'} ${amount} points`);
      
      // Update the selected user's points
      if (selectedUser && result.newPointsTotal) {
        setSelectedUser({
          ...selectedUser,
          points: result.newPointsTotal
        });
      }
      
      // Reset form to defaults except userId
      form.reset({
        amount: 0,
        type: 'ADD',
        source: 'ADMIN_ADJUSTMENT',
        description: '',
        userId: userId
      });
    } catch (error: any) {
      console.error('Error processing points transaction:', error);
      toast.error('Failed to process points transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Points Management</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <UserSearchCard
          users={users}
          isLoading={isSearching}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
          onClearUser={handleClearUser}
          onSearch={searchUsers}
        />

        <TransactionFormCard
          form={form}
          onSubmit={onSubmit}
          isUserSelected={!!selectedUser}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default PointsManagement;
