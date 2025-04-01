
import RichTextFormField from '../fields/RichTextFormField';

const RequirementsSection = () => {
  return (
    <RichTextFormField 
      name="requirementDescription"
      label="Requirement Description"
      placeholder="Enter detailed requirements for completing this mission"
    />
  );
};

export default RequirementsSection;
