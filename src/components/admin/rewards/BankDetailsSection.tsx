
import { RedemptionRequest } from '@/lib/types';

interface BankDetailsSectionProps {
  paymentDetails: NonNullable<RedemptionRequest['paymentDetails']>;
}

const BankDetailsSection = ({ paymentDetails }: BankDetailsSectionProps) => {
  const hasBankDetails = paymentDetails?.bank_details;

  if (!hasBankDetails) {
    return null;
  }

  const { bank_details } = paymentDetails;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-500 mb-2">Bank Account Details</p>
      <div className="bg-gray-50 p-4 rounded-md space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Bank Name</p>
            <p className="text-sm">{bank_details.bank_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Account Name</p>
            <p className="text-sm">{bank_details.account_name}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Account Number</p>
            <p className="text-sm">{bank_details.account_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">SWIFT Code</p>
            <p className="text-sm">{bank_details.swift_code || 'N/A'}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Recipient Name</p>
          <p className="text-sm">{bank_details.recipient_name}</p>
        </div>
        
        {bank_details.recipient_address && (
          <div>
            <p className="text-sm font-medium text-gray-500">Recipient Address</p>
            <p className="text-sm">{bank_details.recipient_address}</p>
          </div>
        )}
        
        {bank_details.recipient_mobile && (
          <div>
            <p className="text-sm font-medium text-gray-500">Recipient Mobile</p>
            <p className="text-sm">{bank_details.recipient_mobile}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankDetailsSection;
