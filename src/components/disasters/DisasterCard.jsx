import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { disasterTypes } from '../../lib/data';
import { DisasterBadge, SeverityBadge } from './DisasterBadge';
import { MapPin, Users, Calendar } from 'lucide-react';

export default function DisasterCard({ disaster, onClick }) {
  const typeInfo = disasterTypes[disaster.disaster_type] || { emoji: '⚠️', label: disaster.disaster_type };

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{typeInfo.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{disaster.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{disaster.location_name}, {disaster.province}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        <DisasterBadge status={disaster.status} />
        <SeverityBadge severity={disaster.severity} />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {disaster.affected_people.toLocaleString('id-ID')} jiwa
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(disaster.incident_date), { addSuffix: true, locale: id })}
          </span>
        </div>
      </div>
    </div>
  );
}
