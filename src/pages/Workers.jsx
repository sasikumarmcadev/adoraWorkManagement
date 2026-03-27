import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { PageHeader, TabBar, StatusBadge, EmptyState, Modal, FormField } from '../components/ui/index'
import { formatCurrency, formatDate } from '../lib/utils'
import { Users, TrendingUp, Activity, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TABS = [
  { key: 'workers', label: 'Workers List' },
  { key: 'progress', label: 'Work Progress' },
  { key: 'revenue', label: 'Revenue' },
]

export default function WorkersDashboard() {
  const { workers, tasks, payments, salaries, incentives } = useData()
  const { isManager } = useAuth()
  const [activeTab, setActiveTab] = useState('workers')
  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-6">
      <PageHeader title="Workers Dashboard" subtitle="Track worker performance, progress and revenue" />
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'workers' && (
        <WorkersList workers={workers} tasks={tasks} salaries={salaries} incentives={incentives} onSelect={setSelected} />
      )}
      {activeTab === 'progress' && <WorkProgress workers={workers} tasks={tasks} />}
      {activeTab === 'revenue' && <WorkerRevenue payments={payments} clients={[]} />}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Worker Details" size="lg">
        {selected && <WorkerDetail worker={selected} tasks={tasks} salaries={salaries} incentives={incentives} />}
      </Modal>
    </div>
  )
}

function WorkersList({ workers, tasks, salaries, incentives, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {workers.map(w => {
        const workerTasks = tasks.filter(t => t.workerId === w.id)
        const completed = workerTasks.filter(t => t.status === 'Done').length
        const pending = workerTasks.filter(t => t.status !== 'Done').length
        const salary = salaries.find(s => s.workerId === w.id)
        const incentive = incentives.filter(i => i.workerId === w.id).reduce((sum, i) => sum + i.amount, 0)
        const pct = workerTasks.length ? Math.round((completed / workerTasks.length) * 100) : 0

        return (
          <div
            key={w.id}
            className="card-hover cursor-pointer group"
            onClick={() => onSelect(w)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-sm font-bold text-white">
                  {w.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{w.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{w.role}</p>
                </div>
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>Task Completion</span>
                <span className="font-semibold text-emerald-500">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{workerTasks.length}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
              </div>
              <div className="p-2 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-sm font-bold text-emerald-500">{completed}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Done</p>
              </div>
              <div className="p-2 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-sm font-bold text-amber-500">{pending}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pending</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Salary: <strong style={{ color: 'var(--text-primary)' }}>{salary ? formatCurrency(salary.amount) : '—'}</strong></span>
              <span>Incentive: <strong className="text-emerald-500">{formatCurrency(incentive)}</strong></span>
            </div>
          </div>
        )
      })}
      {workers.length === 0 && <EmptyState title="No workers found" description="Add workers from Settings." icon={Users} />}
    </div>
  )
}

function WorkProgress({ workers, tasks }) {
  const data = workers.map(w => {
    const workerTasks = tasks.filter(t => t.workerId === w.id)
    return {
      name: w.name.split(' ')[0],
      total: workerTasks.length,
      completed: workerTasks.filter(t => t.status === 'Done').length,
      inProgress: workerTasks.filter(t => t.status === 'In Progress').length,
      pending: workerTasks.filter(t => t.status === 'Not Started').length,
    }
  })

  return (
    <div className="space-y-5">
      <div className="card">
        <h3 className="font-semibold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Work Progress by Worker</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="completed" fill="#10b981" radius={[4,4,0,0]} name="Completed" />
            <Bar dataKey="inProgress" fill="#6366f1" radius={[4,4,0,0]} name="In Progress" />
            <Bar dataKey="pending" fill="#f59e0b" radius={[4,4,0,0]} name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-role progress cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads'].map(role => {
          const roleTasks = tasks.filter(t => t.workerRole === role)
          const done = roleTasks.filter(t => t.status === 'Done').length
          const pct = roleTasks.length ? Math.round(done / roleTasks.length * 100) : 0
          return (
            <div key={role} className="card">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{role}</p>
              <p className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{pct}%</p>
              <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{done} of {roleTasks.length} done</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WorkerRevenue({ payments }) {
  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const monthly = payments.filter(p => p.date?.startsWith('2025-03')).reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
          <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{formatCurrency(total)}</p>
        </div>
        <div className="card">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>March 2025 Revenue</p>
          <p className="text-3xl font-bold mt-2 text-emerald-500">{formatCurrency(monthly)}</p>
        </div>
      </div>

      {/* Client-wise */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Client-wise Revenue</h3>
        <div className="space-y-3">
          {payments.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.clientName}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatDate(p.date)} · {p.note}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(p.amount)}</p>
                <span className={`text-xs font-semibold ${p.status === 'Paid' ? 'text-emerald-500' : p.status === 'Pending' ? 'text-amber-500' : 'text-blue-500'}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WorkerDetail({ worker, tasks, salaries, incentives }) {
  const workerTasks = tasks.filter(t => t.workerId === worker.id)
  const completed = workerTasks.filter(t => t.status === 'Done')
  const pending = workerTasks.filter(t => t.status !== 'Done')
  const salary = salaries.find(s => s.workerId === worker.id)
  const workerIncentives = incentives.filter(i => i.workerId === worker.id)
  const totalIncentive = workerIncentives.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'var(--bg-secondary)' }}>
        <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-lg font-bold text-white">{worker.avatar}</div>
        <div>
          <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{worker.name}</h3>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">{worker.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Total Tasks" value={workerTasks.length} />
        <Metric label="Completed" value={completed.length} color="emerald" />
        <Metric label="Pending" value={pending.length} color="amber" />
        <Metric label="Salary" value={salary ? formatCurrency(salary.amount) : '—'} />
        <Metric label="Total Incentives" value={formatCurrency(totalIncentive)} color="purple" />
        <Metric label="Access Level" value={worker.access} />
      </div>

      {workerIncentives.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Incentive History</p>
          <div className="space-y-2">
            {workerIncentives.map(i => (
              <div key={i.id} className="flex justify-between items-center p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{i.reason}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{i.month}</p>
                </div>
                <span className="text-sm font-bold text-emerald-500">{formatCurrency(i.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, color }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${color === 'emerald' ? 'text-emerald-500' : color === 'amber' ? 'text-amber-500' : color === 'purple' ? 'text-purple-500' : ''}`}
        style={!color ? { color: 'var(--text-primary)' } : {}}>
        {value}
      </p>
    </div>
  )
}
