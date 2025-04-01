
import RichTextFormField from '../fields/RichTextFormField';

const CompletionStepsSection = () => {
  return (
    <RichTextFormField 
      name="completionSteps"
      label="How To Complete This Mission"
      placeholder="Describe the steps to complete this mission"
    />
  );
};

export default CompletionStepsSection;
