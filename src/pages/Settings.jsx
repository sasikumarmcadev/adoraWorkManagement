import { useState, useEffect, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { FormField, StatusSelect, CustomSelect } from '../components/ui/index'
import { cn } from '../lib/utils'
import { Plus, User, Lock, Trash2, Key, Users, Settings as SettingsIcon, Search, Shield, Filter, Eye, EyeOff, CheckCircle2, Ban, Layout, Sparkles, Gift, Edit2, Target } from 'lucide-react'
import { Modal } from '../components/ui/index'

const ACCESS_ROLES = ['Admin', 'Manager', 'Editor', 'Content Specialist', 'Video Grapher', 'Meta Ads', 'Software Developer']

export default function Settings() {
  const { workers, addWorker, deleteWorker, incentiveProtocols, addIncentiveProtocol, updateIncentiveProtocol, deleteIncentiveProtocol, evaluationCriteria, updateEvaluationCriteria } = useData()
  const { isManager, isJeevan } = useAuth()
  const [activeTab, setActiveTab] = useState('accounts')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPassword, setShowPassword] = useState({})
  const [form, setForm] = useState({})
  const [passForm, setPassForm] = useState({})

  // Incentive specific state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [editingProtocol, setEditingProtocol] = useState(null);

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
    const workerRoles = ['Editor', 'Content Specialist', 'Video Grapher', 'Meta Ads', 'Software Developer']
    const isWorkerRole = workerRoles.includes(form.role)
    addWorker({
      name: form.username.split('@')[0],
      username: form.username,
      password: form.password,
      role: form.role,
      access: isWorkerRole ? 'Worker' : form.role
    })
    setForm({})
  }

  const handleSaveIncentive = (data) => {
    if (editingProtocol) {
      updateIncentiveProtocol(editingProtocol.id, data);
    } else {
      addIncentiveProtocol(data);
    }
    setIsAddModalOpen(false);
    setEditingProtocol(null);
  };

  const openIncentiveEdit = (protocol) => {
    setEditingProtocol(protocol);
    setIsAddModalOpen(true);
  };

  const handleIncentiveDelete = (id) => {
    if (window.confirm('Decommission this incentive protocol? This action is irreversible.')) {
      deleteIncentiveProtocol(id);
    }
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
          {/* TAB SWITCHER */}
          <div className="flex p-1 bg-[#0f0f0f] border border-white/5 rounded-2xl max-w-lg overflow-x-auto no-scrollbar">
            {[
              { id: 'accounts', label: 'Accounts', icon: Users },
              { id: 'incentives', label: 'Incentives', icon: Sparkles },
              { id: 'evaluation', label: 'Evaluation Criteria', icon: Target }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-primary text-black shadow-lg shadow-primary/20" 
                    : "text-muted hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'accounts' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Change Password Section */}
              <section className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden p-8 space-y-8 relative shadow-2xl">
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

                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary/20 border border-primary/20 text-primary rounded-xl text-xs font-medium hover:bg-primary hover:text-black transition-all">
                  <Lock size={14} />
                  Change Password
                </button>
              </section>

              {/* Add New Account Section */}
              <section className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden p-8 space-y-8 shadow-2xl">
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
                  </div>
                </div>

                <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
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
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden p-8 space-y-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-base font-medium text-white tracking-tight">Operational Architecture Registry</h2>
                    <p className="text-[11px] text-muted opacity-60">Manage tiered reward structures and motivational hooks</p>
                  </div>
                  <button
                    onClick={() => { setEditingProtocol(null); setIsAddModalOpen(true); }}
                    className="group flex items-center justify-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                      <Plus size={18} />
                    </div>
                    <span className="text-[12px] font-medium text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Protocol</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                  {(!incentiveProtocols || incentiveProtocols.length === 0) ? (
                    <div className="col-span-full py-20 bg-black/20 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center text-center">
                       <Gift size={40} className="text-muted/20 mb-4" />
                       <h3 className="text-white text-sm font-medium">No Protocols Defined</h3>
                       <p className="text-[11px] text-muted max-w-[200px] mt-1">Engineer your first incentive structure to empower your workforce.</p>
                    </div>
                  ) : (
                    incentiveProtocols.map((ip) => (
                      <div
                        key={ip.id}
                        onClick={() => setSelectedProtocol(ip)}
                        className="group relative bg-black/40 border border-white/10 p-6 rounded-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-2xl"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-sm font-medium text-white tracking-tight truncate pr-16">{ip.roleName}</h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-4 right-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); openIncentiveEdit(ip); }}
                              className="p-1.5 text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleIncentiveDelete(ip.id); }}
                              className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-muted text-[11px] leading-relaxed mb-6 line-clamp-3 opacity-60">
                          {ip.description}
                        </p>
                        <div className="mt-auto pt-4 flex items-center text-white text-[10px] opacity-40 group-hover:opacity-100 transition-opacity gap-2">
                          View Details <span className="text-primary">→</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="px-1 border-l-2 border-primary mb-2">
                <h3 className="text-sm font-medium tracking-tight text-white uppercase italic">Role-Specific Metrics</h3>
                <p className="text-[10px] text-muted opacity-40 mt-1">Configure performance evaluation criteria for each organizational role</p>
              </header>

              {Object.keys(evaluationCriteria).map(role => (
                <section key={role} className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden p-6 sm:p-8 space-y-6 shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                    <Target size={120} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-base font-medium text-white tracking-tight">{role}</h2>
                      <p className="text-[10px] text-muted opacity-60">Manage tiered performance indicators</p>
                    </div>
                    <button 
                      onClick={() => {
                        const newCriteria = [...evaluationCriteria[role], { id: `c${Date.now()}`, label: 'New Indicator', sub: 'Measurement unit', max: 25 }]
                        updateEvaluationCriteria(role, newCriteria)
                      }}
                      className="group flex items-center justify-center gap-1.5 px-4 h-9 bg-white/5 border border-white/10 text-[10px] font-medium text-muted hover:text-white rounded-lg transition-all"
                    >
                      <Plus size={12} className="group-hover:scale-125 transition-transform" />
                      Add Criterion
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {evaluationCriteria[role].map((c, idx) => (
                      <div key={c.id || idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-black/40 border border-white/5 p-4 rounded-xl group relative hover:border-white/10 transition-colors">
                        <div className="sm:col-span-4 space-y-1.5">
                          <p className="text-[8px] font-bold text-muted/40 uppercase tracking-[0.2em] ml-0.5">Title</p>
                          <input 
                            value={c.label} 
                            onChange={e => {
                              const nc = [...evaluationCriteria[role]]
                              nc[idx] = { ...nc[idx], label: e.target.value }
                              updateEvaluationCriteria(role, nc)
                            }}
                            placeholder="e.g. Speed & Productivity"
                            className="w-full bg-black/60 border border-white/5 h-9 px-3 rounded-lg text-xs text-white outline-none focus:border-primary/40 focus:bg-black transition-all"
                          />
                        </div>
                        <div className="sm:col-span-5 space-y-1.5">
                          <p className="text-[8px] font-bold text-muted/40 uppercase tracking-[0.2em] ml-0.5">Metric description</p>
                          <input 
                            value={c.sub} 
                            onChange={e => {
                              const nc = [...evaluationCriteria[role]]
                              nc[idx] = { ...nc[idx], sub: e.target.value }
                              updateEvaluationCriteria(role, nc)
                            }}
                            placeholder="e.g. Reels count / Turnaround"
                            className="w-full bg-black/60 border border-white/5 h-9 px-3 rounded-lg text-xs text-white outline-none focus:border-primary/40 focus:bg-black transition-all"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <p className="text-[8px] font-bold text-muted/40 uppercase tracking-[0.2em] ml-0.5">Allocation</p>
                          <div className="relative">
                            <input 
                              type="number"
                              value={c.max} 
                              onChange={e => {
                                const nc = [...evaluationCriteria[role]]
                                nc[idx] = { ...nc[idx], max: parseInt(e.target.value) || 0 }
                                updateEvaluationCriteria(role, nc)
                              }}
                              className="w-full bg-black/60 border border-white/5 h-9 px-3 rounded-lg text-xs text-primary font-medium outline-none focus:border-primary/40 focus:bg-black transition-all"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted opacity-20 font-bold">PTS</span>
                          </div>
                        </div>
                        <div className="sm:col-span-1 flex justify-end">
                          <button 
                            onClick={() => {
                              const nc = evaluationCriteria[role].filter((_, i) => i !== idx)
                              updateEvaluationCriteria(role, nc)
                            }}
                            className="w-9 h-9 flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <div className="h-0.5 flex-1 bg-white/[0.02]" />
                    <span className={cn(
                      "text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border",
                      evaluationCriteria[role].reduce((sum, c) => sum + (c.max || 0), 0) === 100 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                      Total Allocation: {evaluationCriteria[role].reduce((sum, c) => sum + (c.max || 0), 0)} / 100
                    </span>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AddIncentiveModal logic integrated */}
      <AddIncentiveModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingProtocol(null); }}
        onSave={handleSaveIncentive}
        editData={editingProtocol}
      />

      <DetailViewModal
        data={selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
      />
    </div>
  )
}

function AddIncentiveModal({ isOpen, onClose, onSave, editData }) {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editData) {
      setRoleName(editData.roleName || '');
      setDescription(editData.description || '');
    } else {
      setRoleName('');
      setDescription('');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!roleName.trim() || !description.trim()) return;
    onSave({ roleName, description });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Modify Incentive Protocol' : 'Engineer New Protocol'} size="md">
      <div className="space-y-6 mt-2">
        <div className="space-y-2">
          <p className="text-[10px] font-medium text-muted ml-0.5">Target Department / Role</p>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. Editor, Meta Ads..."
            className="bg-black border border-white/10 h-12 w-full px-5 rounded-xl text-[13px] text-white outline-none focus:border-primary/40 transition-all"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-medium text-muted ml-0.5">Incentive Protocol Details</p>
          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Define tiered reward structure..."
            className="bg-black border border-white/10 w-full p-5 rounded-xl text-[13px] text-white outline-none focus:border-primary/40 transition-all resize-none"
          />
        </div>

        <div className="flex gap-3 pt-6 border-t border-white/5">
          <button className="flex-1 h-12 rounded-xl text-[12px] text-muted hover:text-white hover:bg-white/5 transition-all" onClick={onClose}>Discard</button>
          <button className="flex-1 h-12 rounded-xl text-[12px] font-medium bg-primary text-black transition-all hover:scale-[1.02]" onClick={handleSave}>
            Save Protocol
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DetailViewModal({ data, onClose }) {
  if (!data) return null;
  return (
    <Modal isOpen={!!data} onClose={onClose} title={`${data.roleName} Protocols`} size="lg">
      <div className="space-y-6 py-4">
        <div className="min-h-[30vh] max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          <p className="text-muted leading-relaxed whitespace-pre-wrap text-xs opacity-80">
            {data.description}
          </p>
        </div>
        <div className="flex items-center justify-end border-t border-white/5 pt-6">
          <button onClick={onClose} className="w-full sm:w-auto px-10 h-12 bg-primary text-black rounded-xl text-[12px] font-medium transition-all hover:scale-[1.02]">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
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



