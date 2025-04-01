
import RichTextFormField from '../fields/RichTextFormField';

const ProductDescriptionSection = () => {
  return (
    <RichTextFormField 
      name="productDescription"
      label="About the Product or Service"
      placeholder="Describe the product or service for this mission"
    />
  );
};

export default ProductDescriptionSection;
