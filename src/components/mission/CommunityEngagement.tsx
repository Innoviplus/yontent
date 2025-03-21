
import { Card, CardContent } from '@/components/ui/card';

const CommunityEngagement = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">Community Engagement</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-brand-teal">127</p>
            <p className="text-sm text-gray-600">Participants</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-brand-teal">89%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-brand-teal">4.8/5</p>
            <p className="text-sm text-gray-600">Mission Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityEngagement;
