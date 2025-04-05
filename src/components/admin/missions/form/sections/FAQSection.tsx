
import { useFormContext } from 'react-hook-form';
import { MissionFormData } from '../../MissionFormSchema';
import RichTextFormField from '../fields/RichTextFormField';

const FAQSection = () => {
  const form = useFormContext<MissionFormData>();
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-sm font-medium">Frequently Asked Questions</h3>
      <p className="text-sm text-gray-500">Add common questions and answers about this mission.</p>
      
      <RichTextFormField
        name="faqContent"
        label="FAQ Content"
        placeholder="Enter frequently asked questions and answers here..."
      />
    </div>
  );
};

export default FAQSection;
