
import { Badge } from "@/components/ui/badge";
import { Participation } from "@/hooks/admin/participations/types";

interface ParticipationSummaryProps {
  participation: Participation;
}

const ParticipationSummary = ({ participation }: ParticipationSummaryProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
      <div>
        <p className="text-gray-600 font-medium">Mission</p>
        <p className="font-semibold text-gray-900">{participation.mission?.title || 'Unknown mission'}</p>
      </div>
      <div>
        <p className="text-gray-600 font-medium">Submitted by</p>
        <p className="font-semibold text-gray-900">{participation.profile?.username || 'Unknown user'}</p>
      </div>
      <div>
        <p className="text-gray-600 font-medium">Submitted on</p>
        <p className="font-semibold text-gray-900">{new Date(participation.created_at).toLocaleDateString()}</p>
      </div>
      <div>
        <p className="text-gray-600 font-medium">Status</p>
        <Badge className={
          participation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
          participation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }>
          {participation.status}
        </Badge>
      </div>
    </div>
  );
};

export default ParticipationSummary;
