
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { MissionFormData } from '../../MissionFormSchema';
import RequirementsSection from './RequirementsSection';
import TermsSection from './TermsSection';
import CompletionStepsSection from './CompletionStepsSection';
import ProductDescriptionSection from './ProductDescriptionSection';
import ProductImagesSection from './ProductImagesSection';
import FAQSection from './FAQSection';

interface AdditionalDetailsProps {
  form: ReturnType<typeof useFormContext<MissionFormData>>;
}

const AdditionalDetails = ({ form }: AdditionalDetailsProps) => {
  // Use effect to log values for debugging
  useEffect(() => {
    // Log the form values whenever they change to help with debugging
    console.log('Form rich text values:', {
      requirementDescription: form.getValues('requirementDescription'),
      termsConditions: form.getValues('termsConditions'),
      completionSteps: form.getValues('completionSteps'),
      productDescription: form.getValues('productDescription'),
      faqContent: form.getValues('faqContent')
    });
  }, [form]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Additional Details</h3>
      
      <RequirementsSection />
      <TermsSection />
      <CompletionStepsSection />
      <ProductDescriptionSection />
      <ProductImagesSection />
      <FAQSection />
    </div>
  );
};

export default AdditionalDetails;
