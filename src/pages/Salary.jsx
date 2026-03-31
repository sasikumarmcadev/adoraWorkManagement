import { useState, useMemo, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useSearchParams } from 'react-router-dom'
import { cn } from '../lib/utils'
import {
  Plus, Edit2, Trash2,
  IndianRupee, User,
  Wallet, Gift
} from 'lucide-react'
import { Modal, FormField, SearchBar, StatusSelect, CustomSelect } from '../components/ui/index'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// --- STATUS COLORS & CONFIG ---
const SALARY_STATUSES = ['Paid', 'Pending', 'Processing', 'Held']

const getStatusStyle = (status) => {
  switch (status) {
    case 'Paid': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    case 'Held': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    case 'Pending': return 'text-red-400 bg-red-400/10 border-red-400/20'
    default: return 'text-muted bg-white/5 border-white/10'
  }
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS_RANGE = Array.from({ length: (CURRENT_YEAR + 1) - 2024 + 1 }, (_, i) => 2024 + i)

const getMonthDisplay = (monthStr) => {
  if (!monthStr) return '—'
  const [year, month] = monthStr.split('-')
  return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`
}

// --- DASHBOARD OVERVIEW ---
function DashboardOverview({ salaries, filteredSalaries, workerName, cycleLabel }) {
  const dataCtx = filteredSalaries || salaries
  
  const statusAmounts = [
    { 
      name: 'Base Pay', 
      value: dataCtx.reduce((sum, s) => sum + Number(s.amount || 0), 0),
      color: '#6366f1' // Indigo
    },
    { 
      name: 'Incentives', 
      value: dataCtx.reduce((sum, s) => sum + Number(s.incentive || 0), 0),
      color: '#10b981' // Emerald
    }
  ].filter(item => item.value > 0)

  const totalValue = dataCtx.reduce((sum, s) => sum + Number(s.amount || 0) + Number(s.incentive || 0), 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl">
          <p className="text-[12px] text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: payload[0].payload.color || payload[0].fill }} />
            {`${payload[0].name} : ₹${Number(payload[0].value).toLocaleString('en-IN')}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-8 lg:py-10">
      <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-20">
          <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusAmounts}
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {statusAmounts.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-1 text-center">
              <span className="text-[10px] sm:text-[11px] text-muted opacity-60 leading-none">Net Payroll</span>
              <span className="text-base sm:text-lg font-normal text-white leading-none tracking-tighter mt-1">₹{totalValue > 100000 ? (totalValue / 100000).toFixed(1) + 'L' : (totalValue / 1000).toFixed(0) + 'K'}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 w-full lg:w-auto">
            <div className="text-center lg:text-left transition-all">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tighter truncate">
                Salary <span className="text-primary/50">Performance</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-medium mt-2 opacity-60 leading-none">
                {cycleLabel} • {workerName !== 'All' ? workerName : 'Adora Workforce Economics'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center lg:items-end justify-center lg:justify-end gap-6 sm:gap-10 lg:gap-16 w-full lg:w-auto">
              {[
                { label: 'Base Salaries', value: dataCtx.reduce((sum, s) => sum + Number(s.amount || 0), 0), color: '#6366f1' },
                { label: 'Incentives', value: dataCtx.reduce((sum, s) => sum + Number(s.incentive || 0), 0), color: '#10b981' }
              ].map(stat => {
                return (
                  <div key={stat.label} className="flex flex-col group cursor-default items-center lg:items-start">
                    <p className="text-[9px] sm:text-[11px] text-muted mb-2 opacity-60 transition-colors group-hover:text-primary tracking-widest font-medium">{stat.label}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-4 sm:h-5 w-1 rounded-full bg-white/5 transition-all group-hover:h-7" style={{ background: stat.value > 0 ? stat.color : '' }} />
                      <p className={`text-2xl sm:text-4xl font-medium tabular-nums tracking-tighter ${stat.value > 0 ? 'text-white' : 'text-primary/20'}`}>
                        ₹{stat.value > 100000 ? (stat.value / 100000).toFixed(1) + 'L' : Number(stat.value).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Salary() {
  const { salaries, addSalary, updateSalary, deleteSalary, workers } = useData()
  const { isManager, isJeevan } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const canManage = isManager || isJeevan

  // Sync state with Search Params
  const search = searchParams.get('q') || ''
  const statusFilter = searchParams.get('status') || 'All'
  const workerFilter = searchParams.get('worker') || 'All'
  const selectedMonth = parseInt(searchParams.get('month') || (new Date().getMonth() + 1))
  const selectedYear = parseInt(searchParams.get('year') || new Date().getFullYear())
  const isMonthFilterActive = searchParams.get('mode') !== 'all'

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All' || value === 'Whole Team' || value === 'All Ledger') nextParams.delete(key)
      else nextParams.set(key, value)
    })
    setSearchParams(nextParams, { replace: true })
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState(null)
  const [form, setForm] = useState({})
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredSalaries = useMemo(() => {
    return (salaries || []).filter(s => {
      const matchesSearch = !search || s.workerName?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter
      const matchesWorker = workerFilter === 'All' || s.workerName === workerFilter
      const targetCycle = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`
      const matchesCycle = !isMonthFilterActive || s.month === targetCycle
      return matchesSearch && matchesStatus && matchesWorker && matchesCycle
    }).sort((a, b) => b.month?.localeCompare(a.month) || b.id > a.id ? -1 : 1)
  }, [salaries, search, statusFilter, workerFilter, selectedMonth, selectedYear, isMonthFilterActive])

  const openAdd = () => {
    setSelectedSalary(null)
    setForm({ 
      workerName: '', 
      amount: '', 
      incentive: '', 
      month: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`, 
      status: 'Pending', 
      analysis: '' 
    })
    setIsModalOpen(true)
  }

  const openEdit = (s) => {
    setSelectedSalary(s)
    setForm({ ...s })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!form.workerName || (!form.amount && !form.incentive)) return
    const payload = {
      ...form,
      amount: Number(form.amount || 0),
      incentive: Number(form.incentive || 0)
    }
    if (selectedSalary) updateSalary(selectedSalary.id, payload)
    else addSalary(payload)
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to remove this payroll entry?')) deleteSalary(id)
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      <DashboardOverview
        salaries={salaries}
        filteredSalaries={filteredSalaries}
        workerName={workerFilter}
        cycleLabel={isMonthFilterActive ? getMonthDisplay(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`) : 'All Cumulative Payroll'}
      />

      <div className="flex-1 flex flex-col bg-panel">
        {/* Functional Bar */}
        <div className="p-3 sm:p-5 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-sidebar">
          <div className="w-full md:w-80">
            <SearchBar value={search} onChange={val => updateFilters({ q: val })} placeholder="Search workforce payroll..." />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {canManage && (
              <button
                onClick={openAdd}
                className="group flex-1 md:flex-none flex items-center justify-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Plus size={18} />
                </div>
                <span className="text-[12px] font-medium text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Pay Salary</span>
              </button>
            )}
            <div className="relative flex-1 md:w-48">
              <StatusSelect
                value={statusFilter === 'All' ? 'All Ledger' : statusFilter}
                options={['All Ledger', ...SALARY_STATUSES]}
                onChange={(val) => updateFilters({ status: val === 'All Ledger' ? 'All' : val })}
                isFilter
              />
            </div>
          </div>
        </div>

        {/* Filters Ext */}
        <div className="px-4 py-4 sm:px-6 bg-background border-b border-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 w-full lg:w-auto">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-[11px] text-muted opacity-50 whitespace-nowrap tracking-widest leading-none">Payroll Cycle</span>
              <div className={cn("flex items-center gap-1.5 bg-sidebar rounded-xl border border-white/5 p-1 transition-opacity duration-500 w-full sm:w-auto", !isMonthFilterActive && "opacity-20 pointer-events-none")}>
                <div className="w-full sm:w-32">
                   <CustomSelect 
                    value={selectedMonth}
                    options={MONTH_NAMES.map((m, i) => ({ label: m, value: i + 1 }))}
                    onChange={val => updateFilters({ month: val, mode: 'selected' })}
                    isFilter
                   />
                </div>
                <div className="w-[1px] h-3 bg-white/10 hidden sm:block" />
                <div className="w-full sm:w-24">
                   <CustomSelect 
                    value={selectedYear}
                    options={YEARS_RANGE.map(y => ({ label: String(y), value: y }))}
                    onChange={val => updateFilters({ year: val, mode: 'selected' })}
                    isFilter
                   />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-[11px] text-muted opacity-50 whitespace-nowrap tracking-widest leading-none">Specialist</span>
              <div className="w-full sm:w-56">
                <CustomSelect 
                  value={workerFilter === 'All' ? 'Whole Team' : workerFilter}
                  options={['Whole Team', ...new Set(workers.map(w => w.name))]}
                  onChange={val => updateFilters({ worker: val === 'Whole Team' ? 'All' : val })}
                  isFilter
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
            <span className="text-[11px] text-muted opacity-50 tracking-widest leading-none">Ledger View</span>
            <div className="flex bg-sidebar border border-white/5 rounded-full p-1 shadow-inner h-9 sm:h-10">
              <button
                onClick={() => updateFilters({ mode: 'selected' })}
                className={cn(
                  "px-4 sm:px-5 h-full rounded-full text-[11px] font-normal transition-all duration-300 whitespace-nowrap",
                  isMonthFilterActive ? "bg-primary text-black" : "text-muted hover:text-white"
                )}
              >
                Selected Cycle
              </button>
              <button
                onClick={() => updateFilters({ mode: 'all' })}
                className={cn(
                  "px-4 sm:px-5 h-full rounded-full text-[11px] font-normal transition-all duration-300 whitespace-nowrap",
                  !isMonthFilterActive ? "bg-white/10 text-white" : "text-muted hover:text-white"
                )}
              >
                Full Ledger
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {(!isMobile && filteredSalaries.length > 0) ? (
            <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
              <thead className="text-[11px] text-muted bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                <tr>
                  <th className="w-[160px] px-8 py-4 border-r border-border leading-none">Month</th>
                  <th className="px-8 py-4 border-r border-border min-w-[200px] leading-none">Worker Name</th>
                  <th className="w-[150px] px-8 py-4 border-r border-border leading-none">Base Pay</th>
                  <th className="w-[150px] px-8 py-4 border-r border-border leading-none">Incentive</th>
                  <th className="w-[180px] px-8 py-4 border-r border-border text-center leading-none">Status</th>
                  <th className="w-[120px] px-8 py-4 text-right leading-none">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSalaries.map((s) => (
                  <tr key={s.id} className="hover:bg-sidebar transition-colors group">
                    <td className="px-8 py-4 border-r border-border text-primary/60 text-[13px] tabular-nums tracking-tight">
                      {getMonthDisplay(s.month)}
                    </td>
                    <td className="px-8 py-4 border-r border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center text-primary text-[10px]">
                          {s.workerName?.charAt(0)}
                        </div>
                        <span className="text-white text-[13px] tracking-tight truncate">{s.workerName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border">
                      <div className="flex items-center gap-2 text-white/80 text-[13px] tabular-nums tracking-tight">
                        <Wallet size={12} className="text-primary/40 shrink-0" />
                        <span>{Number(s.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border">
                      <div className="flex items-center gap-2 text-emerald-400/80 text-[13px] tabular-nums tracking-tight">
                        <Gift size={12} className="text-emerald-500/40 shrink-0" />
                        <span>{Number(s.incentive || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border text-center">
                      <div className="flex justify-center">
                        <StatusSelect
                          value={s.status || 'Pending'}
                          options={SALARY_STATUSES}
                          onChange={(val) => updateSalary(s.id, { ...s, status: val })}
                          getStatusColor={getStatusStyle}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"><Edit2 size={16} /></button>
                        {canManage && <button onClick={() => handleDelete(s.id)} className="p-2.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 space-y-4">
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((s) => (
                  <div key={s.id} className="bg-sidebar border border-white/5 rounded-2xl p-6 space-y-5 relative overflow-hidden transition-all duration-500 ring-1 ring-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center text-primary text-[12px]">
                          {s.workerName?.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-white text-sm tracking-tight leading-tight">{s.workerName}</p>
                           <p className="text-[10px] text-muted opacity-60 leading-none">{getMonthDisplay(s.month)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="p-2.5 text-muted hover:text-white bg-white/5 rounded-xl transition-all border border-white/5"><Edit2 size={15} /></button>
                        {canManage && <button onClick={() => handleDelete(s.id)} className="p-2.5 text-muted hover:text-red-500 bg-red-500/5 rounded-xl transition-all border border-white/5"><Trash2 size={15} /></button>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                       <div className="bg-background/20 border border-white/5 rounded-xl p-3 space-y-1.5">
                          <p className="text-[8px] text-muted opacity-40 tracking-widest leading-none">Net Payout</p>
                          <div className="flex items-center gap-2 text-white text-[12px] tabular-nums truncate">
                             <IndianRupee size={12} className="text-primary/40 shrink-0" />
                             <span>{(Number(s.amount || 0) + Number(s.incentive || 0)).toLocaleString('en-IN')}</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-end">
                          <StatusSelect
                            value={s.status || 'Pending'}
                            options={SALARY_STATUSES}
                            onChange={(val) => updateSalary(s.id, { ...s, status: val })}
                            getStatusColor={getStatusStyle}
                          />
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                   <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                      <Wallet size={32} className="text-muted opacity-20" />
                   </div>
                   <h3 className="text-white text-sm tracking-tighter">Database Clear</h3>
                   <p className="text-[12px] text-muted mt-2 opacity-50 max-w-[200px] leading-relaxed">No workforce payroll data match the current intelligence parameters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedSalary ? "Refine Payroll Asset" : "Authorize Specialist Payout"} size="md">
        <div className="space-y-6 my-4 px-1 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <FormField label="Specialist Identity">
              <CustomSelect 
                value={form.workerName || ''}
                options={[{ label: 'Select Member...', value: '' }, ...workers.map(w => ({ label: w.name, value: w.name }))]}
                onChange={val => setForm({ ...form, workerName: val })}
                placeholder="Select Member..."
                isFilter
              />
            </FormField>
            
            <FormField label="Base Salary (₹)">
              <div className="flex items-center gap-2 bg-sidebar border border-white/10 h-14 px-5 rounded-2xl outline-none focus-within:border-primary/40 transition-all shadow-inner">
                <Wallet size={16} className="text-muted opacity-40 shrink-0" />
                <input 
                  className="bg-transparent w-full tabular-nums text-sm text-white outline-none" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.amount || ''} 
                  onChange={e => setForm({ ...form, amount: e.target.value })} 
                />
              </div>
            </FormField>

            <FormField label="Incentive / Bonus (₹)">
              <div className="flex items-center gap-2 bg-sidebar border border-white/10 h-14 px-5 rounded-2xl outline-none focus-within:border-emerald-500/40 transition-all shadow-inner">
                <Gift size={16} className="text-emerald-400 opacity-40 shrink-0" />
                <input 
                  className="bg-transparent w-full tabular-nums text-sm text-emerald-400 outline-none" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.incentive || ''} 
                  onChange={e => setForm({ ...form, incentive: e.target.value })} 
                />
              </div>
            </FormField>

            <FormField label="Payroll Cycle">
              <input
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-2xl text-[11px] text-white outline-none focus:border-primary/40 transition-all shadow-inner"
                type="month"
                value={form.month || ''}
                onChange={e => setForm({ ...form, month: e.target.value })}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Performance Analysis / Notes">
                <textarea
                  className="bg-sidebar border border-white/10 w-full p-5 rounded-2xl text-xs text-white/50 outline-none focus:border-primary/40 transition-all shadow-inner min-h-[80px] resize-none"
                  placeholder="Optional technical analysis of performance..."
                  value={form.analysis || ''}
                  onChange={e => setForm({ ...form, analysis: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Payment Status">
              <StatusSelect 
                value={form.status || 'Pending'} 
                options={SALARY_STATUSES} 
                onChange={val => setForm({ ...form, status: val })} 
                isFilter
              />
            </FormField>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-4 border-t border-white/5">
            <button className="flex-1 h-14 rounded-2xl text-[12px] text-muted hover:text-white hover:bg-white/5 transition-all" onClick={() => setIsModalOpen(false)}>Discard</button>
            <button className="flex-1 h-14 rounded-2xl text-[12px] font-medium bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20" onClick={handleSave}>Execute Payout</button>
          </div>
        </div>
      </Modal>

    </div>
  )
}
