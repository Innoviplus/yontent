
import { Card, CardContent } from '@/components/ui/card';
import { Mission } from '@/lib/types';
import { Check, Gauge, Users } from 'lucide-react';
import HTMLContent from '@/components/HTMLContent';

interface MissionDetailsProps {
  mission: Mission;
}

const MissionDetails = ({ mission }: MissionDetailsProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">Mission Details</h2>
        <div className="text-gray-700 mb-6">
          <HTMLContent content={mission.description} />
        </div>
        
        {mission.requirementDescription && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <HTMLContent content={mission.requirementDescription} />
            </div>
          </div>
        )}

        {mission.productDescription && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About the Product or Service</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <HTMLContent content={mission.productDescription} />
              
              {mission.productImages && mission.productImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mission.productImages.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {mission.completionSteps && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">How To Complete This Mission</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <HTMLContent content={mission.completionSteps} />
            </div>
          </div>
        )}
        
        {!mission.completionSteps && mission.type === 'REVIEW' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">How To Complete This Mission</h3>
            <ol className="list-decimal list-inside space-y-3 pl-2">
              <li>Purchase the product from any retailer</li>
              <li>Try out the product for at least a few days</li>
              <li>Write your honest, detailed review</li>
              <li>Include at least one photo of your product</li>
              <li>Submit your review through our platform</li>
            </ol>
          </div>
        )}
        
        {!mission.completionSteps && mission.type === 'RECEIPT' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">How To Complete This Mission</h3>
            <ol className="list-decimal list-inside space-y-3 pl-2">
              <li>Purchase the product from an authorized retailer</li>
              <li>Take a clear photo of your receipt</li>
              <li>Make sure the retailer name, date, and product details are visible</li>
              <li>Upload the receipt through our platform</li>
              <li>Our team will verify your submission</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionDetails;
