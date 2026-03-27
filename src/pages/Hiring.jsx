import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { Modal, FormField, SearchBar, StatusSelect, CustomSelect } from '../components/ui/index'
import { formatDate, cn } from '../lib/utils'
import { Plus, Edit2, Trash2, ChevronRight, UserPlus, Target, CheckCircle2, XCircle, MapPin, Phone, Briefcase, Calendar } from 'lucide-react'

const HIRING_STATUSES = ['Applied', 'Interview', 'Selected', 'Rejected']
const ROLES = ['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads', 'Manager']

export default function Hiring() {
  const { hiring, addHiring, updateHiring, deleteHiring } = useData()
  const { isManager, isJeevan, canDelete } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [form, setForm] = useState({})
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const canEdit = isManager || isJeevan
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const filtered = (hiring || []).filter(h => {
    const matchSearch = !search || h.candidateName?.toLowerCase().includes(search.toLowerCase()) || h.role?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || h.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => {
    setEditItem(null)
    setForm({ status: 'Applied', date: new Date().toISOString().split('T')[0], rounds: 0 })
    setShowModal(true)
  }
  const openEdit = (h) => { setEditItem(h); setForm({ ...h }); setShowModal(true) }
  const save = () => {
    if (editItem) updateHiring(editItem.id, form)
    else addHiring(form)
    setShowModal(false)
  }

  const statusCounts = HIRING_STATUSES.reduce((acc, s) => {
    acc[s] = (hiring || []).filter(h => h.status === s).length
    return acc
  }, {})

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tighter truncate">
                Talent <span className="text-primary/50">Pipeline</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-bold mt-1 opacity-60 leading-none uppercase tracking-widest">
                Personnel Acquisition • Internal Workforce Expansion
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-bold opacity-60 tracking-widest uppercase">Active Applicants</p>
              <p className="text-2xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums">
                {(hiring?.length || 0).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          
          {/* Pipeline Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
             <PipelineCard label="Applied" count={statusCounts['Applied']} icon={UserPlus} color="text-blue-400" bg="bg-blue-400/10" active={statusFilter === 'Applied'} onClick={() => setStatusFilter(statusFilter === 'Applied' ? 'All' : 'Applied')} />
             <PipelineCard label="Interview" count={statusCounts['Interview']} icon={Target} color="text-amber-400" bg="bg-amber-400/10" active={statusFilter === 'Interview'} onClick={() => setStatusFilter(statusFilter === 'Interview' ? 'All' : 'Interview')} />
             <PipelineCard label="Selected" count={statusCounts['Selected']} icon={CheckCircle2} color="text-green-400" bg="bg-green-400/10" active={statusFilter === 'Selected'} onClick={() => setStatusFilter(statusFilter === 'Selected' ? 'All' : 'Selected')} />
             <PipelineCard label="Rejected" count={statusCounts['Rejected']} icon={XCircle} color="text-red-400" bg="bg-red-400/10" active={statusFilter === 'Rejected'} onClick={() => setStatusFilter(statusFilter === 'Rejected' ? 'All' : 'Rejected')} />
          </div>

          {/* Functional Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-sidebar/50 border border-white/5 rounded-3xl p-4 sm:p-6 backdrop-blur-3xl sticky top-0 z-20 shadow-2xl">
              <div className="w-full sm:max-w-xs group transition-all duration-500 focus-within:max-w-md">
                 <SearchBar value={search} onChange={setSearch} placeholder="Search Pipeline..." />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="w-full sm:w-48">
                    <StatusSelect 
                      value={statusFilter === 'All' ? 'All Status' : statusFilter} 
                      options={['All Status', ...HIRING_STATUSES]} 
                      onChange={val => setStatusFilter(val === 'All Status' ? 'All' : val)}
                      isFilter
                    />
                 </div>
                 {canEdit && (
                   <button 
                    onClick={openAdd}
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-primary/20"
                   >
                     <Plus size={20} strokeWidth={3} />
                   </button>
                 )}
              </div>
          </div>

          {/* Pipeline Content */}
          {!isMobile ? (
            <div className="bg-sidebar/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-3xl">
               <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                     <tr className="text-[10px] text-muted font-bold uppercase tracking-widest bg-white/[0.02]">
                        <th className="px-6 py-4 opacity-40">Candidate</th>
                        <th className="px-6 py-4 opacity-40">Information</th>
                        <th className="px-6 py-4 opacity-40">Designation</th>
                        <th className="px-6 py-4 opacity-40">Status</th>
                        <th className="px-6 py-4 opacity-40 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {filtered.map(h => (
                        <tr key={h.id} className="group hover:bg-white/[0.02] transition-all cursor-pointer" onClick={() => setDetailItem(h)}>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                    {h.candidateName?.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-[13px] font-bold text-white tracking-tight">{h.candidateName}</p>
                                    <p className="text-[10px] text-muted font-bold opacity-30 mt-1 uppercase tracking-tighter tabular-nums">{formatDate(h.date)}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 text-[11px] text-white/60 font-medium">
                                    <MapPin size={12} className="opacity-40" /> {h.city}, {h.state}
                                 </div>
                                 <div className="flex items-center gap-2 text-[11px] text-white/60 font-medium">
                                    <Phone size={12} className="opacity-40" /> {h.phone}
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg w-fit text-[11px] font-bold text-white tracking-tight">
                                 {h.role}
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                                h.status === 'Applied' ? "bg-blue-400/10 text-blue-400 border-blue-400/20" :
                                h.status === 'Interview' ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
                                h.status === 'Selected' ? "bg-green-400/10 text-green-400 border-green-400/20" :
                                "bg-red-400/10 text-red-400 border-red-400/20"
                              )}>{h.status}</span>
                           </td>
                           <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                 {canEdit && <button onClick={() => openEdit(h)} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"><Edit2 size={14} /></button>}
                                 {canDelete && <button onClick={() => deleteHiring(h.id)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"><Trash2 size={14} /></button>}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
               {filtered.map(h => (
                  <div key={h.id} className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 space-y-5 backdrop-blur-3xl group active:scale-[0.98] transition-all" onClick={() => setDetailItem(h)}>
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                              {h.candidateName?.charAt(0)}
                           </div>
                           <div>
                              <p className="text-base font-bold text-white tracking-tight leading-none">{h.candidateName}</p>
                              <p className="text-[10px] text-muted font-bold opacity-30 mt-2 uppercase tracking-widest">{h.role}</p>
                           </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                          h.status === 'Applied' ? "bg-blue-400/10 text-blue-400 border-blue-400/20" :
                          h.status === 'Interview' ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
                          h.status === 'Selected' ? "bg-green-400/10 text-green-400 border-green-400/20" :
                          "bg-red-400/10 text-red-400 border-red-400/20"
                        )}>{h.status}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                           <MapPin size={14} className="text-primary/40" />
                           <span className="text-[11px] font-bold text-white/60 truncate">{h.city}</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-end gap-3 text-right">
                           <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest tabular-nums">{formatDate(h.date)}</span>
                           <Calendar size={14} className="text-primary/40" />
                        </div>
                     </div>
                  </div>
               ))}
               {filtered.length === 0 && (
                 <div className="py-24 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 opacity-20"><Target size={32} /></div>
                    <p className="text-sm font-bold text-muted uppercase tracking-[0.2em] opacity-40">No entries identified</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Refine Applicant Data' : 'Initialize New Applicant'} size="lg">
        <div className="space-y-6 my-6 px-1 max-h-[80vh] overflow-y-auto custom-scrollbar">
           <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name Identity"><input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" value={form.candidateName || ''} onChange={e => f('candidateName', e.target.value)} placeholder="Full name" /></FormField>
                <FormField label="Primary Contact"><input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" value={form.phone || ''} onChange={e => f('phone', e.target.value)} placeholder="Phone number" /></FormField>
                <FormField label="State Location"><input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" value={form.state || ''} onChange={e => f('state', e.target.value)} placeholder="State" /></FormField>
                <FormField label="City Landmark"><input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" value={form.city || ''} onChange={e => f('city', e.target.value)} placeholder="City" /></FormField>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Target Designation">
                <CustomSelect 
                  value={form.role || ''} 
                  options={[{ label: 'Select role', value: '' }, ...ROLES.map(r => ({ label: r, value: r }))]}
                  onChange={val => f('role', val)}
                  isFilter
                />
              </FormField>
              <FormField label="Pipeline Status">
                <StatusSelect 
                  value={form.status || 'Applied'} 
                  options={HIRING_STATUSES} 
                  onChange={val => f('status', val)}
                  isFilter
                />
              </FormField>
              <FormField label="Assessment Rounds"><input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" type="number" value={form.rounds || 0} onChange={e => f('rounds', parseInt(e.target.value))} /></FormField>
              <FormField label="Final Decision">
                <StatusSelect 
                  value={form.result || 'Pending'} 
                  options={['Pending', 'Hired', 'Not Selected']} 
                  onChange={val => f('result', val)}
                  isFilter
                />
              </FormField>
              <FormField label="Initiation Date"><input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-[11px] font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner uppercase" type="date" value={form.date || ''} onChange={e => f('date', e.target.value)} /></FormField>
           </div>
           
           <FormField label="Internal Protocol Notes">
              <textarea className="bg-sidebar border border-white/10 w-full p-5 rounded-2xl text-xs font-medium text-white/70 outline-none focus:border-primary/40 transition-all shadow-inner min-h-[100px] resize-none" rows={3} value={form.notes || ''} onChange={e => f('notes', e.target.value)} placeholder="Observation logs and technical notes..." />
           </FormField>

           <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-white/5">
              <button className="flex-1 h-14 rounded-xl text-[12px] font-bold text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setShowModal(false)}>Discard</button>
              <button className="flex-1 h-14 rounded-xl text-[12px] font-bold bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none" onClick={save}>{editItem ? 'Confirm Refinement' : 'Confirm Registration'}</button>
           </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailItem} onClose={() => setDetailItem(null)} title="Candidate Assessment Profile" size="md">
        {detailItem && (
          <div className="space-y-8 my-6 px-1">
            <div className="flex items-center gap-6 p-6 bg-sidebar/50 border border-white/5 rounded-3xl backdrop-blur-3xl shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold text-primary shadow-inner">
                {detailItem.candidateName?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tighter">{detailItem.candidateName}</h3>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary" />
                   <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">{detailItem.role} Candidate</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <DetailBox label="Location" value={`${detailItem.city}, ${detailItem.state}`} icon={MapPin} />
               <DetailBox label="Contact" value={detailItem.phone} icon={Phone} />
               <DetailBox label="Application Date" value={formatDate(detailItem.date)} icon={Calendar} />
               <DetailBox label="Pipeline Position" value={detailItem.status} icon={Target} />
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] opacity-40">Assessment Trajectory</h4>
              <div className="flex gap-4">
                {[1,2,3].map(round => (
                  <div key={round} className={cn(
                    "flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3",
                    round <= detailItem.rounds ? "bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/5" : "bg-white/5 border-white/10 text-muted opacity-30 border-dashed"
                  )}>
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Round {round}</span>
                    {round <= detailItem.rounds ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-full border border-current opacity-20" />}
                  </div>
                ))}
              </div>
            </div>

            {detailItem.notes && (
              <div className="space-y-4 pt-8 border-t border-white/5">
                <h4 className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] opacity-40">Observation Logs</h4>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                   <p className="text-[13px] text-white/70 font-medium leading-relaxed italic">"{detailItem.notes}"</p>
                   <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                </div>
              </div>
            )}
            
            <button 
              className="w-full h-14 mt-4 bg-white text-black font-bold text-xs rounded-xl hover:bg-primary transition-all active:scale-95 shadow-2xl"
              onClick={() => setDetailItem(null)}
            >
               Close Assessment
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

function PipelineCard({ label, count, icon: Icon, color, bg, active, onClick }) {
   return (
     <div 
        onClick={onClick}
        className={cn(
          "bg-sidebar/30 border rounded-3xl p-6 transition-all cursor-pointer group hover:bg-sidebar/50 relative overflow-hidden",
          active ? "border-primary/50 bg-primary/10 shadow-2xl shadow-primary/10 scale-[1.02] z-10" : "border-white/5"
        )}
     >
        <div className="flex items-center justify-between mb-4">
           <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", bg, color)}>
              <Icon size={18} />
           </div>
           {active && <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary" />}
        </div>
        <p className="text-3xl font-bold text-white tabular-nums tracking-tighter">{count.toString().padStart(2, '0')}</p>
        <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-40 mt-1">{label}</p>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
     </div>
   )
}

function DetailBox({ label, value, icon: Icon }) {
   return (
     <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 hover:bg-white/[0.08] transition-all group">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
              <Icon size={14} />
           </div>
           <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] opacity-40">{label}</p>
        </div>
        <p className="text-[14px] font-bold text-white tracking-tight">{value}</p>
     </div>
   )
}
