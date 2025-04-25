
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserSearchCard from './UserSearchCard';
import TransactionFormCard from './TransactionFormCard';
import { transactionSchema, type TransactionFormValues } from './TransactionFormCard';
import { logPointsTransaction } from '@/hooks/admin/utils/points/transactionLog';
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
      
      // First update the user's points in the profiles table
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching user points:', userError);
        toast.error('Failed to fetch user points');
        setIsSubmitting(false);
        return;
      }
      
      const currentPoints = userData?.points || 0;
      let newPoints = currentPoints;
      
      if (type === 'EARNED' || type === 'ADJUSTED' || type === 'REFUNDED') {
        newPoints = currentPoints + amount;
      } else if (type === 'REDEEMED') {
        // Check if user has enough points
        if (currentPoints < amount) {
          toast.error(`User only has ${currentPoints} points, cannot deduct ${amount} points.`);
          setIsSubmitting(false);
          return;
        }
        newPoints = currentPoints - amount;
      }
      
      // Update the user's points in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating user points:', updateError);
        toast.error('Failed to update user points');
        setIsSubmitting(false);
        return;
      }
      
      // Now log the transaction in the point_transactions table
      // Ensure we tag the source properly in the description
      let fullDescription = description;
      if (!fullDescription.includes('[')) {
        fullDescription = `${description} [${source}]`;
      }
      
      console.log('Inserting transaction record:', {
        user_id: userId,
        amount: amount,
        type: type,
        description: fullDescription
      });
      
      const { data: transactionData, error: transactionError } = await supabase
        .from('point_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          type: type,
          description: fullDescription
        })
        .select();
      
      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
        toast.error('Failed to log transaction');
        
        // Revert the points update in case of error
        await supabase
          .from('profiles')
          .update({ points: currentPoints })
          .eq('id', userId);
          
        setIsSubmitting(false);
        return;
      }
      
      console.log('Transaction logged successfully:', transactionData);
      
      toast.success(`Successfully ${type === 'REDEEMED' ? 'deducted' : 'added'} ${amount} points`);
      handleClearUser();
      form.reset();
      
      // Reset form with default source
      form.setValue('source', 'ADMIN_ADJUSTMENT');
      
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
