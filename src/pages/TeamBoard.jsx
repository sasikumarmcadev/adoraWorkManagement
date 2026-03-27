import { useState, useRef } from 'react'
import { useData } from '../context/DataContext'
import { formatDate } from '../lib/utils'
import { Plus, Target, FileText, Eye, Edit2, Trash2 } from 'lucide-react'
import { Modal, FormField, SearchBar, PageHeader, EmptyState, StatusSelect, CustomSelect } from '../components/ui/index'

const ROLE_TABS = [
  { key: 'content-specialist', label: 'Content Specialist' },
  { key: 'editor', label: 'Editor' },
  { key: 'video-grapher', label: 'Video Grapher' },
  { key: 'meta-ads', label: 'Meta Ads' },
]

const STATUSES = ['In Progress', 'Done', 'Not Started', 'Declined']

// --- COMPONENTS FROM EDITOR PAGE (Genericized) ---
function WorkerIncentive({ role }) {
  return (
    <div className="h-full flex flex-col gap-4 p-5 bg-panel">
      <div className="flex items-center gap-2">
        <Target size={18} className="text-emerald-400" />
        <h3 className="font-semibold text-lg">{role} Incentive</h3>
      </div>
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-4">
        <h4 className="text-emerald-400 font-medium mb-1">Monthly Target</h4>
        <p className="text-emerald-300 text-sm font-semibold">Achieved = +1000 Bonus</p>
      </div>
      <div className="bg-surface-800/30 p-4 rounded-md border border-border flex-1">
        <p className="text-xs text-muted uppercase tracking-widest mb-3 font-semibold">Notes</p>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border" /> Quality First</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border" /> Meet Deadlines</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border" /> High Performance</li>
        </ul>
      </div>
    </div>
  )
}

