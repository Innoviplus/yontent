
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
    <div className="flex justify-between items-start bg-white rounded-xl p-6 shadow-card">
      <div>
        <div className="text-lg font-semibold text-gray-900">{displayDescription}</div>
        <div className="text-gray-500 text-sm mt-1">{format(new Date(transaction.createdAt), "MMM dd, yyyy")}</div>
        {transaction.source === 'REDEMPTION' && (
          <>
            <div className="text-xs text-orange-600">Points redeemed for reward</div>
            {transaction.redemptionStatus && (
              <div className={`text-xs mt-0.5 ${
                transaction.redemptionStatus === 'REJECTED' ? 'text-red-600' :
                transaction.redemptionStatus === 'APPROVED' ? 'text-green-600' :
                'text-blue-600'
              }`}>
                {`Redemption ${transaction.redemptionStatus.charAt(0) + transaction.redemptionStatus.slice(1).toLowerCase()}`}
              </div>
            )}
          </>
        )}
        {transaction.source === 'ADMIN_ADJUSTMENT' && (
          <div className="text-gray-500 text-xs mt-1">Manual adjustment by admin</div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={"font-bold text-base " + (isDeduction ? "text-gray-900" : "text-green-600")}>
          {isDeduction ? '-' : '+'}{Math.abs(transaction.amount)} <span className="font-semibold">points</span>
        </div>
        {transaction.source === 'REDEMPTION' && transaction.redemptionStatus === 'REJECTED' && (
          <div className="font-bold text-base text-green-600">
            +{Math.abs(transaction.amount)} <span className="font-semibold">points</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
