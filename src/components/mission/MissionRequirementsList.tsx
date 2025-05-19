
import HTMLContent from '@/components/HTMLContent';

interface MissionRequirementsListProps {
  requirements?: string[];
  title?: string;
  requirementDescription?: string;
}

const MissionRequirementsList = ({ 
  requirements = [], 
  requirementDescription,
  title = "Requirements:" 
}: MissionRequirementsListProps) => {
  // If there's a requirement description from the admin panel, use that
  if (requirementDescription) {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <div className="p-4 bg-gray-50 rounded-lg">
          <HTMLContent content={requirementDescription} />
        </div>
      </div>
    );
  }
  
  // Fall back to the array-based requirements if no description is provided
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
      </ul>
    </div>
  );
};

export default MissionRequirementsList;
