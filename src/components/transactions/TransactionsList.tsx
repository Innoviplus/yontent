
import { Transaction } from '@/types/transactions';
import TransactionCard from './TransactionCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionsListProps {
  transactions: Transaction[];
  loading: boolean;
}

const TransactionsList = ({ transactions, loading }: TransactionsListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-16 bg-white rounded-xl space-y-4">
        <p className="text-lg font-medium">No transactions found.</p>
        <p className="text-sm text-gray-600 px-8">When you earn or redeem points, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionsList;
