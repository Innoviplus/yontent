
import HTMLContent from '@/components/HTMLContent';

interface MissionTermsProps {
  termsConditions?: string;
}

const MissionTerms = ({
  termsConditions
}: MissionTermsProps) => {
  if (!termsConditions) return null;
  
  return (
    <div className="space-y-3 mt-12">
      <h2 className="font-semibold text-xs">Terms & Conditions</h2>
      <div className="prose max-w-none text-xs text-gray-600">
        <HTMLContent content={termsConditions} />
      </div>
    </div>
  );
};

export default MissionTerms;
