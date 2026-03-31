import { useState, useMemo, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { cn, formatDate } from '../lib/utils'
import { Plus, Edit2, Trash2, Calendar, User, Phone, MapPin, Briefcase, Activity, Search, StickyNote, FileText } from 'lucide-react'
import { FormField, Modal, EmptyState, SearchBar } from '../components/ui/index'

const STATUSES = ['Applied', 'Interview', 'Selected', 'Rejected']
const ROLES = ['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads', 'Software Developer']

export default function InterviewProcess() {
  const { hiring, addHiring, updateHiring, deleteHiring } = useData()
  const { isManager, isJeevan } = useAuth()
  
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [boardNotes, setBoardNotes] = useState(() => localStorage.getItem('interview_board_notes') || '')
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({})
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const canEdit = isManager || isJeevan

  const filteredHiring = useMemo(() => {
    return (hiring || []).filter(h => 
      h.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
      h.role?.toLowerCase().includes(search.toLowerCase()) ||
      h.phone?.includes(search)
    ).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [hiring, search])
  
  const openAdd = () => {
    setEditItem(null)
    setForm({ 
      date: new Date().toISOString().split('T')[0],
      status: 'Applied',
      candidateName: '',
      phone: '',
      state: '',
      city: '',
      role: ''
    })
    setShowModal(true)
  }

  const openEdit = (h) => {
    setEditItem(h)
    setForm({ ...h })
    setShowModal(true)
  }

  const save = () => {
    if (!form.candidateName || !form.phone) return
    
    if (editItem) updateHiring(editItem.id, form)
    else addHiring(form)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to remove this candidate record?')) {
      deleteHiring(id)
    }
  }

  const handleNotesSave = () => {
    localStorage.setItem('interview_board_notes', boardNotes)
    setShowNotesModal(false)
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tighter truncate leading-none">
                Interview <span className="text-primary/50">Process</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-medium mt-2 opacity-60 leading-none tracking-widest">
                Recruitment Registry • Internal Agency Workforce
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-medium opacity-60 tracking-widest">Total Candidates</p>
              <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter tabular-nums">
                {(filteredHiring.length || 0).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        {/* Functional Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-sidebar/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="w-full sm:max-w-xs group transition-all duration-500 focus-within:max-w-md">
            <SearchBar value={search} onChange={setSearch} placeholder="Search Applicants..." />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowNotesModal(true)}
              className="group flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 h-11 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-full transition-all active:scale-95 shadow-xl"
            >
              <StickyNote size={18} className="text-primary/60 group-hover:text-primary group-hover:rotate-12 transition-all duration-500" />
              <span className="text-[11px] sm:text-[13px] font-medium text-white/70 group-hover:text-white transition-opacity whitespace-nowrap tracking-tight">Notes</span>
            </button>

            {canEdit && (
              <button
                onClick={openAdd}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-3 pl-1.5 pr-6 h-11 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all active:scale-95 shadow-xl ring-1 ring-white/5"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-primary/20">
                  <Plus size={18} strokeWidth={3} />
                </div>
                <span className="text-[11px] sm:text-[13px] font-medium text-white opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-tight">Add Candidate</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {!isMobile && filteredHiring.length > 0 ? (
            <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
              <thead className="text-[11px] text-muted font-medium bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                <tr>
                  <th className="w-[120px] px-8 py-4 border-r border-border leading-none text-left">Date</th>
                  <th className="w-[180px] px-8 py-4 border-r border-border leading-none text-left">Candidate Name</th>
                  <th className="w-[150px] px-8 py-4 border-r border-border leading-none text-left">Phone No</th>
                  <th className="w-[180px] px-8 py-4 border-r border-border leading-none text-left">Location</th>
                  <th className="w-[160px] px-8 py-4 border-r border-border leading-none text-left">Role Applied</th>
                  <th className="w-[130px] px-8 py-4 border-r border-border leading-none text-left">Status</th>
                  <th className="w-[100px] px-8 py-4 text-right leading-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHiring.map(h => (
                  <tr key={h.id} className="hover:bg-sidebar transition-colors group">
                    <td className="px-8 py-4 border-r border-border text-left">
                      <div className="flex items-center gap-3 justify-start h-full">
                        <Calendar size={14} className="text-primary/60 shrink-0" />
                        <span className="text-white/70 font-medium tabular-nums text-[13px] leading-none">{formatDate(h.date)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border text-left">
                      <div className="flex items-center gap-3 justify-start h-full">
                        <User size={14} className="text-muted/40 shrink-0" />
                        <span className="text-white font-medium tracking-tight text-[13px] truncate leading-none" title={h.candidateName}>{h.candidateName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border text-left">
                      <div className="flex items-center gap-3 justify-start h-full">
                        <Phone size={14} className="text-muted/40 shrink-0" />
                        <span className="text-white/80 font-medium text-[13px] tabular-nums leading-none">{h.phone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border text-left">
                      <div className="flex items-center gap-3 justify-start h-full">
                        <MapPin size={14} className="text-muted/40 shrink-0" />
                        <div className="flex flex-col justify-center leading-tight">
                          <span className="text-white/80 font-medium text-[13px] truncate">{h.city || '—'}</span>
                          <span className="text-muted text-[10px] font-medium tracking-tighter opacity-50">{h.state || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border text-left">
                      <div className="flex items-center gap-3 justify-start h-full">
                        <Briefcase size={14} className="text-muted/40 shrink-0" />
                        <span className="text-[13px] font-medium text-white/70 tracking-tight leading-none">
                          {h.role}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-4 border-r border-border text-left">
                       <div className="flex items-center gap-3 justify-start h-full">
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          h.status === 'Selected' ? "bg-green-500 shadow-sm shadow-green-500/50" :
                          h.status === 'Rejected' ? "bg-red-500 shadow-sm shadow-red-500/50" :
                          h.status === 'Interview' ? "bg-yellow-500 shadow-sm shadow-yellow-500/50" :
                          "bg-primary shadow-sm shadow-primary/50"
                        )} />
                        <span className={cn(
                          "text-[13px] font-medium leading-none",
                          h.status === 'Selected' ? "text-green-400" :
                          h.status === 'Rejected' ? "text-red-400" :
                          h.status === 'Interview' ? "text-yellow-400" :
                          "text-primary"
                        )}>{h.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(h)} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95"><Edit2 size={16} /></button>
                        {canEdit && <button onClick={() => handleDelete(h.id)} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all active:scale-95"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {filteredHiring.length > 0 ? (
                filteredHiring.map(h => (
                  <div key={h.id} className="group bg-sidebar/30 hover:bg-sidebar/50 border border-white/5 rounded-xl p-5 sm:p-6 space-y-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99] relative overflow-hidden ring-1 ring-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[9px] font-medium px-2 py-0.5 rounded border tracking-tighter",
                              h.status === 'Selected' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                              h.status === 'Rejected' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                              h.status === 'Interview' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                              "bg-primary/10 text-primary border-primary/20"
                            )}>
                              {h.status}
                            </span>
                          </div>
                          <p className="text-white font-medium text-base sm:text-lg tracking-tight leading-tight line-clamp-1">{h.candidateName}</p>
                          <p className="text-[10px] text-muted font-medium tracking-widest opacity-60 mt-2">{h.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => openEdit(h)} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-muted hover:text-white bg-white/5 rounded-xl transition-all active:scale-90 border border-white/5"><Edit2 size={16} /></button>
                        {canEdit && <button onClick={() => handleDelete(h.id)} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-muted hover:text-red-500 bg-red-500/5 rounded-xl transition-all active:scale-90 border border-white/5"><Trash2 size={16} /></button>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-xl p-3 group-hover:border-primary/20 transition-all duration-500">
                        <p className="text-[9px] text-muted font-medium opacity-50 tracking-widest leading-none mb-1">Contact</p>
                        <div className="flex items-center gap-2 text-white/80 font-medium text-xs tracking-tighter tabular-nums truncate">
                          <Phone size={12} className="text-muted/40 shrink-0" />
                          <span>{h.phone}</span>
                        </div>
                      </div>
                      <div className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-xl p-3 group-hover:border-primary/20 transition-all duration-500">
                        <p className="text-[9px] text-muted font-medium opacity-50 tracking-widest leading-none mb-1">Applied On</p>
                        <div className="flex items-center gap-2 text-white/80 font-medium text-xs tracking-tighter tabular-nums truncate">
                          <Calendar size={12} className="text-primary/60 shrink-0" />
                          <span>{formatDate(h.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg transition-all">
                      <MapPin size={12} className="text-muted/40 shrink-0" />
                      <p className="text-[10px] text-white/60 font-medium truncate">
                        {h.city || '—'}, <span className="opacity-50">{h.state || '—'}</span>
                      </p>
                    </div>


                  </div>
                ))
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                    <Search size={32} className="text-muted opacity-20" />
                  </div>
                  <h3 className="text-white font-medium text-lg tracking-tighter">
                    {search ? "No match found" : "No candidates available"}
                  </h3>
                  <p className="text-[12px] text-muted font-medium mt-2 opacity-50 max-w-[240px] leading-relaxed">
                    {search ? "Adjust your search parameters to locate specific candidates." : "Register a new applicant to initiate the recruitment evaluation process."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Candidate Profile' : 'Register New Candidate'} size="md">
        <div className="space-y-6 my-4 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Candidate Name">
              <input 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-medium text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                value={form.candidateName || ''} 
                onChange={e => setForm({...form, candidateName: e.target.value})} 
                placeholder="Full name" 
              />
            </FormField>
            <FormField label="Phone No">
              <input 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-medium text-white outline-none focus:border-primary/40 transition-all shadow-inner tabular-nums" 
                value={form.phone || ''} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                placeholder="Contact number" 
              />
            </FormField>
            <FormField label="State">
              <input 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-medium text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                value={form.state || ''} 
                onChange={e => setForm({...form, state: e.target.value})} 
                placeholder="State" 
              />
            </FormField>
            <FormField label="City">
              <input 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-medium text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                value={form.city || ''} 
                onChange={e => setForm({...form, city: e.target.value})} 
                placeholder="City" 
              />
            </FormField>
            <FormField label="Role Applied">
              <select
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-medium text-white outline-none focus:border-primary/40 transition-all shadow-inner appearance-none"
                value={form.role || ''}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="">Select Target Role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-medium text-white outline-none focus:border-primary/40 transition-all shadow-inner appearance-none"
                value={form.status || 'Applied'} 
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Registration Date">
              <input 
                type="date" 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-medium text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                value={form.date || ''} 
                onChange={e => setForm({...form, date: e.target.value})} 
                />
            </FormField>
          </div>


          
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-white/5">
            <button className="flex-1 h-14 rounded-xl text-[12px] font-medium text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="flex-1 h-14 rounded-xl text-[12px] font-medium bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none active:scale-95" onClick={save}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showNotesModal} onClose={() => setShowNotesModal(false)} title="Recruitment Board Notes" size="md">
        <div className="space-y-6 my-4 px-1">
          <div className="space-y-3">
             <div className="flex items-center gap-3 text-muted/40 mb-2">
                <FileText size={16} />
                <span className="text-[10px] font-medium tracking-widest leading-none">Global Evaluation Criteria</span>
             </div>
             <textarea 
               className="w-full h-80 bg-sidebar border border-white/10 rounded-2xl p-6 text-[13px] text-white/80 font-medium outline-none focus:border-primary/40 transition-all shadow-inner resize-none leading-relaxed placeholder:text-muted/20"
               placeholder="Enter internal evaluation criteria, hiring standards, or general board notes here..."
               value={boardNotes}
               onChange={e => setBoardNotes(e.target.value)}
             />
             <p className="text-[10px] text-muted font-medium opacity-30 px-2 font-mono">Changes stay persistent across local board sessions.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-6 border-t border-white/5">
            <button className="flex-1 h-14 rounded-xl text-[12px] font-medium text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setShowNotesModal(false)}>Close</button>
            <button className="flex-1 h-14 rounded-xl text-[12px] font-medium bg-primary/90 hover:bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none active:scale-95" onClick={handleNotesSave}>
              Save Board Notes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
