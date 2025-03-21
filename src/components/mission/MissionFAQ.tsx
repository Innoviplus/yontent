
import { Card, CardContent } from '@/components/ui/card';
import { Book } from 'lucide-react';

const MissionFAQ = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Book className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold">FAQ</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">How do I get rewarded?</h3>
            <p className="text-sm text-gray-600">Once your submission is approved, points will be credited to your account within 48 hours.</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">What happens if my submission is rejected?</h3>
            <p className="text-sm text-gray-600">You'll receive feedback on why it was rejected and may resubmit if the mission is still active.</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">How long does verification take?</h3>
            <p className="text-sm text-gray-600">Submissions are typically reviewed within 24-48 hours.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionFAQ;
