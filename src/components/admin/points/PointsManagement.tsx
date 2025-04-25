
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserSearchCard from './UserSearchCard';
import TransactionFormCard from './TransactionFormCard';
import { transactionSchema, type TransactionFormValues } from './TransactionFormCard';
import { addPointsToUser, deductPointsFromUser } from '@/hooks/admin/utils/points';
import { supabase } from '@/integrations/supabase/client';

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

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: 'EARNED',
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

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar, points')
      .ilike('username', `%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      return;
    }

    setUsers(data || []);
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

      const { amount, type, source, description, userId } = values;
      let result;

      if (type === 'EARNED' || type === 'ADJUSTED') {
        result = await addPointsToUser(
          userId, 
          amount, 
          type, 
          source === 'MISSION_REVIEW' || source === 'RECEIPT_SUBMISSION' || source === 'ADMIN_ADJUSTMENT' ? 
            source : 'ADMIN_ADJUSTMENT',
          description
        );
      } else {
        result = await deductPointsFromUser(
          userId, 
          amount, 
          source === 'REDEMPTION' || source === 'ADMIN_ADJUSTMENT' ? 
            source : 'ADMIN_ADJUSTMENT',
          description
        );
      }

      if (result.success) {
        toast.success(`Points ${type === 'REDEEMED' ? 'deducted' : 'added'} successfully`);
        handleClearUser();
        form.reset();
      } else {
        toast.error(result.error || `Failed to ${type === 'REDEEMED' ? 'deduct' : 'add'} points`);
      }
    } catch (error) {
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
          isLoading={false}
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