// --- NEW TEAM BOARD ENTRY ---
export default function TeamBoard({ forcedTab = 'content-specialist' }) {
  const { tasks, addTask, updateTask, deleteTask, clients, workers } = useData()
  const [selectedWorker, setSelectedWorker] = useState(null)
  const activeTab = forcedTab
  const roleLabel = ROLE_TABS.find(t => t.key === activeTab)?.label || ''

  // Filter workers for THIS specific role
  const roleWorkers = workers.filter(w => w.role === roleLabel)

// If worker selected, show the interactive view
  if (selectedWorker) {
    const workerTasks = tasks.filter(t => t.workerName === selectedWorker)
    
    return (
      <div className="w-full h-full flex flex-col bg-background relative overflow-hidden">
        {/* NAV BAR */}
        <div className="flex-none bg-sidebar border-b border-border px-6 py-2 flex items-center justify-between">
          <button onClick={() => setSelectedWorker(null)} className="flex items-center gap-2 text-muted hover:text-white transition-colors text-xs font-bold">
            <Plus size={14} className="rotate-45" /> Back to Team
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted font-bold">Member:</span>
            <span className="text-xs font-bold text-primary">{selectedWorker}</span>
          </div>
        </div>

        {/* This effectively mimics the EditorPage but within the TeamBoard context */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 border-b border-border">
              <div className="lg:col-span-1 border-r border-border min-h-[400px]">
                <WorkerIncentive role={roleLabel} />
              </div>
              <div className="lg:col-span-3">
                <TaskTable tasks={workerTasks} isEditor={activeTab === 'editor'} isVideoGrapher={activeTab === 'video-grapher'} canEdit={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // LIST VIEW
  return (
    <div className="w-full flex flex-col overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{roleLabel} Management</h1>
            <p className="text-muted text-sm mt-1">Select a member to view their personal performance dashboard</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-md">
            <span className="text-primary font-bold">{roleWorkers.length}</span>
            <span className="text-muted text-xs ml-2 font-semibold">Active Members</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleWorkers.map(w => {
            const workerTasks = tasks.filter(t => t.workerName === w.name)
            const doneCount = workerTasks.filter(t => t.status === 'Done').length
            
            return (
              <button
                key={`worker-${w.id || w.name}`}
                onClick={() => setSelectedWorker(w.name)}
                className="group flex flex-col p-6 bg-panel border border-border hover:border-primary/50 transition-all text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-surface-800 border border-border flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
                    {w.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{w.name}</h3>
                    <p className="text-xs text-muted font-medium">{w.role}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111] p-3 rounded border border-white/5">
                    <p className="text-[10px] text-muted uppercase font-bold mb-1">Assigned</p>
                    <p className="text-xl font-bold text-white">{workerTasks.length}</p>
                  </div>
                  <div className="bg-[#111] p-3 rounded border border-white/5">
                    <p className="text-[10px] text-muted uppercase font-bold mb-1">Done</p>
                    <p className="text-xl font-bold text-emerald-400">{doneCount}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function EditorCoverSection() {
  const [coverImg, setCoverImg] = useState(null)
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) setCoverImg(URL.createObjectURL(file))
  }
  return (
    <div className="card overflow-hidden p-0">
      <div className="relative h-32 md:h-44 overflow-hidden rounded-t-2xl"
        style={{ background: coverImg ? undefined : 'linear-gradient(135deg, #312e81, #4f46e5, #6366f1)' }}>
        {coverImg && <img src={coverImg} alt="Cover" className="w-full h-full object-cover" />}
        <label className="absolute bottom-3 right-3 btn-secondary text-xs cursor-pointer bg-white/90 dark:bg-surface-900/90 border-none">
          📷 Change Cover
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!coverImg && <span className="text-white/60 text-sm">Editor Team Cover</span>}
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Editor Department</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>All video & reel editing tasks</p>
        </div>
        <div className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">
          Active
        </div>
      </div>
    </div>
  )
}

function TaskTable({ tasks, isEditor, isVideoGrapher, onView, onEdit, onDelete, onUpdateTask, canEdit }) {
  if (!tasks.length) return <EmptyState title="No tasks found" description="Add a task or clear your filters." icon={FileText} />

  const cols = [
    'Client', 'Task', 'Worker', 'Status', 'Count',
    ...(isEditor || isVideoGrapher ? ['Edit Date', 'Complete'] : ['Decline Date']),
    'Approval', 'Actions'
  ]

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              {cols.map(c => (
                <th key={c} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr
                key={t.id}
                className="table-row-hover border-b last:border-0"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
              >
                <td className="px-4 py-3.5 font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{t.clientName}</td>
                <td className="px-4 py-3.5 max-w-[180px]">
                  <p className="truncate text-sm" style={{ color: 'var(--text-secondary)' }}>{t.task}</p>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{t.workerName}</td>
                <td className="px-4 py-3.5">
                  <StatusSelect 
                    value={t.status} 
                    options={['Not Started', 'In Progress', 'Done', 'Declined']}
                    onChange={val => onUpdateTask(t.id, { status: val })}
                    getStatusColor={s => {
                      switch(s) {
                        case 'Done': return 'text-emerald-400 bg-[#062016] border-[#0a3622]'
                        case 'In Progress': return 'text-amber-400 bg-[#352512] border-[#4a3419]'
                        case 'Declined': return 'text-red-400 bg-[#2d1111] border-[#451a1a]'
                        default: return 'text-white/60 bg-[#1a1a1a] border-white/10'
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-3.5 text-center" style={{ color: 'var(--text-muted)' }}>{t.taskCount}</td>
                {(isEditor || isVideoGrapher) ? (
                  <>
                    <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{formatDate(t.editDate)}</td>
                    <td className="px-4 py-3.5">
                      <span className={t.completeStatus ? 'text-emerald-500 text-lg' : 'text-surface-400 text-lg'}>
                        {t.completeStatus ? '✓' : '○'}
                      </span>
                    </td>
                  </>
                ) : (
                  <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{formatDate(t.declineDate)}</td>
                )}
                <td className="px-4 py-3.5">
                  <StatusSelect 
                    value={t.clientApproval} 
                    options={['Approved', 'Changes Needed']}
                    onChange={val => onUpdateTask(t.id, { clientApproval: val })}
                    getStatusColor={s => s === 'Approved' ? 'text-emerald-400 bg-[#062016] border-[#0a3622]' : 'text-amber-400 bg-[#352512] border-[#4a3419]'}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView(t)} className="btn-ghost p-1.5" title="View"><Eye size={14} /></button>
                    {canEdit && <button onClick={() => onEdit(t)} className="btn-ghost p-1.5" title="Edit"><Edit2 size={14} /></button>}
                    {onDelete && <button onClick={() => onDelete(t.id)} className="btn-ghost p-1.5 hover:text-red-400" title="Delete"><Trash2 size={14} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TaskForm({ form, setForm, clients, workers, roleLabel }) {
  const roleWorkers = workers.filter(w => w.role === roleLabel)
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Client">
        <CustomSelect 
          value={form.clientId || ''} 
          options={[{ label: 'Select client', value: '' }, ...clients.map(c => ({ label: c.name, value: c.id }))]}
          onChange={val => f('clientId', val)}
          isFilter
        />
      </FormField>
      <FormField label="Worker">
        <CustomSelect 
          value={form.workerId || ''} 
          options={[{ label: 'Select worker', value: '' }, ...roleWorkers.map(w => ({ label: w.name, value: w.id }))]}
          onChange={val => f('workerId', val)}
          isFilter
        />
      </FormField>
      <FormField label="Task Name">
        <input className="input" value={form.task || ''} onChange={e => f('task', e.target.value)} placeholder="Task description" />
      </FormField>
      <FormField label="Status">
        <StatusSelect 
          value={form.status || 'Not Started'} 
          options={['Not Started', 'In Progress', 'Done', 'Declined']} 
          onChange={val => f('status', val)}
          isFilter
        />
      </FormField>
      <FormField label="Decline / Deadline Date">
        <input className="input" type="date" value={form.declineDate || ''} onChange={e => f('declineDate', e.target.value)} />
      </FormField>
      <FormField label="Schedule Date">
        <input className="input" type="date" value={form.scheduleDate || ''} onChange={e => f('scheduleDate', e.target.value)} />
      </FormField>
      <FormField label="Client Approval">
        <StatusSelect 
          value={form.clientApproval || 'Approved'} 
          options={['Approved', 'Changes Needed']} 
          onChange={val => f('clientApproval', val)}
          isFilter
        />
      </FormField>
      <FormField label="Task Count">
        <input className="input" type="number" value={form.taskCount || 0} onChange={e => f('taskCount', parseInt(e.target.value))} />
      </FormField>
    </div>
  )
}

function TaskDetail({ task }) {
  const fields = [
    ['Client', task.clientName], ['Task', task.task], ['Worker', task.workerName],
    ['Role', task.workerRole], ['Status', task.status], ['Approval', task.clientApproval],
    ['Taken Date', formatDate(task.takenDate)], ['Decline Date', formatDate(task.declineDate)],
    ['Schedule Date', formatDate(task.scheduleDate)], ['Updated Date', formatDate(task.updatedDate)],
    ['Task Count', task.taskCount], ['Complete', task.completeStatus ? 'Yes' : 'No'],
  ]
  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map(([label, value]) => (
        <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value || '—'}</p>
        </div>
      ))}
    </div>
  )
}
