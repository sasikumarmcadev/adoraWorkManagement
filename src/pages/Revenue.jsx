import { useState, useEffect, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { formatCurrency, formatDate, cn } from '../lib/utils'
import { useSearchParams } from 'react-router-dom'
import { CreditCard, TrendingUp, IndianRupee, Calendar, ArrowUpRight } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { REVENUE_CHART_DATA } from '../lib/data'
import { SearchBar, StatusSelect } from '../components/ui'
import { Line } from 'recharts'

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444']

export default function Revenue() {
  const { payments, stats, clients } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sync state with Search Params
  const search = searchParams.get('q') || ''
  const statusFilter = searchParams.get('status') || 'All'

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') nextParams.delete(key)
      else nextParams.set(key, value)
    })
    setSearchParams(nextParams, { replace: true })
  }

  const totalRevenue = stats.totalRevenue
  const paidAmount = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)

  const pieData = useMemo(() => [
    { name: 'Completed', value: payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0) },
    { name: 'Pending', value: payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0) },
  ].filter(d => d.value > 0), [payments])

  const chartData = useMemo(() => 
    REVENUE_CHART_DATA.map(d => ({ ...d, margin: Math.round((d.profit / d.revenue) * 100) })), 
  [])

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = !search || 
        p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        p.note?.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      return matchesSearch && matchesStatus
    }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [payments, search, statusFilter])

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white truncate tracking-tighter leading-none">
                Revenue <span className="text-primary/50">Performance</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-medium mt-2 opacity-60 leading-none tracking-widest">
                Financial Audit • Agency Growth Metrics
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-6 sm:gap-14 border-l border-white/5 pl-6 sm:pl-10">
              <div className="hidden md:flex flex-col items-center sm:items-end gap-1.5 border-r border-white/5 pr-10">
                 <p className="text-[9px] text-muted opacity-30 tracking-[0.2em]  leading-none">Growth Intelligence</p>
                 <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      "text-[10px] font-normal px-2 py-0.5 rounded-full border",
                      (chartData[5].revenue > chartData[4].revenue) ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    )}>
                       {(chartData[5].revenue > chartData[4].revenue) ? '+' : ''}{Math.round(((chartData[5].revenue - chartData[4].revenue) / chartData[4].revenue) * 100)}% shift
                    </span>
                    <span className="text-[10px] text-muted opacity-20 font-normal tabular-nums leading-none">
                       {chartData[4].month} » {chartData[5].month}
                    </span>
                 </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-1">
                <p className="text-[9px] sm:text-[11px] text-muted font-medium opacity-60 tracking-widest leading-none">Total Revenue</p>
                <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter tabular-nums text-primary">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox label="Total Revenue" value={formatCurrency(totalRevenue)} icon={IndianRupee} color="primary" trend="+12.5%" />
            <StatBox label="Total Paid" value={formatCurrency(paidAmount)} icon={TrendingUp} color="green" trend="+8.2%" />
            <StatBox label="Total Pending" value={formatCurrency(pendingAmount)} icon={CreditCard} color="amber" trend="-2.4%" />
            <StatBox label="Profit Margin" value={`${Math.round((stats.profit / totalRevenue) * 100) || 0}%`} icon={ArrowUpRight} color="blue" trend="+5.0%" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Primary Chart */}
            <div className="xl:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-normal text-white tracking-tight">Revenue Trajectory</h3>
                  <p className="text-[11px] text-muted font-normal tracking-widest opacity-30 mt-1">Growth Lifecycle & Monthly Yield</p>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  {chartData.slice(-4).map(d => (
                    <div key={d.month} className="text-right">
                      <p className="text-[9px] text-muted opacity-20 tracking-widest">{d.month} Margin</p>
                      <p className="text-xs font-normal text-primary tabular-nums leading-none mt-1">{d.margin}%</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="revNoir" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }} 
                      itemStyle={{ padding: '2px 0' }}
                      formatter={v => formatCurrency(v)} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revNoir)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={2} fill="transparent" name="Profit" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between space-y-8 shadow-md">
              <div className="w-full">
                <h3 className="text-lg font-normal text-white tracking-tight">Payment Split</h3>
                <p className="text-[11px] text-muted font-normal tracking-widest opacity-30 mt-1">Status Allocation</p>
              </div>
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, fontSize: 11 }} 
                      formatter={v => formatCurrency(v)} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                   <p className="text-[10px] text-muted font-normal opacity-30 text-center tracking-widest">Total</p>
                   <p className="text-xl font-normal text-white tracking-tighter tabular-nums">100%</p>
                </div>
              </div>
              <div className="w-full space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-[11px] font-normal text-muted tracking-wider">{d.name}</span>
                    </div>
                    <span className="text-[12px] font-normal text-white tabular-nums">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dedicated Profit Margin Chart */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-8 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-normal text-white tracking-tight">Profit Margin Performance</h3>
                <p className="text-[11px] text-muted font-normal tracking-widest opacity-30 mt-1">Monthly Yield Efficiency Status (%)</p>
              </div>
            </div>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="marginNoir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                  <YAxis unit="%" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11 }} 
                    itemStyle={{ padding: '2px 0' }}
                    formatter={v => [`${v}%`, 'Margin']}
                  />
                  <Area type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={2} fill="url(#marginNoir)" name="Margin %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-md">
            <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/[0.01] backdrop-blur-3xl">
               <div>
                  <h3 className="text-lg font-normal text-white tracking-tight">Transaction History</h3>
                  <p className="text-[11px] text-muted font-normal tracking-widest opacity-30 mt-1">Real-time Financial Flow</p>
               </div>

               <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="w-full lg:w-72">
                    <SearchBar 
                      value={search}
                      onChange={(val) => updateFilters({ q: val })}
                      placeholder="Search transactions..."
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="w-full lg:w-48">
                      <StatusSelect 
                        value={statusFilter}
                        onChange={(val) => updateFilters({ status: val })}
                        options={['All', 'Completed', 'Pending']}
                        isFilter
                        placeholder="Status"
                      />
                    </div>
                    <div className="w-full lg:w-48">
                      <button 
                        onClick={() => window.location.hash = '/clients/payment'} 
                        className="w-full h-10 px-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-normal rounded-xl hover:bg-primary/20 transition-all tracking-widest flex items-center justify-center gap-2"
                      >
                        Launch Ledger <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
              {!isMobile ? (
                 <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
                 <thead className="text-[11px] text-muted bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                   <tr>
                     <th className="w-[150px] px-8 py-4 border-r border-border leading-none">Processed On</th>
                     <th className="w-[300px] px-8 py-4 border-r border-border leading-none">Client Identification</th>
                     <th className="w-[200px] px-8 py-4 border-r border-border leading-none">Financial Stake</th>
                     <th className="w-[180px] px-8 py-4 border-r border-border text-center leading-none">Status Allocation</th>
                     <th className="px-8 py-4 leading-none">Journal Memo</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {filteredPayments.map(p => {
                     const client = clients.find(c => c.name === p.clientName)
                     return (
                       <tr key={p.id} className="hover:bg-sidebar transition-all group">
                         <td className="px-8 py-3 border-r border-border">
                            <div className="flex items-center gap-3 text-white/50">
                               <Calendar size={13} className="text-primary/40" />
                               <span className="text-[12px] font-normal tabular-nums tracking-tight">{formatDate(p.date)}</span>
                            </div>
                         </td>
                         <td className="px-8 py-3 border-r border-border overflow-hidden">
                            <div className="flex items-center gap-3">
                               <div className="w-7 h-7 rounded-full bg-surface-800 flex items-center justify-center text-primary font-normal text-[9px] border border-white/5 overflow-hidden">
                                  {client?.logo ? (
                                    <img src={client.logo} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    p.clientName?.split(' ').map(n => n[0]).join('')
                                  )}
                               </div>
                               <span className="text-white text-[13px] tracking-tight truncate" title={p.clientName}>{p.clientName}</span>
                            </div>
                         </td>
                         <td className="px-8 py-3 border-r border-border">
                            <div className="flex items-center gap-2 text-emerald-400 font-normal tabular-nums text-[13px]">
                               <IndianRupee size={12} className="opacity-40" />
                               <span>{formatCurrency(p.amount).replace('₹', '')}</span>
                            </div>
                         </td>
                         <td className="px-8 py-3 border-r border-border text-center">
                            <div className="flex justify-center">
                              <span className={cn(
                                "text-[10px] font-normal px-2.5 py-1 rounded-lg border tracking-wider",
                                p.status === 'Completed' ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                                p.status === 'Pending' ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                                "text-blue-400 bg-blue-500/10 border-blue-500/20"
                              )}>
                                {p.status}
                              </span>
                            </div>
                         </td>
                         <td className="px-8 py-3 text-muted/40 text-[11px] truncate" title={p.note}>{p.note || '—'}</td>
                       </tr>
                     )
                   })}
                 </tbody>
               </table>
              ) : (
                 <div className="p-4 grid grid-cols-1 gap-4">
                    {filteredPayments.map(p => {
                       const client = clients.find(c => c.name === p.clientName)
                       return (
                         <div key={p.id} className="group bg-sidebar/30 border border-white/5 rounded-2xl p-6 space-y-5 transition-all duration-500 relative overflow-hidden ring-1 ring-white/5">
                            <div className="flex items-start justify-between gap-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center text-primary font-normal text-[12px] border border-white/5 overflow-hidden">
                                     {client?.logo ? (
                                       <img src={client.logo} alt="" className="w-full h-full object-cover" />
                                     ) : (
                                       p.clientName?.split(' ').map(n => n[0]).join('')
                                     )}
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-white text-sm tracking-tight leading-tight line-clamp-1">{p.clientName}</p>
                                     <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 tracking-tighter tabular-nums">{formatDate(p.date)}</span>
                                     </div>
                                  </div>
                               </div>
                               <span className={cn(
                                  "text-[9px] font-normal px-2 py-0.5 rounded border tracking-tight",
                                  p.status === 'Completed' ? "text-emerald-400 border-emerald-500/20" :
                                  p.status === 'Pending' ? "text-amber-400 border-amber-500/20" :
                                  "text-blue-400 border-blue-200"
                               )}>
                                 {p.status}
                               </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                               <div className="space-y-1.5">
                                  <p className="text-[8px] text-muted opacity-40 tracking-widest leading-none">financial stake</p>
                                  <div className="flex items-center gap-2 text-emerald-400 text-lg font-normal tabular-nums tracking-tighter">
                                     <IndianRupee size={14} className="opacity-40" />
                                     <span>{formatCurrency(p.amount).replace('₹', '')}</span>
                                  </div>
                               </div>
                               {p.note && (
                               <div className="space-y-1.5 text-right">
                                  <p className="text-[8px] text-muted opacity-40 tracking-widest leading-none">journal memo</p>
                                  <p className="text-[10px] text-muted/60 leading-tight line-clamp-2">“{p.note}”</p>
                               </div>
                              )}
                            </div>
                         </div>
                       )
                    })}
                 </div>
               )}
              {filteredPayments.length === 0 && (
                 <div className="p-12 sm:p-24 text-center">
                    <p className="text-white/20 text-xs font-normal">No transaction records match the current intelligence parameters.</p>
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
  const iconColors = {
    primary: 'text-primary',
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400'
  }
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all group shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] text-muted font-normal tracking-widest opacity-40">{label}</p>
          <p className="text-2xl font-normal text-white tracking-tighter tabular-nums">{value}</p>
        </div>
        <div className={cn("mt-1 opacity-20 group-hover:opacity-60 transition-opacity duration-500", iconColors[color])}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={cn("text-[9px] font-normal", trend.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>
          {trend}
        </span>
        <div className="h-px w-4 bg-white/10" />
        <span className="text-[9px] text-muted opacity-20 font-normal tracking-widest">Progression</span>
      </div>
    </div>
  )
}
