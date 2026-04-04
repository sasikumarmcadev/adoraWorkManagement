import { useMemo } from 'react'
import { useData } from '../context/DataContext'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts'
import { TrendingUp, Users, Award, Star, Activity } from 'lucide-react'
import { cn } from '../lib/utils'

export default function WorkerPerformance() {
  const { workers, tasks, incentives } = useData()

  // --- 1. Incentive Distribution (Dimensional Comparison) ---
  const incentiveData = useMemo(() => {
    return workers.map(w => {
      const workerTasks = tasks.filter(t => t.workerId === w.id);
      
      // Breakdown points into generic categories for cross-role comparison
      let quality = 0, speed = 0, reliability = 0, creativity = 0;

      workerTasks.forEach(t => {
        const scores = t.evaluationScores || {};
        // Map specific role criteria to generic buckets
        if (w.role === 'Video Grapher') {
          quality += parseFloat(scores.quality) || 0;
          speed += parseFloat(scores.speed) || 0;
          reliability += parseFloat(scores.deadline) || 0;
          creativity += parseFloat(scores.creativity) || 0;
        } else if (w.role === 'Editor') {
          quality += parseFloat(scores.technical) || 0;
          speed += parseFloat(scores.speed) || 0;
          reliability += parseFloat(scores.revisions) || 0;
          creativity += parseFloat(scores.narrative) || 0;
        } else {
          // Default mapping for other roles
          quality += parseFloat(scores.code || scores.script || scores.roas || 0);
          speed += parseFloat(scores.speed || scores.velocity || scores.copy || 0);
          reliability += parseFloat(scores.bugs || scores.docs || scores.value || scores.budget || 0);
          creativity += parseFloat(scores.research || scores.hooks || scores.creative || 0);
        }
      });

      const total = quality + speed + reliability + creativity;
      const avg = workerTasks.length ? Math.round(total / workerTasks.length) : 0;

      return {
        name: w.name.split(' ')[0],
        fullName: w.name,
        role: w.role,
        avatar: w.avatar,
        quality: Math.round(quality),
        speed: Math.round(speed),
        reliability: Math.round(reliability),
        creativity: Math.round(creativity),
        total: Math.round(total),
        avgPoints: avg
      }
    }).sort((a, b) => b.total - a.total)
  }, [workers, tasks])

  // --- 2. Quality Matrix (Based on points average) ---
  const qualityData = useMemo(() => {
    return [...incentiveData].sort((a, b) => b.avgPoints - a.avgPoints);
  }, [incentiveData])

  const topPerformer = incentiveData[0]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-10 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="page-heading">
              Worker <span className="text-primary/50">Progress</span>
            </h1>
            <p className="page-subheading max-w-sm">
              Personnel Performance Matrix • Multi-Dimensional Incentive Analytics
            </p>
          </div>
          
          <div className="flex gap-4 sm:gap-6">
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-[10px] text-muted font-medium tracking-widest uppercase mb-1 opacity-40">System Avg</p>
              <p className="text-2xl font-medium text-white tabular-nums tracking-tighter">
                {Math.round(incentiveData.reduce((a,b) => a + b.total, 0) / (workers.length || 1))}
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl text-center min-w-[120px]">
              <p className="text-[10px] text-primary font-medium tracking-widest uppercase mb-1 opacity-60">Top Performer</p>
              <p className="text-sm font-medium text-white truncate max-w-[100px] mx-auto">{topPerformer?.name || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10 space-y-10 max-w-7xl mx-auto w-full">
        
        {/* --- Primary Chart: Cumulative Points Comparison --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-panel border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
                  <Award size={20} className="text-primary/50" />
                  Dimensional Comparison
                </h3>
                <p className="text-[11px] text-muted mt-1 opacity-60 uppercase tracking-widest">Stacked performance breakdown across all employees</p>
              </div>
            </div>

            <div className="h-[350px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incentiveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', tracking: '0.1em', opacity: 0.6 }} />
                  <Bar dataKey="quality" stackId="a" fill="#ffffff" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="speed" stackId="a" fill="#60a5fa" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="reliability" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="creativity" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills Radar Comparison */}
          <div className="bg-panel border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
                <Activity size={20} className="text-primary/50" />
                Performance Matrix
              </h3>
              <p className="text-[11px] text-muted mt-1 opacity-60 uppercase tracking-widest">Qualitative Skillset Distribution</p>
            </div>

            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: 'Quality', fullMark: 100 },
                  { subject: 'Speed', fullMark: 100 },
                  { subject: 'Reliability', fullMark: 100 },
                  { subject: 'Creativity', fullMark: 100 },
                ].map(s => {
                  const obj = { ...s };
                  incentiveData.slice(0, 3).forEach((w, i) => {
                    // Normalize to 100 for radar comparison
                    const maxPossible = (tasks.filter(t => t.workerId === workers.find(work => work.name === w.fullName)?.id).length * 25) || 1;
                    const val = w[s.subject.toLowerCase()] || 0;
                    obj[w.name] = Math.min(100, Math.round((val / maxPossible) * 100));
                  });
                  return obj;
                })}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 500 }} 
                  />
                  <Radar
                    name={incentiveData[0]?.name}
                    dataKey={incentiveData[0]?.name}
                    stroke="#ffffff"
                    fill="#ffffff"
                    fillOpacity={0.1}
                  />
                  {incentiveData[1] && (
                    <Radar
                      name={incentiveData[1]?.name}
                      dataKey={incentiveData[1]?.name}
                      stroke="#60a5fa"
                      fill="#60a5fa"
                      fillOpacity={0.1}
                    />
                  )}
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.6 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-[10px] text-muted font-medium opacity-40 uppercase tracking-[0.2em]">Top 3 Personnel Comparison</p>
            </div>
          </div>
        </div>

        {/* --- Bottom Row: Leaderboard --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {incentiveData.slice(0, 4).map((w, idx) => (
            <div key={idx} className="bg-panel border border-border rounded-2xl p-6 group hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-xs text-primary font-bold overflow-hidden shadow-xl">
                    {w.avatar?.startsWith('http') ? <img src={w.avatar} className="w-full h-full object-cover" /> : w.avatar || w.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{w.fullName}</p>
                    <p className="text-[9px] text-muted opacity-50 font-medium tracking-widest mt-0.5">{w.role}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border",
                  idx === 0 ? "bg-primary text-black border-primary" : "bg-white/5 text-white/40 border-white/10"
                )}>
                  #{idx + 1}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-normal text-white tabular-nums tracking-tighter">{w.total}</span>
                <span className="text-[10px] text-muted opacity-40 uppercase font-medium">pts</span>
              </div>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star 
                    key={s} 
                    size={10} 
                    className={idx === 0 ? "text-primary" : "text-white/10"} 
                    fill={idx === 0 && (s <= 5 - idx) ? "currentColor" : "none"} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
