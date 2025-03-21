
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SupportSection = () => {
  return (
    <Card className="bg-gray-50 border-none">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
        <p className="text-sm text-gray-600 mb-4">
          If you have any questions about this mission, please contact our support team.
        </p>
        <Button 
          variant="outline" 
          className="w-full" 
          asChild
        >
          <a 
            href="https://api.whatsapp.com/send?phone=85254278104?text=mission%20inquiry" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Contact Support
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SupportSection;
