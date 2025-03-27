
import { Card, CardContent } from '@/components/ui/card';
import { Mission } from '@/lib/types';
import { Check, Users } from 'lucide-react';

interface MissionDetailsProps {
  mission: Mission;
  currentSubmissions?: number;
  totalSubmissions?: number;
}

const MissionDetails = ({ mission, currentSubmissions = 0, totalSubmissions }: MissionDetailsProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">Mission Details</h2>
        <p className="text-gray-700 mb-6">{mission.description}</p>
        
        {mission.requirementDescription && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <ul className="space-y-2">
                {mission.requirementDescription.split('\n').map((req, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-brand-teal flex-shrink-0 mt-0.5" />
                    <span>{req || 'Complete the mission requirements'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {mission.maxSubmissionsPerUser && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Submissions</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                <span>Max per user: {mission.maxSubmissionsPerUser}</span>
              </div>
              
              {totalSubmissions !== undefined && (
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                  <span>Current progress: {currentSubmissions} / {totalSubmissions} total submissions</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {mission.type === 'REVIEW' && (
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
        
        {mission.type === 'RECEIPT' && (
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
        
        {mission.termsConditions && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
              <p>{mission.termsConditions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionDetails;
