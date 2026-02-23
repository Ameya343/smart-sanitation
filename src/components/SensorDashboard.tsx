import { ToiletFacility } from '@/types/toilet';
import { motion } from 'framer-motion';
import { Thermometer, Wind, Droplets, Users } from 'lucide-react';

interface SensorDashboardProps {
  toilet: ToiletFacility;
}

export function SensorDashboard({ toilet }: SensorDashboardProps) {
  const sensors = [
    { icon: Wind, label: 'Odor Level', value: toilet.sensorData.odorLevel, unit: '%', color: toilet.sensorData.odorLevel > 60 ? 'text-grade-d' : 'text-primary' },
    { icon: Thermometer, label: 'Ammonia', value: toilet.sensorData.ammoniaLevel, unit: 'ppm', color: toilet.sensorData.ammoniaLevel > 60 ? 'text-grade-d' : 'text-primary' },
    { icon: Droplets, label: 'Humidity', value: toilet.sensorData.humidity, unit: '%', color: toilet.sensorData.humidity > 75 ? 'text-grade-c' : 'text-secondary' },
    { icon: Users, label: 'Usage/hr', value: toilet.sensorData.usageFrequency, unit: '', color: toilet.sensorData.usageFrequency > 20 ? 'text-grade-c' : 'text-secondary' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 shadow-card"
    >
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        IoT Sensor Data
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sensors.map(({ icon: Icon, label, value, unit, color }) => (
          <div key={label} className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
            <div className={`font-mono font-bold text-lg ${color}`}>
              {value}<span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
