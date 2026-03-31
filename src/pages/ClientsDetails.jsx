import { useState, useRef, useEffect, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useSearchParams } from 'react-router-dom'
import { 
  EmptyState, Modal, FormField, StatusSelect, SearchBar
} from '../components/ui/index'
import { cn, formatDate } from '../lib/utils'
import { 
  Plus, Edit2, Trash2, Calendar, Phone, Camera, X, Target
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts'

const ACTIVE_STATUSES = ['Active', 'Inactive']
const PAYMENT_STATUSES = ['Partial', 'Pending', 'Completed']

const STATUS_COLORS_MAP = {
  'Active': '#10b981',
  'Inactive': '#94a3b8',
  'Partial': '#f59e0b',
  'Pending': '#ef4444',
  'Completed': '#10b981'
}

const getPaymentColor = (status) => {
  switch(status) {
    case 'Completed': return 'text-emerald-400 bg-[#062016] border-[#0a3622]'
    case 'Partial': return 'text-amber-400 bg-[#352512] border-[#4a3419]'
    case 'Pending': return 'text-red-400 bg-[#2d1111] border-[#451a1a]'
    default: return 'text-muted bg-white/5 border-white/10'
  }
}

function ActivityToggle({ value, onChange }) {
  const isActive = value === 'Active'
  return (
    <button 
      onClick={() => onChange(isActive ? 'Inactive' : 'Active')}
      className={cn(
        "relative w-[48px] h-[22px] rounded-full transition-all duration-500 p-1 cursor-pointer",
        isActive ? "bg-primary/20 border-primary/30" : "bg-white/5 border-white/10",
        "border"
      )}
    >
      <div className={cn(
        "w-3.5 h-3.5 rounded-full transition-all duration-500 shadow-xl",
        isActive ? "translate-x-[26px] bg-primary" : "translate-x-0 bg-white/20"
      )} />
    </button>
  )
}

function ClientAvatar({ name, logo, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-full text-[10px]",
    md: "w-11 h-11 rounded-full text-xs",
    lg: "w-20 h-20 rounded-full text-2xl"
  }
  
  if (logo) {
    return (
      <div className={cn(sizeClasses[size], "border border-white/10 overflow-hidden shadow-2xl bg-surface-800 flex flex-shrink-0 group-hover:scale-110 transition-transform")}>
        <img src={logo} alt={name} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className={cn(
      sizeClasses[size], 
      "bg-surface-800 border border-white/5 flex items-center justify-center font-normal text-primary flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform"
    )}>
      {name?.charAt(0)}
    </div>
  )
}

function DashboardOverview({ clients }) {
  const statusCounts = ACTIVE_STATUSES.map(status => ({
    name: status,
    value: clients.filter(c => c.activeStatus === status).length,
    color: STATUS_COLORS_MAP[status] || '#94a3b8'
  })).filter(item => item.value > 0)

  const total = clients.length

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl">
          <p className="text-[10px] text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: payload[0].payload.color || payload[0].fill }} />
            {`${payload[0].name} : ${payload[0].value}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden h-auto min-h-[160px] sm:min-h-[220px] py-6 sm:py-8">
      <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-24">
          <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] flex-shrink-0 mx-auto lg:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {statusCounts.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-1">
              <span className="text-3xl sm:text-4xl font-medium text-white leading-none tracking-tighter">{total.toString().padStart(2, '0')}</span>
              <span className="text-[8px] sm:text-[10px] text-muted font-medium mt-1 opacity-60  tracking-widest">Partners</span>
            </div>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-6 sm:gap-10 lg:gap-16 w-full text-center lg:text-left">
            {ACTIVE_STATUSES.map(status => {
              const count = clients.filter(c => c.activeStatus === status).length

              return (
                <div key={status} className="flex flex-col group cursor-default min-w-[80px]">
                  <p className="text-[9px] sm:text-[11px] text-muted font-medium mb-1 sm:mb-2 group-hover:text-white transition-colors opacity-60 leading-none tracking-widest capitalize">{status.toLowerCase()}</p>
                  <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                    <div className="h-4 sm:h-5 w-1 rounded-full group-hover:h-8 transition-all" style={{ background: count > 0 ? STATUS_COLORS_MAP[status] : 'rgba(255,255,255,0.05)' }} />
                    <p className={`text-2xl sm:text-4xl font-medium group-hover:scale-110 transition-transform tabular-nums tracking-tighter ${count > 0 ? 'text-white' : 'text-primary/20'}`}>
                      {count.toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ClientsDetails() {
  const { clients, addClient, updateClient, deleteClient } = useData()
  const { isManager, isJeevan } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const search = searchParams.get('q') || ''
  const activeFilter = searchParams.get('active') || 'All'
  const paymentFilter = searchParams.get('payment') || 'All'

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All' || value === 'All Activity' || value === 'All Payments') nextParams.delete(key)
      else nextParams.set(key, value)
    })
    setSearchParams(nextParams, { replace: true })
  }

  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({})
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const canManage = isManager || isJeevan
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const filteredClients = useMemo(() => {
    return (clients || []).filter(c => {
      const matchesOnboard = c.status === 'Onboard'
      const matchesSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.contact?.includes(search)
      const matchesActive = activeFilter === 'All' || c.activeStatus === activeFilter
      const matchesPayment = paymentFilter === 'All' || c.paymentStatus === paymentFilter
      return matchesOnboard && matchesSearch && matchesActive && matchesPayment
    }).sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }, [clients, search, activeFilter, paymentFilter])

  const openAdd = () => {
    setEditItem(null)
    setForm({ activeStatus: 'Active', paymentStatus: 'Pending', status: 'Onboard', name: '', contact: '', clientID: '' })
    setShowModal(true)
  }

  const openEdit = (client) => {
    setEditItem(client)
    setForm({ ...client })
    setShowModal(true)
  }

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => f('logo', reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!form.name) return
    const payload = { ...form, status: 'Onboard' }
    if (editItem) updateClient(editItem.id, payload)
    else addClient(payload)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this client record?')) deleteClient(id)
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      <DashboardOverview clients={clients} />

      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tighter truncate">
                Partnership <span className="text-primary/50">Registry</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-medium mt-1 opacity-60 leading-none">
                Strategic Alliance Management • Internal Agency Hub
              </p>
            </div>
            {canManage && (
              <button 
                onClick={openAdd} 
                className="group flex items-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full transition-all active:scale-95 shadow-2xl"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-black group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-primary/20">
                  <Plus size={18} strokeWidth={3} />
                </div>
                <span className="text-[11px] sm:text-[13px] font-medium text-white tracking-tight">Onboard Client</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        {/* Functional Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-sidebar/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="w-full sm:max-w-xs transition-all duration-500">
            <SearchBar value={search} onChange={val => updateFilters({ q: val })} placeholder="Search Portfolio..." />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <div className="w-40 shrink-0">
               <StatusSelect 
                 value={activeFilter === 'All' ? 'All Activity' : activeFilter} 
                 options={['All Activity', ...ACTIVE_STATUSES]} 
                 onChange={val => updateFilters({ active: val === 'All Activity' ? 'All' : val })} 
                 isFilter
               />
            </div>
            <div className="w-40 shrink-0">
               <StatusSelect 
                 value={paymentFilter === 'All' ? 'All Payments' : paymentFilter} 
                 options={['All Payments', ...PAYMENT_STATUSES]} 
                 onChange={val => updateFilters({ payment: val === 'All Payments' ? 'All' : val })} 
                 isFilter
               />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {!isMobile && filteredClients.length > 0 ? (
            <table className="w-full min-w-[1100px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
              <thead className="text-[11px] text-muted bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                <tr>
                   <th className="w-[80px] px-6 py-4 border-r border-border leading-none text-center">Brand Logo</th>
                   <th className="w-[120px] px-8 py-4 border-r border-border leading-none">Client ID</th>
                   <th className="w-[280px] px-8 py-4 border-r border-border leading-none">Client Name</th>
                   <th className="w-[200px] px-8 py-4 border-r border-border leading-none">Contact</th>
                   <th className="w-[120px] px-8 py-4 border-r border-border text-center leading-none">Activity</th>
                   <th className="w-[180px] px-8 py-4 border-r border-border text-center leading-none">Payment Status</th>
                   <th className="w-[130px] px-8 py-4 text-right leading-none">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClients.map(c => (
                  <tr key={c.id} className="hover:bg-sidebar transition-all group">
                    <td className="px-6 py-3 border-r border-border">
                       <div className="flex justify-center">
                          <ClientAvatar name={c.name} logo={c.logo} />
                       </div>
                    </td>
                    <td className="px-8 py-3 border-r border-border">
                       <span className="text-[11px] text-white/40 tracking-tight bg-white/5 px-2.5 py-1 rounded-md border border-white/5 ">
                         {c.clientID || 'PENDING'}
                       </span>
                    </td>
                    <td className="px-8 py-3 border-r border-border">
                       <div className="flex flex-col gap-1">
                          <span className="text-white text-[13px] tracking-tight truncate">{c.name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-3 border-r border-border">
                       <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center border border-white/5">
                             <Phone size={12} className="text-muted/40" />
                          </div>
                          <span className="text-white/70 text-[12px] tabular-nums tracking-tight">{c.contact || '—'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-3 border-r border-border text-center">
                       <div className="flex justify-center">
                          <ActivityToggle 
                            value={c.activeStatus || 'Active'} 
                            onChange={(val) => updateClient(c.id, { activeStatus: val })}
                          />
                       </div>
                    </td>
                    <td className="px-8 py-3 border-r border-border text-center">
                       <div className="flex justify-center">
                          <StatusSelect 
                            value={c.paymentStatus || 'Pending'} 
                            options={PAYMENT_STATUSES}
                            onChange={(val) => updateClient(c.id, { paymentStatus: val })}
                            getStatusColor={getPaymentColor}
                          />
                       </div>
                    </td>
                    <td className="px-8 py-3">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(c)} className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"><Edit2 size={16} /></button>
                          {canManage && <button onClick={() => handleDelete(c.id)} className="p-2.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"><Trash2 size={16} /></button>}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
               {filteredClients.map(c => (
                 <div key={c.id} className="group bg-sidebar/30 border border-white/5 rounded-2xl p-6 space-y-5 transition-all duration-500 relative overflow-hidden ring-1 ring-white/5">
                    <div className="flex items-start justify-between gap-4">
                       <div className="flex items-center gap-4">
                          <ClientAvatar name={c.name} logo={c.logo} />
                          <div className="space-y-0.5">
                             <p className="text-white text-sm tracking-tight leading-tight line-clamp-1">{c.name}</p>
                             <p className="text-[9px] text-muted opacity-40  tracking-tight">ID: {c.clientID || 'PENDING'}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => openEdit(c)} className="w-9 h-9 flex items-center justify-center text-muted hover:text-white bg-white/5 rounded-xl transition-all border border-white/5"><Edit2 size={15} /></button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                       <div className="space-y-1.5">
                          <p className="text-[8px] text-muted opacity-40  tracking-widest leading-none">Contact</p>
                          <div className="flex items-center gap-2 text-white text-[12px] tabular-nums truncate">
                             <Phone size={12} className="text-primary/40 shrink-0" />
                             <span>{c.contact || 'N/A'}</span>
                          </div>
                       </div>
                       <div className="space-y-1.5 text-right">
                          <p className="text-[8px] text-muted opacity-40  tracking-widest leading-none">Activity</p>
                          <div className="flex justify-end">
                             <ActivityToggle 
                               value={c.activeStatus || 'Active'} 
                               onChange={(val) => updateClient(c.id, { activeStatus: val })}
                             />
                          </div>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                       <p className="text-[8px] text-muted opacity-40  tracking-widest leading-none mb-3">Payment Status</p>
                       <StatusSelect 
                          value={c.paymentStatus} 
                          options={PAYMENT_STATUSES}
                          onChange={(val) => updateClient(c.id, { paymentStatus: val })}
                          getStatusColor={getPaymentColor}
                        />
                    </div>
                 </div>
               ))}
               {filteredClients.length === 0 && (
                 <div className="col-span-full py-24 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                       <Target size={32} className="text-muted opacity-20" />
                    </div>
                    <h3 className="text-white text-lg tracking-tighter">Database Clear</h3>
                    <p className="text-xs text-muted mt-2 opacity-50 max-w-[240px] leading-relaxed">No strategic client partnerships identified in the current intelligence feed.</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Refine Client Record' : 'Onboard New Identity'} size="lg">
        <div className="space-y-8 my-6 px-1">
           <div className="flex flex-col items-center gap-6 mb-8">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <div className="w-32 h-32 rounded-full bg-sidebar border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/40 shadow-inner">
                    {form.logo ? (
                       <img src={form.logo} className="w-full h-full object-cover" />
                    ) : (
                       <div className="flex flex-col items-center gap-2 text-muted">
                          <Camera size={24} className="opacity-40" />
                          <span className="text-[9px]  tracking-widest">Brand Logo</span>
                       </div>
                    )}
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                    <Plus size={20} />
                 </div>
                 {form.logo && (
                   <button onClick={(e) => { e.stopPropagation(); f('logo', '') }} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                     <X size={14} />
                   </button>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <FormField label="Brand/Entity Name">
                    <input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-2xl text-xs text-white outline-none focus:border-primary/40 transition-all shadow-inner" value={form.name || ''} onChange={e => f('name', e.target.value)} placeholder="Full legal/business title" />
                 </FormField>
                 <FormField label="Manual Identity (Optional)">
                     <input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-2xl text-xs text-white outline-none focus:border-primary/40 transition-all shadow-inner tabular-nums" value={form.clientID || ''} onChange={e => f('clientID', e.target.value)} placeholder="Auto-generated (e.g. ADMC001)" />
                 </FormField>
              </div>
              <div className="space-y-6">
                 <FormField label="Relay Communication">
                    <input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-2xl text-xs text-white outline-none focus:border-primary/40 transition-all shadow-inner tabular-nums" value={form.contact || ''} onChange={e => f('contact', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                 </FormField>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField label="Activity Preset">
                       <StatusSelect 
                         value={form.activeStatus || 'Active'} 
                         options={ACTIVE_STATUSES} 
                         onChange={val => f('activeStatus', val)} 
                         isFilter
                       />
                    </FormField>
                    <FormField label="Payment Status">
                       <StatusSelect 
                         value={form.paymentStatus || 'Pending'} 
                         options={PAYMENT_STATUSES} 
                         onChange={val => f('paymentStatus', val)} 
                         isFilter
                       />
                    </FormField>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-white/5">
              <button className="flex-1 h-14 rounded-2xl text-[12px] text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setShowModal(false)}>Discard</button>
              <button className="flex-1 h-14 rounded-2xl text-[12px] font-medium bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none" onClick={handleSave}>
                 {editItem ? 'Confirm Refinement' : 'Confirm Registration'}
              </button>
           </div>
        </div>
      </Modal>

    </div>
  )
}
