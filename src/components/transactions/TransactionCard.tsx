
import { format } from 'date-fns';
import { Transaction } from '@/types/transactions';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isDeduction = transaction.type === "REDEEMED" || transaction.type === "DEDUCTED";
  const displayDescription = transaction.itemName && transaction.source === 'REDEMPTION' 
    ? `Redeemed: ${transaction.itemName}` 
    : transaction.description;

  return (
    <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-card">
      <div>
        <div className="text-lg font-semibold text-gray-900">{displayDescription}</div>
        <div className="text-gray-500 text-sm mt-1">{format(new Date(transaction.createdAt), "MMM dd, yyyy")}</div>
        {transaction.source === 'REDEMPTION' && (
          <div className="text-xs text-orange-600">Points redeemed for reward</div>
        )}
        {transaction.source === 'ADMIN_ADJUSTMENT' && (
          <div className="text-gray-500 text-xs mt-1">Manual adjustment by admin</div>
        )}
      </div>
      <div className={"font-bold text-base " + (isDeduction ? "text-[#ea384c]" : "text-green-600")}>
        {isDeduction ? '-' : '+'}{Math.abs(transaction.amount)} <span className="font-semibold">points</span>
      </div>
    </div>
  );
};

export default TransactionCard;
