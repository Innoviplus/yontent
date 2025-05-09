
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserSearchCard from './UserSearchCard';
import TransactionFormCard from './TransactionFormCard';
import { transactionSchema, type TransactionFormValues } from './TransactionFormCard';
import { supabase } from '@/integrations/supabase/client';
import { updateUserPoints } from '@/services/auth/points';

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
      console.log('Starting transaction submission with values:', values);

      const { amount, type, description, userId } = values;
      
      // First fetch the user's points in the profiles table
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
      const finalAmount = type === 'ADD' ? amount : -amount;
      const newPoints = currentPoints + finalAmount;
      
      // For deductions, check if user has enough points
      if (type === 'DEDUCT' && currentPoints < amount) {
        toast.error(`User only has ${currentPoints} points, cannot deduct ${amount} points.`);
        setIsSubmitting(false);
        return;
      }
      
      // Update the user's points in the database
      const { error: updateError } = await updateUserPoints(userId, newPoints);
      
      if (updateError) {
        console.error('Error updating user points:', updateError);
        toast.error('Failed to update user points');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Points updated successfully. New total:', newPoints);
      
      // Make sure we properly tag the source in the description
      const fullDescription = `${description.trim()} [ADMIN_ADJUSTMENT]`;
      
      // Create a transaction record
      const { data: transactionData, error: transactionError } = await supabase.rpc(
        'admin_add_point_transaction',
        {
          p_user_id: userId,
          p_amount: finalAmount,
          p_type: type === 'ADD' ? 'ADJUSTED' : 'DEDUCTED',
          p_description: fullDescription
        }
      );
      
      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
        toast.error('Failed to log transaction');
        
        // Attempt to revert the point change
        try {
          await updateUserPoints(userId, currentPoints);
          console.log('Points reverted due to transaction error');
        } catch (revertError) {
          console.error('Failed to revert points:', revertError);
        }
        
        setIsSubmitting(false);
        return;
      }
      
      console.log('Transaction logged successfully:', transactionData);
      toast.success(`Successfully ${type === 'ADD' ? 'added' : 'deducted'} ${amount} points`);
      
      // Update the selected user's points
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          points: newPoints
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
