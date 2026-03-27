import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { PageHeader, EmptyState, Modal, FormField, StatusSelect, CustomSelect } from '../components/ui/index'
import { formatCurrency, formatDate } from '../lib/utils'
import { Plus, Trash2, Gift } from 'lucide-react'

const ROLES = ['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads']

export default function Incentives() {
  const { incentives, addIncentive, deleteIncentive, workers } = useData()
  const { isManager, canDelete } = useAuth()
  const [roleFilter, setRoleFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({})
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const filtered = incentives.filter(i => roleFilter === 'All' || i.role === roleFilter)
  const totalIncentive = filtered.reduce((s, i) => s + i.amount, 0)

  const workerTotals = workers.map(w => ({
    worker: w,
    total: incentives.filter(i => i.workerId === w.id).reduce((s, i) => s + i.amount, 0),
    items: incentives.filter(i => i.workerId === w.id),
  }))

  const handleAdd = () => {
    const worker = workers.find(w => w.id === form.workerId)
    addIncentive({
      ...form,
      workerName: worker?.name || form.workerName,
      role: worker?.role || form.role,
      month: form.month || new Date().toISOString().slice(0, 7),
    })
    setShowModal(false)
    setForm({})
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incentives"
        subtitle="Worker bonuses and special incentive tracking"
        actions={
          isManager && (
            <button className="btn-primary" onClick={() => { setForm({}); setShowModal(true) }}>
              <Plus size={16} /> Add Incentive
            </button>
          )
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Incentives (Filtered)</p>
          <p className="text-2xl font-bold mt-1 text-emerald-500">{formatCurrency(totalIncentive)}</p>
        </div>
        <div className="card">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Records</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{incentives.length}</p>
        </div>
        {['Content Specialist', 'Editor'].map(role => (
          <div key={role} className="card">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p>
            <p className="text-2xl font-bold mt-1 text-brand-500">
              {formatCurrency(incentives.filter(i => i.role === role).reduce((s, i) => s + i.amount, 0))}
            </p>
          </div>
        ))}
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...ROLES].map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${roleFilter === r ? 'bg-brand-500 text-white' : 'btn-secondary'}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Worker incentive cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {workerTotals.filter(w => roleFilter === 'All' || w.worker.role === roleFilter).map(({ worker, total, items }) => (
          <div key={worker.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-xs font-bold text-white">{worker.avatar}</div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{worker.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{worker.role}</p>
                </div>
              </div>
              <p className="font-bold text-emerald-500">{formatCurrency(total)}</p>
            </div>
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="text-xs text-center py-3" style={{ color: 'var(--text-muted)' }}>No incentives yet</p>
              ) : (
                items.map(i => (
                  <div key={i.id} className="flex items-start justify-between p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{i.reason}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{i.month}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs font-bold text-emerald-500">{formatCurrency(i.amount)}</span>
                      {canDelete && (
                        <button className="btn-ghost p-1 hover:text-red-400" onClick={() => deleteIncentive(i.id)}><Trash2 size={12} /></button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
        {workerTotals.filter(w => roleFilter === 'All' || w.worker.role === roleFilter).length === 0 && (
          <div className="col-span-3"><EmptyState title="No incentives" description="Add incentives for your team." icon={Gift} /></div>
        )}
      </div>

      {/* Add Incentive Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Incentive">
        <div className="space-y-4">
          <FormField label="Worker">
            <CustomSelect 
              value={form.workerId || ''} 
              options={[{ label: 'Select worker', value: '' }, ...workers.map(w => ({ label: `${w.name} (${w.role})`, value: w.id }))]}
              onChange={val => f('workerId', val)}
              isFilter
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Amount (₹)"><input className="input" type="number" value={form.amount || ''} onChange={e => f('amount', parseInt(e.target.value))} /></FormField>
            <FormField label="Month">
              <input className="input" type="month" value={form.month || new Date().toISOString().slice(0, 7)} onChange={e => f('month', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Reason">
            <textarea className="input" rows={3} value={form.reason || ''} onChange={e => f('reason', e.target.value)} placeholder="Why is this incentive being given?" />
          </FormField>
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleAdd}>Add Incentive</button>
        </div>
      </Modal>
    </div>
  )
}
