import { FilterOptions, CleanlinessGrade } from '@/types/toilet';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClose: () => void;
}

const grades: CleanlinessGrade[] = ['A', 'B', 'C', 'D'];

export function FilterPanel({ filters, onChange, onClose }: FilterPanelProps) {
  const toggleGrade = (g: CleanlinessGrade) => {
    const current = filters.grades;
    const updated = current.includes(g) ? current.filter(x => x !== g) : [...current, g];
    onChange({ ...filters, grades: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card border border-border rounded-xl p-4 shadow-elevated"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Cleanliness Grade</div>
          <div className="flex gap-2">
            {grades.map(g => (
              <button
                key={g}
                onClick={() => toggleGrade(g)}
                className={`w-9 h-9 rounded-lg font-mono font-bold text-sm transition-all ${
                  filters.grades.includes(g)
                    ? `bg-grade-${g.toLowerCase()} text-primary-foreground shadow-card`
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.accessibility === true}
            onChange={e => onChange({ ...filters, accessibility: e.target.checked || null })}
            className="rounded border-border accent-primary"
          />
          <span className="text-card-foreground">Accessible only</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.freeOnly}
            onChange={e => onChange({ ...filters, freeOnly: e.target.checked })}
            className="rounded border-border accent-primary"
          />
          <span className="text-card-foreground">Free only</span>
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.openOnly}
            onChange={e => onChange({ ...filters, openOnly: e.target.checked })}
            className="rounded border-border accent-primary"
          />
          <span className="text-card-foreground">Open now</span>
        </label>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => onChange({ grades: [], accessibility: null, freeOnly: false, openOnly: false })}
        >
          Clear Filters
        </Button>
      </div>
    </motion.div>
  );
}
