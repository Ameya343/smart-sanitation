import { mockToilets } from '@/data/toiletData';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, CheckCircle, TrendingUp, Clock, BarChart3, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { useMemo } from 'react';

export default function DashboardPage() {
  const stats = useMemo(() => {
    const gradeCount = { A: 0, B: 0, C: 0, D: 0 };
    let totalScore = 0;
    let alertCount = 0;

    mockToilets.forEach(t => {
      gradeCount[t.grade]++;
      totalScore += t.hygieneScore;
      if (t.grade === 'C' || t.grade === 'D') alertCount++;
    });

    return {
      gradeCount,
      avgScore: Math.round(totalScore / mockToilets.length),
      alertCount,
      totalFacilities: mockToilets.length,
      openFacilities: mockToilets.filter(t => t.operationalStatus === 'open').length,
    };
  }, []);

  const pieData = Object.entries(stats.gradeCount).map(([name, value]) => ({ name: `Grade ${name}`, value }));
  const pieColors = ['#22a05b', '#6d9a23', '#e6a817', '#e05252'];

  const usageTrend = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    usage: Math.round(Math.sin((i - 6) * Math.PI / 12) * 30 + 35 + Math.random() * 10),
    cleanings: i % 4 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
  }));

  const hygieneByFacility = mockToilets.slice(0, 10).map(t => ({
    name: t.name.split(' ').slice(0, 2).join(' '),
    score: t.hygieneScore,
    fill: t.grade === 'A' ? '#22a05b' : t.grade === 'B' ? '#6d9a23' : t.grade === 'C' ? '#e6a817' : '#e05252',
  }));

  const lowHygiene = mockToilets.filter(t => t.grade === 'C' || t.grade === 'D').sort((a, b) => a.hygieneScore - b.hygieneScore);

  const suggestedSchedule = lowHygiene.map(t => {
    const urgency = t.grade === 'D' ? 'Immediate' : 'Within 1 hour';
    return { name: t.name, score: t.hygieneScore, grade: t.grade, urgency };
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button size="sm" variant="secondary" className="gap-1 h-8 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Map
            </Button>
          </Link>
          <div>
            <h1 className="text-primary-foreground font-bold text-lg">🏛 Admin Dashboard</h1>
            <p className="text-primary-foreground/70 text-[10px]">Live Hygiene Monitoring & Analytics</p>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, label: 'Avg Hygiene Score', value: `${stats.avgScore}/100`, color: 'text-primary' },
            { icon: CheckCircle, label: 'Open Facilities', value: `${stats.openFacilities}/${stats.totalFacilities}`, color: 'text-grade-a' },
            { icon: AlertTriangle, label: 'Low Hygiene Alerts', value: stats.alertCount, color: 'text-grade-d' },
            { icon: Users, label: 'Total Facilities', value: stats.totalFacilities, color: 'text-secondary' },
          ].map(({ icon: Icon, label, value, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-4 shadow-card"
            >
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <div className={`font-mono font-bold text-2xl ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <h3 className="font-semibold text-sm text-card-foreground mb-4">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  {d.name}: {d.value}
                </div>
              ))}
            </div>
          </div>

          {/* Usage Trend */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <h3 className="font-semibold text-sm text-card-foreground mb-4">Usage Trend (24h)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={usageTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 15% 88%)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="usage" stroke="#3b8ed4" fill="#3b8ed4" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hygiene Scores */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="font-semibold text-sm text-card-foreground mb-4">Hygiene Score by Facility</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hygieneByFacility} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160 15% 88%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {hygieneByFacility.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Cleaning Schedule */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-card-foreground">AI-Suggested Cleaning Schedule</h3>
          </div>
          {suggestedSchedule.length === 0 ? (
            <p className="text-sm text-muted-foreground">All facilities are in good condition! ✨</p>
          ) : (
            <div className="space-y-2">
              {suggestedSchedule.map(item => (
                <div key={item.name} className="flex items-center justify-between bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold text-sm ${item.grade === 'D' ? 'text-grade-d' : 'text-grade-c'}`}>
                      {item.grade}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">Score: {item.score}/100</div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    item.urgency === 'Immediate' ? 'bg-grade-d/15 text-grade-d' : 'bg-grade-c/15 text-grade-c'
                  }`}>
                    {item.urgency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
