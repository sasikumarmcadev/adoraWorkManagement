import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { formatCurrency, formatDate, cn } from '../lib/utils'
import { CreditCard, TrendingUp, DollarSign, Users, Calendar, ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { REVENUE_CHART_DATA } from '../lib/data'

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444']

export default function Revenue() {
  const { payments, clients, stats } = useData()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalRevenue = stats.totalRevenue
  const paidAmount = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)

  const pieData = [
    { name: 'Paid', value: payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0) },
    { name: 'Advance', value: payments.filter(p => p.status === 'Advance').reduce((s, p) => s + p.amount, 0) },
    { name: 'Partial', value: payments.filter(p => p.status === 'Partial').reduce((s, p) => s + p.amount, 0) },
    { name: 'Pending', value: payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0) },
  ].filter(d => d.value > 0)

  const clientRevenueData = clients.map(c => ({
    name: c.name.split(' ')[0],
    revenue: payments.filter(p => p.clientId === c.id).reduce((s, p) => s + p.amount, 0)
  })).filter(d => d.revenue > 0)

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tighter truncate">
                Revenue <span className="text-primary/50">Performance</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-bold mt-1 opacity-60 leading-none">
                Financial Audit • Agency Growth Metrics
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-bold opacity-60 tracking-widest uppercase">Total Revenue</p>
              <p className="text-2xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums">
                {formatCurrency(totalRevenue).replace('₹', '')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox label="Total Earnings" value={formatCurrency(totalRevenue)} icon={DollarSign} color="primary" trend="+12.5%" />
            <StatBox label="Verified Paid" value={formatCurrency(paidAmount)} icon={TrendingUp} color="green" trend="+8.2%" />
            <StatBox label="Outstanding" value={formatCurrency(pendingAmount)} icon={CreditCard} color="amber" trend="-2.4%" />
            <StatBox label="Profit Margin" value={`${Math.round((stats.profit / totalRevenue) * 100) || 0}%`} icon={ArrowUpRight} color="blue" trend="+5.0%" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Primary Chart */}
            <div className="xl:col-span-2 bg-sidebar/30 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Revenue Trajectory</h3>
                  <p className="text-[11px] text-muted font-bold uppercase tracking-widest opacity-50 mt-1">Last 6 Months Snapshot</p>
                </div>
              </div>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_CHART_DATA}>
                    <defs>
                      <linearGradient id="revNoir" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="profitNoir" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }} 
                      itemStyle={{ padding: '2px 0' }}
                      formatter={v => formatCurrency(v)} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#revNoir)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={3} fill="url(#profitNoir)" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-sidebar/30 border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between space-y-8">
              <div className="w-full">
                <h3 className="text-lg font-bold text-white tracking-tight">Payment Split</h3>
                <p className="text-[11px] text-muted font-bold uppercase tracking-widest opacity-50 mt-1">Status Allocation</p>
              </div>
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 11, fontWeight: 'bold' }} 
                      formatter={v => formatCurrency(v)} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                   <p className="text-[10px] text-muted font-bold uppercase opacity-30">Total</p>
                   <p className="text-xl font-bold text-white tracking-tighter tabular-nums">100%</p>
                </div>
              </div>
              <div className="w-full space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ background: PIE_COLORS[i], shadowColor: PIE_COLORS[i] }} />
                      <span className="text-[11px] font-bold text-muted uppercase tracking-wider">{d.name}</span>
                    </div>
                    <span className="text-[12px] font-bold text-white tabular-nums">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-sidebar/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Transaction History</h3>
                  <p className="text-[11px] text-muted font-bold uppercase tracking-widest opacity-50 mt-1">Real-time Payment Audit</p>
               </div>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
              {!isMobile ? (
                 <table className="w-full min-w-[900px] text-sm text-left border-separate border-spacing-0">
                 <thead className="text-[10px] text-muted font-bold bg-white/[0.02] uppercase tracking-widest">
                   <tr>
                     <th className="px-8 py-4 border-b border-white/5">Client Identity</th>
                     <th className="px-8 py-4 border-b border-white/5">Financial Stake</th>
                     <th className="px-8 py-4 border-b border-white/5">Processed On</th>
                     <th className="px-8 py-4 border-b border-white/5">Status</th>
                     <th className="px-8 py-4 border-b border-white/5">Note</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {payments.map(p => (
                     <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary font-bold text-[10px] border border-white/5 uppercase">
                                {p.clientName?.split(' ').map(n => n[0]).join('')}
                             </div>
                             <span className="text-white font-bold tracking-tight">{p.clientName}</span>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <span className="text-emerald-400 font-bold tabular-nums text-[13px]">{formatCurrency(p.amount)}</span>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-3 text-muted/60">
                             <Calendar size={13} />
                             <span className="text-[12px] font-bold tabular-nums">{formatDate(p.date)}</span>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                         <span className={cn(
                           "text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider",
                           p.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                           p.status === 'Pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                           "bg-blue-500/10 text-blue-400 border-blue-500/20"
                         )}>
                           {p.status}
                         </span>
                       </td>
                       <td className="px-8 py-4 text-muted/40 text-[11px] font-medium max-w-[200px] truncate">{p.note || '—'}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
              ) : (
                <div className="p-4 grid grid-cols-1 gap-4">
                    {payments.map(p => (
                       <div key={p.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary font-bold text-[12px] border border-white/5 uppercase">
                                  {p.clientName?.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                   <p className="text-white font-bold text-sm tracking-tight">{p.clientName}</p>
                                   <p className="text-[10px] text-muted font-bold opacity-50 uppercase tracking-widest leading-none mt-1">{formatDate(p.date)}</p>
                                </div>
                             </div>
                             <span className={cn(
                               "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter",
                               p.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                               p.status === 'Pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                               "bg-blue-500/10 text-blue-400 border-blue-500/20"
                             )}>
                               {p.status}
                             </span>
                          </div>
                          <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                             <div className="space-y-1">
                                <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-40 leading-none">Stake Amount</p>
                                <p className="text-lg font-bold text-emerald-400 tabular-nums tracking-tighter">{formatCurrency(p.amount)}</p>
                             </div>
                             <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-muted/20">
                                <TrendingUp size={16} />
                             </div>
                          </div>
                          {p.note && (
                            <div className="px-3 py-2 bg-white/[0.01] border border-white/5 rounded-lg">
                               <p className="text-[10px] text-muted/60 italic leading-snug line-clamp-2">“{p.note}”</p>
                            </div>
                          )}
                       </div>
                    ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, icon: Icon, color, trend }) {
  const colors = {
    primary: 'text-primary bg-primary/10 border-primary/20 shadow-primary/5',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-emerald-400/5',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-amber-400/5',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-blue-400/5'
  }
  return (
    <div className="bg-sidebar/40 border border-white/5 rounded-2xl p-6 transition-all hover:bg-sidebar/60 group relative overflow-hidden ring-1 ring-white/5">
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] opacity-50">{label}</p>
          <p className="text-2xl font-bold text-white tracking-tighter tabular-nums">{value}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110", colors[color])}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 relative z-10">
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", trend.startsWith('+') ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
          {trend}
        </span>
        <span className="text-[10px] text-muted font-bold opacity-30 mt-0.5">VS PREVIOUS CYCLE</span>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
    </div>
  )
}
