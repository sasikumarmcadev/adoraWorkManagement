import { useState, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { EmptyState, Modal, SearchBar } from '../components/ui/index'
import { formatCurrency, formatDate, cn } from '../lib/utils'
import { Users, ChevronRight } from 'lucide-react'

export default function WorkersDashboard() {
  const { workers, tasks, salaries, incentives } = useData()
  const { isManager } = useAuth()
  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-6">
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10 -mx-6 -mt-6 mb-8">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="page-heading truncate leading-none">
                Workers <span className="text-primary/50">Intelligence</span>
              </h1>
              <p className="page-subheading">
                Personnel Performance • Workforce Analytical Systems
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-medium opacity-60 tracking-widest leading-none">Registered Personnel</p>
              <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter tabular-nums leading-none">
                {(workers?.length || 0).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <WorkersList workers={workers} tasks={tasks} salaries={salaries} incentives={incentives} onSelect={setSelected} />

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Worker Details" size="lg">
        {selected && <WorkerDetail worker={selected} tasks={tasks} salaries={salaries} incentives={incentives} />}
      </Modal>
    </div>
  )
}

function WorkersList({ workers, tasks, salaries, incentives, onSelect }) {
  const [search, setSearch] = useState('')

  const filteredWorkers = useMemo(() => {
    return workers.filter(w =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.role.toLowerCase().includes(search.toLowerCase())
    )
  }, [workers, search])

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter personnel by name or role..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredWorkers.map(w => {
          const workerTasks = tasks.filter(t => t.workerId === w.id)
          const completed = workerTasks.filter(t => t.status === 'Done').length
          const pending = workerTasks.filter(t => t.status !== 'Done').length
          const salary = salaries.find(s => s.workerId === w.id)
          const incentive = incentives.filter(i => i.workerId === w.id).reduce((sum, i) => sum + i.amount, 0)
          const pct = workerTasks.length ? Math.round((completed / workerTasks.length) * 100) : 0

          return (
            <div
              key={w.id}
              className="group relative bg-panel border border-border hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer"
              onClick={() => onSelect(w)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-border flex items-center justify-center text-primary font-medium text-lg overflow-hidden group-hover:scale-110 transition-transform duration-500">
                    {w.avatar?.startsWith('http') ? (
                      <img src={w.avatar} alt={w.name} className="w-full h-full object-cover" />
                    ) : (
                      w.avatar || w.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white group-hover:text-primary transition-colors">{w.name}</h3>
                    <p className="text-[10px] text-muted font-medium tracking-widest mt-0.5 opacity-60 ">{w.role}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted group-hover:bg-primary group-hover:text-black transition-all">
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Enhanced Progress Section */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-medium text-muted tracking-widest opacity-40 ">Task Efficiency</p>
                  <p className="text-sm font-medium text-emerald-400 tabular-nums">{pct}%</p>
                </div>
                <div className="h-1.5 rounded-full bg-surface-800 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-800/50 border border-white/5 rounded-xl p-2.5 text-center transition-colors group-hover:border-white/10">
                  <p className="text-[9px] text-muted font-medium  tracking-widest opacity-40 mb-1">Total</p>
                  <p className="text-sm font-medium text-white tabular-nums">{workerTasks.length.toString().padStart(2, '0')}</p>
                </div>
                <div className="bg-surface-800/50 border border-white/5 rounded-xl p-2.5 text-center transition-colors group-hover:border-white/10">
                  <p className="text-[9px] text-muted font-medium  tracking-widest opacity-40 mb-1">Done</p>
                  <p className="text-sm font-medium text-emerald-400 tabular-nums">{completed.toString().padStart(2, '0')}</p>
                </div>
                <div className="bg-surface-800/50 border border-white/5 rounded-xl p-2.5 text-center transition-colors group-hover:border-white/10">
                  <p className="text-[9px] text-muted font-medium  tracking-widest opacity-40 mb-1">Hold</p>
                  <p className="text-sm font-medium text-amber-400 tabular-nums">{pending.toString().padStart(2, '0')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[9px] text-muted font-medium tracking-widest opacity-40 ">Base Salary</span>
                  <span className="text-xs font-medium text-white mt-0.5">{salary ? formatCurrency(salary.amount) : '—'}</span>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-[9px] text-muted font-medium tracking-widest opacity-40 ">Incentives</span>
                  <span className="text-xs font-medium text-emerald-400 mt-0.5">{formatCurrency(incentive)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {filteredWorkers.length === 0 && (
        <div className="py-20 text-center">
          <EmptyState
            title={search ? "No results found" : "No workers found"}
            description={search ? `We couldn't find any worker matching "${search}"` : "Add workers from Settings."}
            icon={Users}
          />
        </div>
      )}
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
    <div className="space-y-5">
      <div className="flex items-center gap-5 p-5 rounded-2xl bg-sidebar/50 border border-border">
        <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-border flex items-center justify-center text-2xl font-medium text-primary overflow-hidden shadow-xl">
          {worker.avatar?.startsWith('http') ? (
            <img src={worker.avatar} alt={worker.name} className="w-full h-full object-cover" />
          ) : (
            worker.avatar || worker.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="font-medium text-xl text-white tracking-tight">{worker.name}</h3>
          <p className="text-[11px] font-medium text-muted tracking-widest  opacity-60 mt-1">{worker.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Metric label="Total Tasks" value={workerTasks.length} />
        <Metric label="Completed" value={completed.length} color="emerald" />
        <Metric label="Pending" value={pending.length} color="amber" />
        <Metric label="Salary" value={salary ? formatCurrency(salary.amount) : '—'} />
        <Metric label="Total Incentives" value={formatCurrency(totalIncentive)} color="purple" />
        <Metric label="Access Level" value={worker.access} />
      </div>

      {workerIncentives.length > 0 && (
        <div className="mt-2">
          <p className="text-[10px] font-medium text-muted tracking-widest  opacity-40 mb-3 px-1">Incentive Distribution History</p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {workerIncentives.map(i => (
              <div key={i.id} className="flex justify-between items-center p-3 rounded-xl bg-sidebar border border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <p className="text-xs font-medium text-white leading-none">{i.reason}</p>
                  <p className="text-[10px] text-muted font-medium mt-1.5 opacity-60">{i.month}</p>
                </div>
                <span className="text-sm font-medium text-emerald-400 tabular-nums">{formatCurrency(i.amount)}</span>
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
    <div className="bg-sidebar border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
      <p className="text-[10px] font-medium text-muted tracking-widest  opacity-40 mb-1.5 leading-none">{label}</p>
      <p className={cn(
        "text-xl font-medium tracking-tight",
        color === 'emerald' ? 'text-emerald-400' :
          color === 'amber' ? 'text-amber-400' :
            color === 'purple' ? 'text-purple-400' :
              "text-white"
      )}>
        {value}
      </p>
    </div>
  )
}

