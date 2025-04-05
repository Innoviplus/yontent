
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SupportSection = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <HelpCircle className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold">Need Help?</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Having questions about this mission? Our support team is ready to assist you.
        </p>
        
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => window.open("https://api.whatsapp.com/send?phone=85254278104&text=mission%20inquiry", "_blank")}
        >
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
};

export default SupportSection;
