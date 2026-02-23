import { ToiletFacility } from '@/types/toilet';
import { GradeBadge } from './GradeBadge';
import { motion } from 'framer-motion';
import { MapPin, Star, Navigation, Clock, Accessibility, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToiletCardProps {
  toilet: ToiletFacility;
  onSelect?: (toilet: ToiletFacility) => void;
  onDirections?: (toilet: ToiletFacility) => void;
  compact?: boolean;
}

const statusLabels: Record<string, { label: string; emoji: string }> = {
  clean: { label: 'Clean', emoji: '🟢' },
  'needs-cleaning': { label: 'Needs Cleaning', emoji: '🟡' },
  unhygienic: { label: 'Unhygienic', emoji: '🔴' },
};

const opLabels: Record<string, { label: string; class: string }> = {
  open: { label: 'Open', class: 'bg-grade-a/15 text-grade-a' },
  closed: { label: 'Closed', class: 'bg-grade-d/15 text-grade-d' },
  maintenance: { label: 'Maintenance', class: 'bg-grade-c/15 text-grade-c' },
};

export function ToiletCard({ toilet, onSelect, onDirections, compact }: ToiletCardProps) {
  const statusInfo = statusLabels[toilet.status];
  const opInfo = opLabels[toilet.operationalStatus];
  const timeSinceCleaned = Math.round((Date.now() - new Date(toilet.lastCleaned).getTime()) / 60000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border rounded-xl p-4 shadow-card cursor-pointer transition-shadow hover:shadow-elevated"
      onClick={() => onSelect?.(toilet)}
    >
      <div className="flex items-start gap-3">
        <GradeBadge grade={toilet.grade} score={toilet.hygieneScore} size="sm" showScore={false} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm text-card-foreground truncate">{toilet.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${opInfo.class}`}>
              {opInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{toilet.address}</span>
          </div>
          {!compact && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span>{statusInfo.emoji} {statusInfo.label}</span>
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-grade-c fill-grade-c" />
                {toilet.userRating} ({toilet.totalReviews})
              </span>
              <span className="flex items-center gap-0.5 text-muted-foreground">
                <Clock className="w-3 h-3" />
                {timeSinceCleaned}m ago
              </span>
              {toilet.isAccessible && <Accessibility className="w-3 h-3 text-secondary" />}
              {toilet.isFree && <span className="text-primary font-medium">Free</span>}
              {toilet.distance !== undefined && (
                <span className="flex items-center gap-0.5 text-secondary font-medium">
                  <Navigation className="w-3 h-3" />
                  {toilet.distance} km
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {onDirections && (
        <Button
          size="sm"
          className="w-full mt-3 text-xs gradient-hero text-primary-foreground border-0"
          onClick={(e) => { e.stopPropagation(); onDirections(toilet); }}
        >
          <Navigation className="w-3 h-3 mr-1" /> Get Directions
        </Button>
      )}
    </motion.div>
  );
}
