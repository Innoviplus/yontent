import { Card, CardContent } from '@/components/ui/card';
import HTMLContent from '@/components/HTMLContent';
interface MissionTermsProps {
  termsConditions?: string;
}
const MissionTerms = ({
  termsConditions
}: MissionTermsProps) => {
  if (!termsConditions) return null;
  return <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-3 text-xs">Terms & Conditions</h2>
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
          <HTMLContent content={termsConditions} />
        </div>
      </CardContent>
    </Card>;
};
export default MissionTerms;