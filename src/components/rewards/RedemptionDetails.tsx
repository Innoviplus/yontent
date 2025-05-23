
import React from 'react';
import HTMLContent from '@/components/HTMLContent';

interface RedemptionDetailsProps {
  redemptionDetails?: string;
}

const RedemptionDetails: React.FC<RedemptionDetailsProps> = ({ redemptionDetails }) => {
  // Default content if no redemption details are provided
  const defaultDetails = `
    <li>Redemption requests are typically processed within 3-5 business days.</li>
    <li>You will receive a notification once your redemption is approved.</li>
    <li>Gift cards will be sent to your registered email address.</li>
  `;
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="font-medium mb-2">Redemption Details</h3>
      <div className="space-y-2 text-sm prose prose-sm max-w-none">
        <HTMLContent content={redemptionDetails || defaultDetails} />
      </div>
    </div>
  );
};

export default RedemptionDetails;
