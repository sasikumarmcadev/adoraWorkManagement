import { useState, useMemo, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { cn, formatDate } from '../lib/utils'
import {
  Plus, Search, Edit2, Trash2,
  Users, Calendar, Briefcase, Camera,
  ArrowLeft, ShoppingBag, User, Check
} from 'lucide-react'
import { Modal, FormField, SearchBar } from '../components/ui/index'

const ROLE = 'Meta Ads'

export default function MetaAdsInfo() {
  const { workers, addWorker, updateWorker, deleteWorker } = useData()
  const { isManager, isJeevan } = useAuth()
  const canManage = isManager || isJeevan

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [form, setForm] = useState({})
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredWorkers = useMemo(() => {
    return (workers || []).filter(w => {
      const matchesRole = w.role === ROLE
      const matchesSearch = !search || w.name?.toLowerCase().includes(search.toLowerCase())
      return matchesRole && matchesSearch
    }).sort((a, b) => new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0))
  }, [workers, search])

  const openAdd = () => {
    setSelectedWorker(null)
    setForm({
      joinedDate: new Date().toISOString().split('T')[0],
      name: '',
      role: ROLE,
      avatar: null
    })
    setImagePreview(null)
    setIsModalOpen(true)
  }

  const openEdit = (worker) => {
    setSelectedWorker(worker)
    setForm({ ...worker })
    setImagePreview(worker.avatar)
    setIsModalOpen(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setForm({ ...form, avatar: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!form.name) return
    const payload = {
      ...form,
      role: ROLE,
      access: form.access || 'Worker'
    }
    if (selectedWorker) updateWorker(selectedWorker.id, payload)
    else addWorker(payload)
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to remove this profile?')) deleteWorker(id)
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">

      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tighter truncate">
                {ROLE} <span className="text-primary/50">Info</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-bold mt-1 opacity-60 leading-none">
                Person Registry • Internal Agency Workforce
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-bold opacity-60 tracking-widest">Total Employee</p>
              <p className="text-2xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums">
                {filteredWorkers.length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">

        {/* Functional Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-sidebar/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="w-full sm:max-w-xs group transition-all duration-500 focus-within:max-w-md">
            <SearchBar value={search} onChange={setSearch} placeholder="Search Registry..." />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {canManage && (
              <button
                onClick={openAdd}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all active:scale-95 shadow-xl ring-1 ring-white/5"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-black group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-primary/20">
                  <Plus size={18} strokeWidth={3} />
                </div>
                <span className="text-[11px] sm:text-[13px] font-bold text-white opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-tight">Add Member</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {!isMobile && filteredWorkers.length > 0 ? (
            <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
              <thead className="text-[11px] text-muted font-bold bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                <tr>
                  <th className="w-[100px] px-6 py-4 border-r border-border leading-none text-center">Photo</th>
                  <th className="w-[150px] px-8 py-4 border-r border-border leading-none">Employee ID</th>
                  <th className="w-[200px] px-8 py-4 border-r border-border leading-none">Employee Name</th>
                  <th className="w-[200px] px-8 py-4 border-r border-border leading-none">Designation</th>
                   <th className="w-[180px] px-8 py-4 border-r border-border leading-none">Position Level</th>
                   <th className="w-[180px] px-8 py-4 border-r border-border leading-none">Joined Date</th>
                  <th className="w-[130px] px-8 py-4 text-right leading-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                 {filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-sidebar transition-colors group">
                    <td className="px-6 py-4 border-r border-border">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => { if (w.avatar) { setPreviewData(w); setIsPreviewOpen(true); } }}
                          className={cn(
                            "w-11 h-11 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-all",
                            w.avatar ? "cursor-zoom-in hover:scale-110 active:scale-95 ring-2 ring-primary/20" : "grayscale opacity-40 cursor-default"
                          )}
                        >
                          {w.avatar ? (
                            <img src={w.avatar} alt={w.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-bold text-[13px]">{w.name?.split(' ').map(n => n[0]).join('')}</span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-4 border-r border-border">
                      <span className="text-[11px] text-muted font-bold tracking-wider bg-white/5 px-2.5 py-1 rounded-md border border-white/5 uppercase">
                        {w.employeeID || 'AE-PENDING'}
                      </span>
                    </td>
                    <td className="px-8 py-4 border-r border-border overflow-hidden">
                      <span className="text-white font-bold text-[13px] tracking-tight block truncate" title={w.name}>{w.name}</span>
                    </td>
                    <td className="px-8 py-4 border-r border-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/20 shrink-0" />
                        <span className="text-[13px] font-bold text-secondary whitespace-nowrap">{w.role}</span>
                      </div>
                    </td>
                     <td className="px-8 py-4 border-r border-border font-bold text-[13px] text-primary/80">
                       {w.level || '—'}
                     </td>
                     <td className="px-8 py-4 border-r border-border text-secondary font-bold text-[13px] tabular-nums opacity-90">
                       {w.joinedDate ? formatDate(w.joinedDate) : '—'}
                     </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(w)} className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95"><Edit2 size={16} /></button>
                        {canManage && <button onClick={() => handleDelete(w.id)} className="p-2.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all active:scale-95"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((w) => (
                  <div key={w.id} className="group bg-sidebar/30 hover:bg-sidebar/50 border border-white/5 rounded-xl p-5 sm:p-6 space-y-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99] relative overflow-hidden ring-1 ring-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4 sm:gap-5">
                        <button 
                          onClick={() => { if (w.avatar) { setPreviewData(w); setIsPreviewOpen(true); } }}
                          className={cn(
                            "w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-all ring-2 ring-white/5",
                            w.avatar ? "cursor-zoom-in hover:ring-primary/40 hover:scale-105 active:scale-95" : "grayscale opacity-40 cursor-default"
                          )}
                        >
                          {w.avatar ? (
                            <img src={w.avatar} alt={w.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-bold text-lg sm:text-xl">{w.name?.split(' ').map(n => n[0]).join('')}</span>
                          )}
                        </button>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] text-muted font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-tighter">{w.employeeID || 'AE-PENDING'}</span>
                              {w.level && <span className="text-[9px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20 tracking-tighter">{w.level}</span>}
                          </div>
                          <p className="text-white font-bold text-base sm:text-lg tracking-tight leading-tight line-clamp-1">{w.name}</p>
                          <div className="flex items-center gap-2 drop-shadow-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary" />
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">{w.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => openEdit(w)} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-muted hover:text-white bg-white/5 rounded-xl transition-all active:scale-90 border border-white/5"><Edit2 size={16} /></button>
                        {canManage && <button onClick={() => handleDelete(w.id)} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-muted hover:text-red-500 bg-red-500/5 rounded-xl transition-all active:scale-90 border border-white/5"><Trash2 size={16} /></button>}
                      </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-xl p-4 sm:p-5 group-hover:border-primary/20 transition-all duration-500 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] text-muted font-bold opacity-50 uppercase tracking-widest leading-none">Joined On</p>
                        <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base tracking-tighter tabular-nums drop-shadow-2xl">
                          <Calendar size={14} className="text-primary/60" />
                          <span>{w.joinedDate ? formatDate(w.joinedDate) : 'Not Registered'}</span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                         <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center bg-white/[0.02]">
                            <Briefcase size={12} className="text-muted opacity-20" />
                         </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-24 h-24 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 shadow-2xl group transition-all">
                    <Users size={40} className="text-muted opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" />
                  </div>
                  <h3 className="text-white font-bold text-xl tracking-tighter">No employees identified</h3>
                  <p className="text-[13px] text-muted font-bold mt-3 opacity-50 max-w-[260px] leading-relaxed">Register a new employee profile to initiate personnel management.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        title={`${previewData?.name || 'Photo'} • Profile View`}
        size="md"
      >
        <div className="flex flex-col items-center p-4">
          <div className="w-full aspect-square rounded-xl bg-sidebar border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl ring-1 ring-white/5 relative group">
            {previewData?.avatar ? (
              <img src={previewData.avatar} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            ) : (
              <div className="text-primary/20 opacity-10">No Image Available</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
               <p className="text-white font-bold text-2xl tracking-tighter">{previewData?.name}</p>
               <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">{previewData?.role}</p>
            </div>
          </div>
          <div className="w-full mt-6 space-y-4">
             <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-muted font-bold  tracking-widest">Employee ID</span>
                <span className="text-xs text-white font-bold bg-white/5 px-3 py-1 rounded-lg">{previewData?.employeeID || 'AE-GEN-001'}</span>
             </div>
             <button 
                className="w-full h-14 bg-white text-black font-bold text-xs rounded-xl hover:bg-primary hover:text-black transition-all active:scale-95 shadow-xl"
                onClick={() => setIsPreviewOpen(false)}
             >
               Close View
             </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedWorker ? `Update ${ROLE} Profile` : `Register New ${ROLE}`} size="md">
        <div className="space-y-6 my-6 px-1">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
              <div className="w-32 h-32 rounded-full bg-sidebar border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/40 shadow-inner">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted">
                    <span className="text-[10px] font-bold">Upload Photo</span>
                  </div>
                )}
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                <Plus size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField label="Full Name">
              <input
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner"
                type="text"
                placeholder="Name"
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-5">
              <FormField label="Role (Automatic)">
                <div className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white/50 flex items-center shadow-inner pointer-events-none">
                  {ROLE}
                </div>
              </FormField>

              <FormField label="Joined Date">
                <input
                  className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-[11px] font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner"
                  type="date"
                  value={form.joinedDate || ''}
                  onChange={e => setForm({ ...form, joinedDate: e.target.value })}
                />
              </FormField>
            </div>

            <div className="pt-4 pb-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, level: form.level === 'Team Lead' ? '' : 'Team Lead' })}
                className="flex items-center gap-3 transition-all group cursor-pointer w-fit"
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                  form.level === 'Team Lead' 
                    ? "bg-primary border-primary text-black shadow-lg shadow-primary/20" 
                    : "bg-transparent border-white/10 text-transparent group-hover:border-white/30"
                )}>
                  <Check size={16} strokeWidth={4} />
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className={cn(
                    "text-[13px] font-bold transition-colors",
                    form.level === 'Team Lead' ? "text-white" : "text-muted"
                  )}>Position as a Team Lead</span>
                  <p className="text-[10px] text-muted opacity-40 font-medium mt-1">Check to assign leadership authority</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-white/5">
            <button className="flex-1 h-14 rounded-xl text-[12px] font-bold text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setIsModalOpen(false)}>Discard</button>
            <button className="flex-1 h-14 rounded-xl text-[12px] font-bold bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none" onClick={handleSave}>Confirm Registration</button>
          </div>
        </div>
      </Modal>


    </div>
  )
}
