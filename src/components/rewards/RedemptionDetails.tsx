
import React from 'react';
import { Check } from 'lucide-react';

const RedemptionDetails: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="font-medium mb-2">Redemption Details</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <span>Redemption requests are typically processed within 3-5 business days.</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <span>You will receive a notification once your redemption is approved.</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <span>Gift cards will be sent to your registered email address.</span>
        </li>
      </ul>
    </div>
  );
};

export default RedemptionDetails;
