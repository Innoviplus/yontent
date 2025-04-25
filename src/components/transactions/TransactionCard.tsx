
import { format } from 'date-fns';
import { Transaction } from '@/types/transactions';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isRefund = transaction.type === "REFUNDED";
  const displayDescription = transaction.itemName && transaction.source === 'REDEMPTION' 
    ? `${isRefund ? 'Refunded: ' : 'Redeemed: '}${transaction.itemName}` 
    : transaction.description;

  return (
    <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-card">
      <div>
        <div className="text-lg font-semibold text-gray-900">{displayDescription}</div>
        <div className="text-gray-500 text-sm mt-1">{format(new Date(transaction.createdAt), "MMM dd, yyyy")}</div>
        {transaction.source === 'REDEMPTION' && (
          <div className={`text-xs ${isRefund ? 'text-green-600' : 'text-orange-600'}`}>
            {isRefund ? 'Points refunded from cancelled redemption' : 'Points redeemed for reward'}
          </div>
        )}
      </div>
      <div className={`font-bold text-base ${isRefund ? 'text-green-600' : 'text-[#ea384c]'}`}>
        {isRefund ? '+' : '-'}{Math.abs(transaction.amount)} <span className="font-semibold">points</span>
      </div>
    </div>
  );
};

export default TransactionCard;
