import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { cn, formatCurrency, formatDate } from '../lib/utils'
import {
  Users, DollarSign, Briefcase, CheckCircle, TrendingUp,
  ShoppingBag, AlertCircle, UserCheck, Gift, Activity,
  ArrowRight, Clock, Zap
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { REVENUE_CHART_DATA, WORKER_PERFORMANCE_DATA, CLIENT_GROWTH_DATA } from '../lib/data'

export default function Dashboard() {
  const { stats, tasks, activityLog, expenses, salaries } = useData()
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const todayTasks = (tasks || []).filter(t => {
    const today = new Date().toDateString()
    return new Date(t.updatedDate).toDateString() === today || t.status === 'In Progress'
  })

  const pendingTasks = (tasks || []).filter(t => t.status !== 'Done')
  const recentActivity = (activityLog || []).slice(0, 5)

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tighter truncate">
                Welcome Back, <span className="text-primary/50">{user?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-bold mt-1 opacity-60 leading-none uppercase tracking-widest">
                Operational Intelligence • Agency Performance Overview
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl backdrop-blur-3xl">
              <Activity size={14} className="text-primary animate-pulse" />
              <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">System Live</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 sm:gap-6">
             <StatBox title="Active Clients" value={stats.totalClients} icon={ShoppingBag} />
             <StatBox title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} isCurrency />
             <StatBox title="Pending" value={stats.pendingTasks} icon={AlertCircle} color="text-orange-400" />
             <StatBox title="Completed" value={stats.completedTasks} icon={CheckCircle} color="text-green-400" />
             <StatBox title="Personnel" value={stats.activeWorkers} icon={UserCheck} />
             <StatBox title="Operational Cost" value={formatCurrency(stats.totalExpenses + stats.totalSalaries)} icon={DollarSign} isCurrency />
             <StatBox title="Net Profit" value={formatCurrency(stats.profit)} icon={Gift} isCurrency highlight />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Visuals */}
            <div className="lg:col-span-2 space-y-8">
               {/* Revenue Graph */}
               <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-8 relative z-10">
                     <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Financial Trajectory</h3>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40 mt-1">6-Month Revenue vs Expenditure</p>
                     </div>
                     <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">Monthly Cycle</span>
                  </div>
                  
                  <div className="h-[250px] sm:h-[300px] w-full relative z-10">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_CHART_DATA}>
                           <defs>
                              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                           <XAxis dataKey="month" hide />
                           <YAxis hide />
                           <Tooltip
                              contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                              labelStyle={{ display: 'none' }}
                           />
                           <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} fill="url(#revGrad)" />
                           <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
               </div>

               {/* Activity & Performance Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 backdrop-blur-3xl">
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase opacity-40 mb-6">Internal Performance</h3>
                    <ResponsiveContainer width="100%" height={200}>
                       <BarChart data={WORKER_PERFORMANCE_DATA} barSize={12}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                          <Bar dataKey="completed" fill="#818cf8" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 backdrop-blur-3xl">
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase opacity-40 mb-6">Client Success Curve</h3>
                    <ResponsiveContainer width="100%" height={200}>
                       <LineChart data={CLIENT_GROWTH_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="month" hide />
                          <YAxis hide />
                          <Tooltip contentStyle={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                          <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </div>

            {/* Sidebar Feed */}
            <div className="space-y-8">
               {/* Active Ops */}
               <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl h-fit">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-bold text-white tracking-widest uppercase opacity-60">Live Operations</h3>
                     <span className="text-[10px] font-bold text-primary tabular-nums">{todayTasks.length} TOTAL</span>
                  </div>
                  <div className="space-y-4">
                     {todayTasks.slice(0, 4).map(t => (
                        <div key={t.id} className="group flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer">
                           <div className={cn(
                             "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                             t.status === 'Done' ? "bg-green-500/10 text-green-400" : "bg-primary/10 text-primary animate-pulse"
                           )}>
                              {t.status === 'Done' ? <CheckCircle size={14} /> : <Zap size={14} />}
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-[12px] font-bold text-white tracking-tight truncate line-clamp-1">{t.task}</p>
                              <p className="text-[9px] text-muted font-bold opacity-40 uppercase tracking-widest mt-0.5">{t.clientName}</p>
                           </div>
                        </div>
                     ))}
                     <button className="w-full py-3 text-[10px] font-bold text-muted uppercase tracking-[0.2em] hover:text-white transition-colors border-t border-white/5 mt-2">View Full Roster <ArrowRight size={12} className="inline ml-1" /></button>
                  </div>
               </div>

               {/* Recent Signals */}
               <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl h-fit">
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase opacity-60 mb-6">Recent Signals</h3>
                  <div className="space-y-6">
                     {recentActivity.slice(0, 3).map(a => (
                        <div key={a.id} className="relative pl-6 border-l border-white/5 group">
                           <div className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                           <p className="text-[12px] text-white/80 font-bold leading-relaxed">{a.action}</p>
                           <p className="text-[10px] text-muted font-bold opacity-30 uppercase tracking-tighter mt-1">{a.user}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Pending Protocol Table */}
          <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Pending Protocols</h3>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40 mt-1">Operational Backlog Prioritization</p>
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white tabular-nums tracking-widest uppercase">
                   Queue: {pendingTasks.length}
                </div>
             </div>

             {!isMobile ? (
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-separate border-spacing-0">
                      <thead>
                         <tr className="text-[10px] text-muted font-bold uppercase tracking-widest border-b border-white/5">
                            <th className="pb-4 px-4 opacity-40">Client Entity</th>
                            <th className="pb-4 px-4 opacity-40">Task Vector</th>
                            <th className="pb-4 px-4 opacity-40">Personnel</th>
                            <th className="pb-4 px-4 opacity-40">Status</th>
                            <th className="pb-4 px-4 opacity-40 text-right">Deadline</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {pendingTasks.slice(0, 6).map(t => (
                            <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                               <td className="py-4 px-4">
                                  <span className="text-[13px] font-bold text-white tracking-tight">{t.clientName}</span>
                               </td>
                               <td className="py-4 px-4">
                                  <span className="text-[12px] text-muted font-bold opacity-60">{t.task}</span>
                               </td>
                               <td className="py-4 px-4">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-muted tracking-tighter">{(t.workerName || 'ST').split(' ').map(n=>n[0]).join('')}</div>
                                     <span className="text-[12px] text-muted font-bold opacity-60">{t.workerName}</span>
                                  </div>
                               </td>
                               <td className="py-4 px-4">
                                  <span className={cn(
                                    "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter",
                                    t.status === 'In Progress' ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted/50 border-white/10"
                                  )}>{t.status}</span>
                               </td>
                               <td className="py-4 px-4 text-right">
                                  <div className="flex flex-col items-end">
                                     <span className="text-[12px] font-bold text-white tabular-nums">{formatDate(t.declineDate)}</span>
                                     <span className="text-[8px] text-red-500/40 font-bold uppercase tracking-tighter">Priority</span>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             ) : (
                <div className="grid grid-cols-1 gap-4">
                   {pendingTasks.slice(0, 5).map(t => (
                      <div key={t.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                         <div className="flex items-start justify-between">
                            <div className="space-y-1">
                               <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-40 leading-none">Client Entity</p>
                               <p className="text-sm font-bold text-white tracking-tight">{t.clientName}</p>
                            </div>
                            <span className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter",
                              t.status === 'In Progress' ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted/50 border-white/10"
                            )}>{t.status}</span>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-40 leading-none">Task Vector</p>
                            <p className="text-[12px] text-white/80 font-bold leading-tight line-clamp-2">{t.task}</p>
                         </div>
                         <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <Clock size={12} className="text-muted/30" />
                               <span className="text-[11px] font-bold text-white/50 tabular-nums">{formatDate(t.declineDate)}</span>
                            </div>
                            <div className="text-[11px] font-bold text-primary opacity-60 uppercase tracking-widest">{(t.workerName || 'Staff').split(' ')[0]}</div>
                         </div>
                      </div>
                   ))}
                </div>
             )}
             <button className="w-full mt-8 py-3 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] font-bold text-muted hover:text-white hover:bg-white/[0.03] transition-all uppercase tracking-[0.3em]">Full Operational Backlog</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ title, value, icon: Icon, color = "text-white", isCurrency, highlight }) {
   return (
     <div className={cn(
       "bg-sidebar/30 border border-white/5 rounded-2xl p-4 sm:p-5 backdrop-blur-3xl transition-all hover:bg-sidebar/50 group h-full flex flex-col justify-between min-w-[140px]",
       highlight && "ring-1 ring-primary/20 shadow-2xl shadow-primary/5"
     )}>
        <div className="flex items-center justify-between mb-4">
           <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 transition-transform group-hover:scale-110", color)}>
              <Icon size={14} strokeWidth={2.5} />
           </div>
           {highlight && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
        </div>
        <div>
           <p className="text-2xl sm:text-3xl font-bold text-white tracking-tighter tabular-nums mb-1">
             {value}
           </p>
           <p className="text-[9px] sm:text-[10px] text-muted font-bold uppercase tracking-widest opacity-40 leading-none">
             {title}
           </p>
        </div>
     </div>
   )
}
