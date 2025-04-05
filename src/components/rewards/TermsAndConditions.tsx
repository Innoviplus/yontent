import React from 'react';
import HTMLContent from '@/components/HTMLContent';
interface TermsAndConditionsProps {
  termsConditions?: string;
}
const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  termsConditions
}) => {
  // Default terms if none are provided
  const defaultTerms = `
    <p>By redeeming this reward, you agree to the following terms and conditions:</p>
    <ol class="list-decimal pl-5 space-y-2 mt-2">
      <li>Redemption requests are subject to review and approval.</li>
      <li>Points will be deducted from your account upon approval of your redemption request.</li>
      <li>Rewards cannot be exchanged for cash or other rewards once the redemption request is approved.</li>
      <li>Gift cards and vouchers are subject to the terms and conditions of the issuing company.</li>
      <li>We reserve the right to modify or cancel rewards at any time.</li>
      <li>Please allow 3-5 business days for processing of redemption requests.</li>
      <li>If you choose bank transfer, you must provide valid banking information upon request.</li>
      <li>Rewards are non-transferable and cannot be sold or transferred to another account.</li>
    </ol>
  `;
  return <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="font-bold mb-4 text-xs">Terms & Conditions</h2>
      <HTMLContent content={termsConditions || defaultTerms} className="text-gray-700 max-w-none" />
    </div>;
};
export default TermsAndConditions;