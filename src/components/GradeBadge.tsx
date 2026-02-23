import { CleanlinessGrade } from '@/types/toilet';
import { motion } from 'framer-motion';

interface GradeBadgeProps {
  grade: CleanlinessGrade;
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

const gradeConfig: Record<CleanlinessGrade, { label: string; colorClass: string; bgClass: string }> = {
  A: { label: 'Excellent', colorClass: 'grade-a', bgClass: 'bg-grade-a' },
  B: { label: 'Good', colorClass: 'grade-b', bgClass: 'bg-grade-b' },
  C: { label: 'Fair', colorClass: 'grade-c', bgClass: 'bg-grade-c' },
  D: { label: 'Poor', colorClass: 'grade-d', bgClass: 'bg-grade-d' },
};

const sizeClasses = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-4xl',
};

export function GradeBadge({ grade, score, size = 'md', showScore = true }: GradeBadgeProps) {
  const config = gradeConfig[grade];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-1"
    >
      <div
        className={`${sizeClasses[size]} ${config.bgClass} rounded-xl flex items-center justify-center font-mono font-bold text-primary-foreground shadow-elevated animate-pulse-glow`}
      >
        {grade}
      </div>
      {showScore && (
        <div className="text-center">
          <div className={`text-xs font-semibold ${config.colorClass}`}>{config.label}</div>
          <div className="text-xs text-muted-foreground font-mono">{score}/100</div>
        </div>
      )}
    </motion.div>
  );
}
