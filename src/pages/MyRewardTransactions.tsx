
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import TransactionsList from '@/components/transactions/TransactionsList';
import { useTransactions } from '@/hooks/useTransactions';
import { useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import RewardHeader from '@/components/rewards/RewardHeader';
import { RefreshCcw } from 'lucide-react';

const MyRewardTransactions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { transactions, loading, refreshing, setRefreshing, fetchTransactions } = useTransactions(user?.id);
  
  usePageTitle('My Transactions');

  useEffect(() => {
    if (user?.id) {
      // Initial fetch on component mount
      fetchTransactions();
    }
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <RewardHeader title="Back to My Dashboard" />
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Transactions</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <TransactionsList 
          transactions={transactions} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default MyRewardTransactions;
