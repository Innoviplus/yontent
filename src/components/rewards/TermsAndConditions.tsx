
import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
      <div className="prose text-sm text-gray-700">
        <p>By redeeming this reward, you agree to the following terms and conditions:</p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>Redemption requests are subject to review and approval.</li>
          <li>Points will be deducted from your account upon approval of your redemption request.</li>
          <li>Rewards cannot be exchanged for cash or other rewards once the redemption request is approved.</li>
          <li>Gift cards and vouchers are subject to the terms and conditions of the issuing company.</li>
          <li>We reserve the right to modify or cancel rewards at any time.</li>
          <li>Please allow 3-5 business days for processing of redemption requests.</li>
          <li>If you choose bank transfer, you must provide valid banking information upon request.</li>
          <li>Rewards are non-transferable and cannot be sold or transferred to another account.</li>
        </ol>
      </div>
    </div>
  );
};

export default TermsAndConditions;
