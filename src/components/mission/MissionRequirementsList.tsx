
interface MissionRequirementsListProps {
  requirements: string[];
  title?: string;
}

const MissionRequirementsList = ({ 
  requirements, 
  title = "Requirements:" 
}: MissionRequirementsListProps) => {
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
