import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { Modal, FormField, StatusSelect, CustomSelect } from '../components/ui/index'
import { cn } from '../lib/utils'
import { Plus, User, Lock, Shield, Trash2, Key, Users, Settings as SettingsIcon } from 'lucide-react'

const ACCESS_ROLES = ['Manager', 'Jeevan', 'Worker']
const WORKER_ROLES = ['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads']

export default function Settings() {
  const { workers, addWorker, deleteWorker } = useData()
  const { isManager, isJeevan } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)
  const [form, setForm] = useState({})
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const allAccounts = [
    { id: 'u1', name: 'Adora Manager', role: 'Manager', username: 'manager', access: 'Manager', avatar: 'AM' },
    { id: 'u2', name: 'Jeevan', role: 'Jeevan', username: 'jeevan', access: 'Jeevan', avatar: 'JV' },
    ...(workers || []),
  ]

  const handleCreate = () => {
    if (!form.name || !form.username || !form.password) return
    addWorker({
      name: form.name,
      role: form.workerRole || 'Content Specialist',
      username: form.username,
      password: form.password,
      access: form.access || 'Worker',
      avatar: form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    })
    setShowModal(false)
    setForm({})
  }

  const canEditSettings = isManager || isJeevan;

  if (!canEditSettings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-2xl">
           <Shield size={40} className="text-red-400" />
        </div>
        <div className="space-y-2">
           <h2 className="text-2xl font-bold text-white tracking-tighter">Access Restricted</h2>
           <p className="text-sm text-muted font-bold opacity-60 max-w-[300px] leading-relaxed">
             Only Administrative Personnel (Managers & Jeevan) can access system configuration.
           </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tighter truncate">
                System <span className="text-primary/50">Settings</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-bold mt-1 opacity-60 leading-none">
                Access Infrastructure • Permission Audit Protocols
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-bold opacity-60 tracking-widest uppercase">Verified Accounts</p>
              <p className="text-2xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums">
                {allAccounts.length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        <div className="p-4 sm:p-8 space-y-12 max-w-[1400px] mx-auto w-full">
          
          {/* Permission Architecture */}
          <section className="space-y-6">
             <div className="flex items-center gap-3">
                <Key size={18} className="text-primary/50" />
                <h2 className="text-sm font-bold text-white tracking-[0.2em] uppercase opacity-40">Permission Architecture</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <AccessCard role="Manager" detail="Full system oversight. Critical CRUD operations enabled. Financial audit visibility." color="primary" icon="👑" />
                <AccessCard role="Jeevan" detail="Administrative oversight. Registry modification enabled. Deletion protocols restricted." color="blue" icon="🔑" />
                <AccessCard role="Worker" detail="Siloed operational access. Role-specific dashboard visibility. Limited audit trails." color="green" icon="👷" />
             </div>
          </section>

          {/* User Directory */}
          <section className="space-y-6">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <Users size={18} className="text-primary/50" />
                   <h2 className="text-sm font-bold text-white tracking-[0.2em] uppercase opacity-40">User Account Directory</h2>
                </div>
                <button 
                  onClick={() => { setForm({}); setShowModal(true) }}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white text-black font-bold text-[12px] rounded-full hover:bg-primary transition-all active:scale-95 shadow-2xl shadow-primary/20"
                >
                   <Plus size={16} strokeWidth={3} />
                   <span>Initialize New Account</span>
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {allAccounts.map(acc => (
                  <div key={acc.id} className="group bg-sidebar/30 border border-white/5 rounded-3xl p-6 transition-all hover:bg-sidebar/50 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98] relative overflow-hidden ring-1 ring-white/5">
                     <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                           <div className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-2xl border border-white/5 transition-transform group-hover:scale-110",
                             acc.access === 'Manager' ? "bg-primary text-black" :
                             acc.access === 'Jeevan' ? "bg-blue-500 text-white" :
                             "bg-white/5 text-muted"
                           )}>
                              {acc.avatar}
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-white tracking-tight leading-none truncate max-w-[150px]">{acc.name}</p>
                              <p className="text-[10px] text-muted font-bold opacity-40 uppercase tracking-widest leading-none mt-1">@{acc.username}</p>
                           </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest",
                          acc.access === 'Manager' ? "bg-primary/10 text-primary border-primary/20" :
                          acc.access === 'Jeevan' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-white/5 text-muted/60 border-white/10"
                        )}>
                          {acc.access}
                        </span>
                     </div>
                     
                     <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                           <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest">{acc.role}</span>
                        </div>
                        {acc.access === 'Worker' && (
                          <button 
                            onClick={() => deleteWorker(acc.id)}
                            className="p-2 text-muted/20 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all active:scale-90"
                          >
                             <Trash2 size={16} />
                          </button>
                        )}
                     </div>
                     
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  </div>
                ))}
             </div>
          </section>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Initialize New Account" size="md">
        <div className="space-y-6 my-6 px-1">
           <FormField label="Full Name Identity">
              <input 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                value={form.name || ''} 
                onChange={e => f('name', e.target.value)} 
                placeholder="Ex: Riya Kumar" 
              />
           </FormField>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="System Alias">
                <input 
                  className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                  value={form.username || ''} 
                  onChange={e => f('username', e.target.value)} 
                  placeholder="Ex: riya_hq" 
                />
              </FormField>
              <FormField label="Access Key">
                <input 
                  className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                  type="password" 
                  value={form.password || ''} 
                  onChange={e => f('password', e.target.value)} 
                  placeholder="••••••••" 
                />
              </FormField>
           </div>

           <FormField label="Authorization Tier">
              <StatusSelect 
                value={form.access || 'Worker'} 
                options={ACCESS_ROLES} 
                onChange={val => f('access', val)}
                isFilter
              />
           </FormField>

           {(form.access === 'Worker' || !form.access) && (
              <FormField label="Operational Designation">
                <CustomSelect 
                  value={form.workerRole || 'Content Specialist'} 
                  options={WORKER_ROLES} 
                  onChange={val => f('workerRole', val)}
                  isFilter
                />
              </FormField>
           )}

           <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-white/5">
              <button 
                className="flex-1 h-14 rounded-xl text-[12px] font-bold text-muted hover:text-white hover:bg-white/5 transition-all outline-none" 
                onClick={() => setShowModal(false)}
              >
                Discard
              </button>
              <button 
                className="flex-1 h-14 rounded-xl text-[12px] font-bold bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none" 
                onClick={handleCreate}
              >
                Confirm Account Activation
              </button>
           </div>
        </div>
      </Modal>
    </div>
  )
}

function AccessCard({ role, detail, color, icon }) {
   const variants = {
     primary: "border-primary/20 bg-primary/5 text-primary",
     blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
     green: "border-green-500/20 bg-green-500/5 text-green-400"
   }
   return (
     <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
           <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
           <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest", variants[color])}>
             {role} Tier
           </span>
        </div>
        <div className="space-y-1">
           <p className="text-sm font-bold text-white tracking-tight">{role} Protocol</p>
           <p className="text-[11px] text-muted font-bold leading-relaxed opacity-40">{detail}</p>
        </div>
     </div>
   )
}
