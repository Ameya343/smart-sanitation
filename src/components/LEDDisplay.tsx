import { CleanlinessGrade } from '@/types/toilet';
import { motion } from 'framer-motion';

interface LEDDisplayProps {
  grade: CleanlinessGrade;
  score: number;
  name: string;
}

const gradeColors: Record<CleanlinessGrade, string> = {
  A: 'text-grade-a',
  B: 'text-grade-b',
  C: 'text-grade-c',
  D: 'text-grade-d',
};

const gradeBg: Record<CleanlinessGrade, string> = {
  A: 'from-grade-a/20 to-grade-a/5',
  B: 'from-grade-b/20 to-grade-b/5',
  C: 'from-grade-c/20 to-grade-c/5',
  D: 'from-grade-d/20 to-grade-d/5',
};

export function LEDDisplay({ grade, score, name }: LEDDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-b ${gradeBg[grade]} border border-border rounded-2xl p-6 backdrop-blur-sm`}
    >
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        Live Hygiene Grade
      </div>
      <div className="text-center mb-3">
        <div className="text-xs text-muted-foreground mb-1 truncate">{name}</div>
        <div className={`led-display text-7xl font-bold ${gradeColors[grade]} animate-pulse-glow`}>
          {grade}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Hygiene Score</span>
        <span className={`font-mono font-bold ${gradeColors[grade]}`}>{score}/100</span>
      </div>
      <div className="mt-2 w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${score >= 80 ? 'bg-grade-a' : score >= 60 ? 'bg-grade-b' : score >= 40 ? 'bg-grade-c' : 'bg-grade-d'}`}
        />
      </div>
    </motion.div>
  );
}
