import { ToiletFacility } from '@/types/toilet';
import { ToiletCard } from './ToiletCard';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface NearbyAlternativesProps {
  alternatives: ToiletFacility[];
  reason: string;
  onSelect: (toilet: ToiletFacility) => void;
}

export function NearbyAlternatives({ alternatives, reason, onSelect }: NearbyAlternativesProps) {
  if (alternatives.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 shadow-elevated"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-grade-c" />
        <span className="text-sm font-semibold text-card-foreground">Better Alternatives Nearby</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{reason}</p>
      <div className="space-y-2">
        {alternatives.map(alt => (
          <ToiletCard
            key={alt.id}
            toilet={alt}
            onSelect={onSelect}
            onDirections={(t) => {
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${t.lat},${t.lng}`, '_blank');
            }}
            compact
          />
        ))}
      </div>
    </motion.div>
  );
}
