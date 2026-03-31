import { useMemo, useEffect, useState } from 'react'
import { useData } from '../context/DataContext'
import { formatDate, cn } from '../lib/utils'
import { useSearchParams } from 'react-router-dom'
import { 
  CheckCircle2, 
  Calendar
} from 'lucide-react'
import { SearchBar, StatusSelect, EmptyState } from '../components/ui'

export default function WorkProgress() {
  const { tasks, workers } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  // Sync state with Search Params
  const search = searchParams.get('q') || ''
  const statusFilter = searchParams.get('status') || 'All'
  const roleFilter = searchParams.get('role') || 'All'

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') nextParams.delete(key)
      else nextParams.set(key, value)
    })
    setSearchParams(nextParams, { replace: true })
  }

  const todayStr = useMemo(() => new Date().toDateString(), [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Today's base task set
  const todayTasks = useMemo(() => {
    return tasks.filter(t => {
      const taskDate = t.updatedDate || t.takenDate || t.scheduleDate
      return taskDate && new Date(taskDate).toDateString() === todayStr
    })
  }, [tasks, todayStr])

  // Calculate today's stats from the pre-filtered set
  const stats = useMemo(() => {
    return {
      workDone: todayTasks.filter(t => t.contentCheck).length,
      pending: todayTasks.filter(t => t.status !== 'Done').length,
      complete: todayTasks.filter(t => t.status === 'Done').length
    }
  }, [todayTasks])

  // Filter today's tasks for the table display
  const filteredTasks = useMemo(() => {
    return todayTasks.filter(t => {
      const matchesSearch = !search || 
        t.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        t.task?.toLowerCase().includes(search.toLowerCase()) ||
        t.workerName?.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter
      const matchesRole = roleFilter === 'All' || t.workerRole === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    }).sort((a, b) => new Date(b.updatedDate || 0) - new Date(a.updatedDate || 0))
  }, [todayTasks, search, statusFilter, roleFilter])

  const roles = ['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads', 'Software Developer']

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white truncate tracking-tighter leading-none">
                Work <span className="text-primary/50">Progress</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-medium mt-2 opacity-60 leading-none tracking-widest">
                Operational Intelligence • Real-time Task Feed
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center sm:items-end gap-1">
                <p className="text-[9px] sm:text-[11px] text-muted opacity-60 tracking-widest font-normal">Work Done (Today)</p>
                <p className="text-2xl sm:text-4xl font-normal text-white tracking-tighter tabular-nums">{stats.workDone.toString().padStart(2, '0')}</p>
              </div>
              
              <div className="flex flex-col items-center sm:items-end gap-1">
                <p className="text-[9px] sm:text-[11px] text-muted opacity-60 tracking-widest font-normal">Pending (Today)</p>
                <p className="text-2xl sm:text-4xl font-normal text-white tracking-tighter tabular-nums text-blue-400">{stats.pending.toString().padStart(2, '0')}</p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-1">
                <p className="text-[9px] sm:text-[11px] text-muted opacity-60 tracking-widest font-normal">Complete (Today)</p>
                <p className="text-2xl sm:text-4xl font-normal text-white tracking-tighter tabular-nums text-primary">{stats.complete.toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        {/* Functional Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-sidebar/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="w-full sm:max-w-xs transition-all duration-500">
            <SearchBar 
              value={search}
              onChange={(val) => updateFilters({ q: val })}
              placeholder="Search deliverable..."
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <StatusSelect 
                value={roleFilter}
                onChange={(val) => updateFilters({ role: val })}
                options={['All', ...roles]}
                isFilter
                placeholder="Departments"
              />
            </div>

            <div className="w-full sm:w-48">
              <StatusSelect 
                value={statusFilter}
                onChange={(val) => updateFilters({ status: val })}
                options={['All', 'Not Started', 'In Progress', 'Done']}
                isFilter
                placeholder="Status"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {!isMobile ? (
            <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
              <thead className="text-[11px] text-muted bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors font-medium tracking-widest">
                <tr>
                  <th className="w-[180px] px-8 py-4 border-r border-border leading-none">Deliverable Date</th>
                  <th className="w-[300px] px-8 py-4 border-r border-border leading-none">Project Details</th>
                  <th className="w-[200px] px-8 py-4 border-r border-border leading-none">Assigned To</th>
                  <th className="w-[150px] px-8 py-4 border-r border-border leading-none">Department</th>
                  <th className="w-[150px] px-8 py-4 border-r border-border text-center leading-none">Status</th>
                  <th className="w-[100px] px-8 py-4 text-center leading-none">Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTasks.map((t) => {
                  const worker = workers.find(w => w.name === t.workerName)
                  return (
                    <tr key={t.id} className="hover:bg-sidebar transition-all group">
                      <td className="px-8 py-3 border-r border-border">
                        <div className="flex items-center gap-3">
                          <Calendar size={13} className="text-primary/40" />
                          <span className="text-[12px] text-white/50 tabular-nums tracking-tight">
                            {formatDate(t.updatedDate || t.takenDate || t.scheduleDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-3 border-r border-border overflow-hidden">
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-[13px] font-medium tracking-tight truncate" title={t.clientName}>{t.clientName}</span>
                          <span className="text-muted text-[11px] truncate opacity-50">{t.task}</span>
                        </div>
                      </td>
                      <td className="px-8 py-3 border-r border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-surface-800 border border-white/5 flex items-center justify-center text-[10px] text-primary flex-shrink-0 overflow-hidden shadow-inner">
                            {worker?.avatar?.startsWith('http') ? (
                              <img src={worker.avatar} alt={t.workerName} className="w-full h-full object-cover" />
                            ) : t.workerName?.charAt(0) || '?'}
                          </div>
                          <span className="text-white/80 text-[12px] font-medium tracking-tight truncate">{t.workerName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-3 border-r border-border">
                        <span className="text-muted text-[11px] font-medium tracking-tight whitespace-nowrap">{t.workerRole}</span>
                      </td>
                      <td className="px-8 py-3 border-r border-border text-center">
                        <div className="flex justify-center">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-medium tracking-widest border",
                            t.status === 'Done' ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                            t.status === 'In Progress' ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                            "text-white/40 bg-white/5 border-white/10"
                          )}>
                            {t.status}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-3 text-center">
                        <div className="flex justify-center">
                          <div className={cn(
                            "w-5 h-5 rounded-md flex items-center justify-center border transition-colors",
                            t.contentCheck 
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                              : "bg-surface-800/50 border-white/5 text-white/5"
                          )}>
                            <CheckCircle2 size={12} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-4 grid grid-cols-1 gap-4 pb-20">
              {filteredTasks.map(t => {
                const worker = workers.find(w => w.name === t.workerName)
                return (
                  <div key={t.id} className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 opacity-50" />
                    
                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h3 className="text-white text-sm font-medium tracking-tight leading-tight truncate">{t.clientName}</h3>
                        <p className="text-muted text-[11px] font-medium line-clamp-1 opacity-60 italic">{t.task}</p>
                      </div>
                      <div className={cn(
                        "px-2.5 py-1 rounded-lg text-[9px] font-medium tracking-widest border whitespace-nowrap",
                        t.status === 'Done' ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
                        t.status === 'In Progress' ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : 
                        "text-white/40 bg-white/5 border-white/10"
                      )}>
                        {t.status}
                      </div>
                    </div>
  
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center text-[10px] font-medium text-primary overflow-hidden shadow-inner">
                          {worker?.avatar?.startsWith('http') ? (
                            <img src={worker.avatar} alt={t.workerName} className="w-full h-full object-cover" />
                          ) : t.workerName?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-white text-[11px] font-medium tracking-tight leading-none">{t.workerName}</p>
                          <p className="text-[9px] text-muted opacity-40 tracking-widest font-medium mt-1">{t.workerRole}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                         <div className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center border",
                            t.contentCheck 
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                              : "bg-white/[0.02] border-white/5 text-white/5"
                          )}>
                            <CheckCircle2 size={14} />
                          </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-3 border-t border-white/5">
                      <Calendar size={11} className="text-primary/40" />
                      <span className="text-[10px] text-muted font-medium opacity-30 tracking-tight">
                        {formatDate(t.updatedDate || t.takenDate || t.scheduleDate)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {filteredTasks.length === 0 && (
             <div className="p-12 sm:p-24"><EmptyState title={`No active work for ${todayStr}`} description="The delivery pipeline is clear for today." /></div>
          )}
        </div>
      </div>
    </div>
  )
}
