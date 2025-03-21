
import { Card, CardContent } from '@/components/ui/card';

const MissionTestimonials = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">What Participants Say</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 italic mb-2">"This mission was easy to complete and the reward was credited to my account within 24 hours. Highly recommend!"</p>
            <p className="text-sm text-gray-600 font-medium">— Sarah T.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 italic mb-2">"I was already looking to buy this product, so getting rewarded for sharing my opinion was a great bonus."</p>
            <p className="text-sm text-gray-600 font-medium">— Michael K.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionTestimonials;
