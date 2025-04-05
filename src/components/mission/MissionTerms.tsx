
import HTMLContent from '@/components/HTMLContent';

interface MissionTermsProps {
  termsConditions?: string;
}

const MissionTerms = ({
  termsConditions
}: MissionTermsProps) => {
  if (!termsConditions) return null;
  
  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg">Terms & Conditions</h2>
      <div className="prose max-w-none text-sm text-gray-700">
        <HTMLContent content={termsConditions} />
      </div>
    </div>
  );
};

export default MissionTerms;
