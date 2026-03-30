import { useState, useEffect, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useSearchParams } from 'react-router-dom'
import { Modal, FormField, SearchBar, StatusSelect, EmptyState } from '../components/ui/index'
import { formatDate, cn } from '../lib/utils'
import { Plus, Edit2, Trash2, Calendar, Phone, Target } from 'lucide-react'

const ENQUIRY_STATUSES = ['Enquiries', 'Profile Check', 'Waiting for Response', 'Not Interested', 'Onboard']

const getStatusColor = (status) => {
  switch (status) {
    case 'Enquiries': return 'text-white/60 bg-[#1a1a1a] border-white/10'
    case 'Profile Check': return 'text-blue-400 bg-[#0b213f] border-[#0f2d54]'
    case 'Waiting for Response': return 'text-amber-400 bg-[#352512] border-[#4a3419]'
    case 'Not Interested': return 'text-red-400 bg-[#2d1111] border-[#451a1a]'
    case 'Onboard': return 'text-primary bg-primary/10 border-primary/20'
    default: return 'text-gray-400 bg-[#111] border-white/5'
  }
}

export default function EnquiriesDashboard() {
  const { enquiries, addEnquiry, updateEnquiry, deleteEnquiry } = useData()
  const { isManager, isJeevan, canDelete } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const search = searchParams.get('q') || ''
  const statusFilter = searchParams.get('status') || 'All'

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All' || value === 'All Status') nextParams.delete(key)
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

  const canEdit = isManager || isJeevan

  const filteredData = useMemo(() => {
    return (enquiries || []).filter(e => {
      const matchSearch = !search || e.clientName?.toLowerCase().includes(search.toLowerCase()) || e.phone?.includes(search)
      const matchStatus = statusFilter === 'All' || e.status === statusFilter
      return matchSearch && matchStatus
    }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [enquiries, search, statusFilter])

  const openAdd = () => {
    setEditItem(null)
    setForm({ status: 'Enquiries', date: new Date().toISOString().split('T')[0], clientName: '', phone: '' })
    setShowModal(true)
  }
  const openEdit = (e) => { setEditItem(e); setForm({ ...e }); setShowModal(true) }
  
  const handleSave = () => {
    if (editItem) updateEnquiry(editItem.id, form)
    else addEnquiry(form)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to remove this record?')) deleteEnquiry(id)
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate tracking-tighter">
                Enquiries <span className="text-primary/50">Details</span>
              </h1>
            </div>
            <div className="flex flex-row items-center gap-10">
               <div className="flex flex-col items-center sm:items-end gap-1">
                  <p className="text-[9px] sm:text-[11px] text-muted opacity-60 tracking-widest font-bold leading-none">Live Enquiries</p>
                  <p className="text-2xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums text-primary">
                    {(enquiries?.length || 0).toString().padStart(2, '0')}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        {/* Functional Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-sidebar/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="w-full sm:max-w-xs group transition-all duration-500 focus-within:max-w-md">
            <SearchBar value={search} onChange={val => updateFilters({ q: val })} placeholder="Search Pipeline..." />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <StatusSelect 
                value={statusFilter === 'All' ? 'All Status' : statusFilter} 
                options={['All Status', ...ENQUIRY_STATUSES]} 
                onChange={val => updateFilters({ status: val === 'All Status' ? 'All' : val })}
                isFilter
              />
            </div>
            {canEdit && (
              <button
                onClick={openAdd}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all active:scale-95 shadow-xl ring-1 ring-white/5"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-black group-hover:rotate-90 transition-transform duration-500 shadow-lg shadow-primary/20">
                  <Plus size={18} strokeWidth={3} />
                </div>
                <span className="text-[11px] sm:text-[13px] font-bold text-white opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-tight">Add Enquiry</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {filteredData.length === 0 ? (
            <div className="p-12 sm:p-24"><EmptyState title="No active enquiries" description="The lead pipeline is currently clear." icon={Target} /></div>
          ) : (
            <>
              {!isMobile ? (
                <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
                  <thead className="text-[11px] text-muted bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                    <tr>
                       <th className="w-[150px] px-8 py-4 border-r border-border leading-none">Entry Date</th>
                       <th className="w-[300px] px-8 py-4 border-r border-border leading-none">Client Identification</th>
                       <th className="w-[250px] px-8 py-4 border-r border-border leading-none">Relay Communication</th>
                       <th className="w-[180px] px-8 py-4 border-r border-border text-center leading-none">Status</th>
                       <th className="w-[120px] px-8 py-4 text-right leading-none">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredData.map(e => (
                      <tr key={e.id} className="hover:bg-sidebar transition-all group">
                        <td className="px-8 py-3 border-r border-border">
                           <div className="flex items-center gap-3">
                              <Calendar size={13} className="text-primary/40" />
                              <span className="text-[12px] text-white/50 tabular-nums tracking-tight">
                                 {formatDate(e.date)}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-3 border-r border-border overflow-hidden">
                           <div className="flex flex-col gap-1">
                              <span className="text-white text-[13px] tracking-tight truncate" title={e.clientName}>{e.clientName}</span>
                           </div>
                        </td>
                        <td className="px-8 py-3 border-r border-border">
                           <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center border border-white/5">
                                 <Phone size={12} className="text-muted/40" />
                              </div>
                              <span className="text-white/70 text-[13px] tabular-nums tracking-tight">{e.phone || '—'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-3 border-r border-border text-center">
                           <div className="flex justify-center">
                              <StatusSelect
                                 value={e.status}
                                 options={ENQUIRY_STATUSES}
                                 onChange={(newStatus) => updateEnquiry(e.id, { ...e, status: newStatus })}
                                 getStatusColor={getStatusColor}
                              />
                           </div>
                        </td>
                        <td className="px-8 py-3">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEdit(e)} className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"><Edit2 size={16} /></button>
                              {canDelete && <button onClick={() => handleDelete(e.id)} className="p-2.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"><Trash2 size={16} /></button>}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 grid grid-cols-1 gap-4">
                   {filteredData.map(e => (
                     <div key={e.id} className="group bg-sidebar/30 border border-white/5 rounded-2xl p-6 space-y-5 transition-all duration-500 relative overflow-hidden ring-1 ring-white/5">
                        <div className="flex items-start justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <div className="space-y-1">
                                 <p className="text-white text-sm tracking-tight leading-tight line-clamp-1">{e.clientName}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 tracking-tighter tabular-nums">{formatDate(e.date)}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col gap-2">
                              <button onClick={() => openEdit(e)} className="w-9 h-9 flex items-center justify-center text-muted hover:text-white bg-white/5 rounded-xl transition-all border border-white/5"><Edit2 size={15} /></button>
                              {canDelete && <button onClick={() => handleDelete(e.id)} className="w-9 h-9 flex items-center justify-center text-muted hover:text-red-500 bg-red-500/5 rounded-xl transition-all border border-white/5"><Trash2 size={15} /></button>}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                           <div className="space-y-1.5">
                              <p className="text-[8px] text-muted opacity-40 uppercase tracking-widest leading-none">Communication</p>
                              <div className="flex items-center gap-2 text-white text-[12px] tabular-nums truncate">
                                 <Phone size={12} className="text-primary/40 shrink-0" />
                                 <span>{e.phone || 'N/A'}</span>
                              </div>
                           </div>
                           <div className="space-y-1.5 text-right">
                              <p className="text-[8px] text-muted opacity-40 uppercase tracking-widest leading-none">Status</p>
                              <div className="w-full max-w-[120px] ml-auto">
                                 <StatusSelect
                                    value={e.status}
                                    options={ENQUIRY_STATUSES}
                                    onChange={(newStatus) => updateEnquiry(e.id, { ...e, status: newStatus })}
                                    getStatusColor={getStatusColor}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Refine Intelligence Data' : 'Initialize New Intelligence'} size="md">
        <div className="space-y-6 my-6 px-1">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Entry Date Context">
                 <input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs text-white outline-none focus:border-primary/40 transition-all shadow-inner tabular-nums" type="date" value={form.date || ''} onChange={e => f('date', e.target.value)} />
              </FormField>
              <FormField label="Identity Identification">
                 <input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs text-white outline-none focus:border-primary/40 transition-all shadow-inner" value={form.clientName || ''} onChange={e => f('clientName', e.target.value)} placeholder="Business / Contact name" />
              </FormField>
              <FormField label="Relay Communication">
                 <input className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs text-white outline-none focus:border-primary/40 transition-all shadow-inner tabular-nums" value={form.phone || ''} onChange={e => f('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </FormField>
              <FormField label="Dynamic Classification">
                 <StatusSelect 
                   value={form.status || 'Enquiries'} 
                   options={ENQUIRY_STATUSES} 
                   onChange={val => f('status', val)} 
                   isFilter 
                 />
              </FormField>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-white/5">
              <button className="flex-1 h-14 rounded-xl text-[12px] text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setShowModal(false)}>Discard</button>
              <button className="flex-1 h-14 rounded-xl text-[12px] font-bold bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none" onClick={handleSave}>
                 {editItem ? 'Confirm Refinement' : 'Confirm Registration'}
              </button>
           </div>
        </div>
      </Modal>
    </div>
  )
}
