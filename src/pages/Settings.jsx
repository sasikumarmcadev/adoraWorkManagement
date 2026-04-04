import { useState, useEffect, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { FormField, StatusSelect, CustomSelect } from '../components/ui/index'
import { cn } from '../lib/utils'
import { Plus, User, Lock, Trash2, Key, Users, Settings as SettingsIcon, Search, Shield, Filter, Eye, EyeOff, CheckCircle2, Ban, Layout } from 'lucide-react'

const ACCESS_ROLES = ['Admin', 'Manager', 'Editor', 'Content Specialist', 'Video Grapher', 'Meta Ads', 'Software Developer']

export default function Settings() {
  const { workers, addWorker, deleteWorker } = useData()
  const { isManager, isJeevan } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showPassword, setShowPassword] = useState({})
  const [form, setForm] = useState({})
  const [passForm, setPassForm] = useState({})

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const togglePass = (fld) => setShowPassword(prev => ({ ...prev, [fld]: !prev[fld] }))

  const allAccounts = useMemo(() => [
    { id: 'u1', name: 'Admin', username: 'admin@adora.com', role: 'Admin', status: 'Active', created: 'Jan 17, 2026', avatar: 'AD', employeeID: 'ADMAD001' },
    { id: 'u2', name: 'Sasi Kumar', username: 'sasikumar.mca@gmail.com', role: 'Admin', status: 'Active', created: 'Feb 02, 2026', avatar: 'SK', employeeID: 'ADMAD002' },
    ...(workers || []).map(w => ({
      id: w.id,
      name: w.name,
      username: w.username || `${w.name.toLowerCase().replace(' ', '')}@adora.com`,
      role: w.role || w.access || 'Worker',
      status: 'Active',
      created: 'Mar 28, 2026',
      avatar: w.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      isWorker: true,
      employeeID: w.employeeID
    })),
  ], [workers])

  const filteredAccounts = allAccounts.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.employeeID?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    if (!form.username || !form.role || !form.password) return
    
    // Determine if it's a professional worker role or an administrative role
    const workerRoles = ['Editor', 'Content Specialist', 'Video Grapher', 'Meta Ads', 'Software Developer']
    const isWorkerRole = workerRoles.includes(form.role)
    
    addWorker({
      name: form.username.split('@')[0],
      username: form.username,
      password: form.password,
      role: isWorkerRole ? form.role : form.role,
      access: isWorkerRole ? 'Worker' : form.role
    })
    setForm({})
  }

  const canEditSettings = isManager || isJeevan

  if (!canEditSettings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-2xl">
          <Shield size={40} className="text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-white tracking-tighter">Access Restricted</h2>
          <p className="text-sm text-muted opacity-60 max-w-[300px] leading-relaxed">
            Only Administrative Personnel can access system configuration.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-3xl font-medium tracking-tight">Settings</h1>
          <p className="text-sm text-muted opacity-60">Manage your system configuration, user accounts, and system preferences</p>
        </header>

        <div className="space-y-12">
          {/* Change Password Section */}
          <section className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden p-8 space-y-8 relative">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-base font-medium text-white">Change Your Password</h2>
                <p className="text-[11px] text-muted opacity-60">Update your login password for enhanced security</p>
              </div>
              <Lock size={18} className="text-primary/40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PassInput label="Current Password" value={passForm.current} onChange={v => setPassForm(p => ({...p, current: v}))} />
              <PassInput label="New Password" value={passForm.new} onChange={v => setPassForm(p => ({...p, new: v}))} />
              <PassInput label="Confirm Password" value={passForm.confirm} onChange={v => setPassForm(p => ({...p, confirm: v}))} />
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4">
              <p className="text-[10px] font-medium text-muted mb-2 tracking-widest opacity-40">Password Requirements:</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div className="flex items-center gap-2 text-[10px] text-muted/60"><div className="w-1 h-1 rounded-full bg-white/20" /> At least 8 characters</div>
                <div className="flex items-center gap-2 text-[10px] text-muted/60"><div className="w-1 h-1 rounded-full bg-white/20" /> Passwords must match</div>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary/20 border border-primary/20 text-primary rounded-xl text-xs font-medium hover:bg-primary hover:text-black transition-all">
              <Lock size={14} />
              Change Password
            </button>
          </section>

          {/* Add New Account Section */}
          <section className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-base font-medium text-white">Add New Account</h2>
                <p className="text-[11px] text-muted opacity-60">Create new user accounts with specific roles and permissions</p>
              </div>
              <User size={18} className="text-primary/40" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <InlineInput label="Username" placeholder="Enter username" icon={User} value={form.username} onChange={v => f('username', v)} />
              <InlineInput label="Email Address" placeholder="Enter email address" icon={Search} value={form.email} onChange={v => f('email', v)} />
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-muted ml-0.5">Role</p>
                <div className="relative">
                  <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" />
                  <select 
                    className="w-full h-11 bg-black rounded-xl border border-white/10 pl-11 pr-4 text-xs font-medium text-white outline-none focus:border-primary/40 transition-all appearance-none"
                    value={form.role || ''}
                    onChange={e => f('role', e.target.value)}
                  >
                    <option value="" disabled>Select Role</option>
                    {ACCESS_ROLES.map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
                  </select>
                </div>
              </div>
              <PassInput label="Password" value={form.password} onChange={v => f('password', v)} isInverse />
            </div>

            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 px-8 py-2.5 bg-white/5 border border-white/10 text-muted hover:text-white hover:bg-white/10 rounded-xl text-xs font-medium transition-all"
            >
              <Plus size={14} />
              Add Account
            </button>
          </section>

          {/* Account Management Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <header className="space-y-1">
                 <h2 className="text-lg font-medium">Account Management</h2>
                 <p className="text-xs text-muted opacity-40">{filteredAccounts.length} of {allAccounts.length} account(s)</p>
              </header>
              <div className="flex items-center gap-3">
                 <div className="relative items-center flex">
                    <Search className="absolute left-4 text-muted/40" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search accounts..." 
                      className="h-10 w-full sm:w-64 bg-black border border-white/10 rounded-xl pl-12 pr-4 text-xs font-medium outline-none focus:border-primary/40"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <button className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-white/10 transition-all">
                    <span>All Accounts</span>
                    <Filter size={14} className="text-muted/40" />
                 </button>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="text-[10px] font-medium text-muted tracking-widest border-b border-white/5">
                      <tr>
                        <th className="px-8 py-4">User</th>
                        <th className="px-8 py-4">ID</th>
                        <th className="px-8 py-4">Role</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Created</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredAccounts.map(acc => (
                        <tr key={acc.id} className="hover:bg-white/[0.01] transition-colors group">
                           <td className="px-8 py-5">
                             <div className="flex items-center gap-4">
                               <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-medium text-white group-hover:border-primary/40 transition-all">
                                 {acc.avatar}
                               </div>
                               <div className="space-y-0.5">
                                 <p className="text-sm font-medium text-white tracking-tight leading-none">{acc.name}</p>
                                 <p className="text-[10px] text-muted opacity-60 leading-none mt-1">{acc.username}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-8 py-5">
                             <span className="text-[10px] font-medium text-muted/60 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5  tracking-tighter">
                               {acc.employeeID || 'N/A'}
                             </span>
                           </td>
                           <td className="px-8 py-5">
                             <span className={cn(
                               "text-[9px] font-medium px-2 py-0.5 rounded-lg border tracking-widest",
                               acc.role === 'Admin' ? "bg-primary/10 text-primary border-primary/20" :
                               acc.role === 'Manager' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                               "bg-white/5 text-muted/60 border-white/10"
                             )}>
                               {acc.role}
                             </span>
                           </td>
                           <td className="px-8 py-5">
                             <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                               <CheckCircle2 size={12} />
                               <span>{acc.status}</span>
                             </div>
                           </td>
                           <td className="px-8 py-5 text-xs text-muted font-medium">{acc.created}</td>
                           <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-5">
                                <button className="flex items-center gap-1.5 text-[10px] font-medium text-primary hover:opacity-80 transition-all">
                                   <Ban size={12} />
                                   Block
                                </button>
                                {acc.isWorker && (
                                  <button onClick={() => deleteWorker(acc.id)} className="flex items-center gap-1.5 text-[10px] font-medium text-red-400 hover:opacity-80 transition-all">
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                )}
                             </div>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
               <div className="px-8 py-4 border-t border-white/5 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[9px] font-medium text-muted/40 tracking-widest">
                    <Shield size={10} />
                    Blocked accounts cannot log in to the system
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function PassInput({ label, value, onChange, isInverse }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-medium text-muted ml-0.5">{label}</p>
      <div className="relative">
        <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" />
        <input 
          type={show ? 'text' : 'password'}
          className={cn(
            "w-full h-11 rounded-xl border border-white/10 pl-11 pr-12 text-xs font-medium text-white outline-none focus:border-primary/40 transition-all",
            isInverse ? "bg-black" : "bg-white/5"
          )}
          placeholder="••••••••"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
        <button 
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/20 hover:text-muted transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}

function InlineInput({ label, placeholder, icon: Icon, value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-medium text-muted ml-0.5">{label}</p>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40" />
        <input 
          type="text"
          className="w-full h-11 bg-black rounded-xl border border-white/10 pl-11 pr-4 text-xs font-medium text-white outline-none focus:border-primary/40 transition-all"
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}



