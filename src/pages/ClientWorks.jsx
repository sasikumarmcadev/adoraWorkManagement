import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { cn, formatDate } from '../lib/utils'
import {
  Plus, Edit2, Filter, Search, Target, Move, Image as ImageIcon,
  Trash2, Calendar as CalendarIcon, MoreVertical, ArrowLeft,
  ChevronDown, CheckCircle2, FileText, Hash, User
} from 'lucide-react'
import { Modal, FormField, SearchBar, EmptyState, StatusSelect, CustomSelect } from '../components/ui/index'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// FullCalendar imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'

// --- HANDWRITTEN TICK COMPONENT ---


// --- CUSTOM SIDEBAR ICON ---
const SidebarIcon = ({ className, size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="-0.5 -0.5 16 16"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
    height={size}
    width={size}
    className={className}
  >
    <path d="M5.625 2.1875v10.625M1.875 5.875c0 -1.4000000000000001 0 -2.1 0.2725 -2.6350000000000002a2.5 2.5 0 0 1 1.0925 -1.0925C3.775 1.875 4.475 1.875 5.875 1.875h3.25c1.4000000000000001 0 2.1 0 2.6350000000000002 0.2725a2.5 2.5 0 0 1 1.0925 1.0925C13.125 3.775 13.125 4.475 13.125 5.875v3.25c0 1.4000000000000001 0 2.1 -0.2725 2.6350000000000002a2.5 2.5 0 0 1 -1.0925 1.0925C11.225000000000001 13.125 10.525 13.125 9.125 13.125H5.875c-1.4000000000000001 0 -2.1 0 -2.6350000000000002 -0.2725a2.5 2.5 0 0 1 -1.0925 -1.0925C1.875 11.225000000000001 1.875 10.525 1.875 9.125z" strokeWidth="1" />
  </svg>
)

// --- DASHBOARD OVERVIEW ---
const DASHBOARD_STATUSES = ['Done', 'In Progress', 'Not Started']
const STATUS_COLORS_MAP = {
  'Done': '#10b981',
  'In Progress': '#3b82f6',
  'Not Started': '#3f3f46'
}

function ClientAvatar({ name, logo, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-full text-[10px]",
    md: "w-11 h-11 rounded-full text-xs",
    lg: "w-20 h-20 rounded-full text-2xl",
    xl: "w-12 h-12 sm:w-16 sm:h-16 rounded-full text-base sm:text-xl"
  }
  
  if (logo) {
    return (
      <div className={cn(sizeClasses[size], "border border-white/5 overflow-hidden shadow-inner bg-surface-800 flex flex-shrink-0 relative z-10")}>
        <img src={logo} alt={name} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div className={cn(
      sizeClasses[size], 
      "bg-surface-800 border border-white/5 flex items-center justify-center font-medium text-primary flex-shrink-0 shadow-inner relative z-10"
    )}>
      {name?.charAt(0)}
    </div>
  )
}

function DashboardOverview({ title, tasks, onExpandSidebar, isSidebarCollapsed, onBack }) {
  const statusCounts = DASHBOARD_STATUSES.map(status => ({
    name: status,
    value: tasks.filter(t => t.status === status).length,
    color: STATUS_COLORS_MAP[status] || '#94a3b8'
  })).filter(item => item.value > 0)

  const total = tasks.length

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90  border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl">
          <p className="text-[10px] font-medium text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: payload[0].payload.color || payload[0].fill }} />
            {`${payload[0].name} : ${payload[0].value}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden h-auto py-8 sm:py-10 lg:py-12">
      <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 sm:gap-12 lg:gap-20">
          
          <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] flex-shrink-0 mx-auto lg:mx-0">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusCounts}
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {statusCounts.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-1">
              <span className="text-2xl sm:text-3xl font-medium text-white leading-none tracking-tighter">{total}</span>
              <span className="text-[7px] sm:text-[8px] text-muted font-medium mt-1 opacity-50 tracking-widest">Assets</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 w-full text-center lg:text-left">
            <div className="mb-6 lg:mb-8 flex flex-col items-center lg:items-start text-center lg:text-left transition-all relative">
              {onBack && (
                <button
                  onClick={onBack}
                  className="lg:hidden absolute -top-12 left-0 p-2 text-muted hover:text-white transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span className="text-[10px] font-medium tracking-widest">Back</span>
                </button>
              )}
              <h1 className="page-heading truncate w-full px-2 lg:px-0">{title}</h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-medium mt-2 opacity-60 tracking-widest">Strategic Intelligence Suite</p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-6 sm:gap-x-10 lg:gap-16 w-full mt-4 sm:mt-10">
              {DASHBOARD_STATUSES.map(status => {
                const count = tasks.filter(t => t.status === status).length
                return (
                  <div key={status} className="flex flex-col group cursor-default min-w-[30%] sm:min-w-[80px]">
                    <p className="text-[9px] sm:text-[10px] text-muted font-medium mb-1 sm:mb-2 opacity-50 group-hover:text-white transition-colors tracking-[0.05em]">{status}</p>
                    <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                      <div className="h-4 sm:h-5 w-[2px] rounded-full group-hover:h-8 group-hover:bg-primary transition-all" style={{ background: count > 0 ? STATUS_COLORS_MAP[status] : 'rgba(255,255,255,0.05)' }} />
                      <p className={`text-lg sm:text-2xl font-medium tabular-nums transition-transform ${count > 0 ? 'text-white' : 'text-white/10'}`}>
                        {count}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MultiWorkerSelect({ currentWorkers = '', allWorkers, onUpdate, rowIndex = 0 }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const workerList = currentWorkers ? currentWorkers.split(',').map(s => s.trim()).filter(Boolean) : []

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({ top: rect.top, left: rect.left, width: rect.width })
    }
  }

  useEffect(() => {
    if (isOpen) updateCoords()
  }, [isOpen])

  useEffect(() => {
    const handleClose = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && !e.target.closest('.portal-menu')) {
        setIsOpen(false)
      }
    }
    const handleScroll = () => {
      if (isOpen) updateCoords()
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClose)
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => {
      document.removeEventListener('mousedown', handleClose)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const toggleWorker = (name) => {
    let newList
    if (workerList.includes(name)) {
      newList = workerList.filter(n => n !== name)
    } else {
      newList = [...workerList, name]
    }
    onUpdate(newList.join(', '))
  }

  const menuContent = isOpen && (
    <div
      className={cn(
        "portal-menu fixed bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_45px_100px_-20px_rgba(0,0,0,1)] z-[1000000] p-2 backdrop-blur-3xl w-56",
        rowIndex < 3 ? "mt-2" : "-translate-y-full -mt-2"
      )}
      style={{
        top: rowIndex < 3 ? coords.top + 32 : coords.top,
        left: coords.left
      }}
    >
      <p className="text-[9px] font-medium text-muted tracking-widest p-2 opacity-40 border-b border-white/5 mb-1.5">Assigned Personnel</p>
      <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">
        {allWorkers.map(w => {
          const isActive = workerList.includes(w.name)
          return (
            <button
              key={w.id}
              onClick={() => toggleWorker(w.name)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all",
                isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              {w.name}
              {isActive && <CheckCircle2 size={12} />}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-wrap gap-1 items-center min-h-[32px] p-1 border border-transparent hover:border-white/10 rounded-lg cursor-pointer transition-all bg-white/[0.02]"
      >
        {workerList.length > 0 ? (
          workerList.map(name => (
            <span key={name} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-medium text-primary flex items-center gap-1 group">
              {name}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-muted/40 font-medium px-2 italic">Unassigned</span>
        )}
        <button className="ml-auto p-1 text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 size={10} />
        </button>
      </div>
      {isOpen && createPortal(menuContent, document.body)}
    </div>
  )
}

function TaskDetailModal({ task, isOpen, onClose }) {
  if (!task) return null
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'In Progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'Not Started': return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getApprovalColor = (status) => {
    switch (status) {
      case 'Approval': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case 'Changes': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      default: return 'text-muted bg-white/5 border-border'
    }
  }

  const fields = [
    { label: 'Taken Date', value: formatDate(task.takenDate), color: 'text-white' },
    { label: 'Content', value: task.task, color: 'text-primary' },
    { label: 'Decline Date', value: task.declineDate || '—', color: task.declineDate ? 'text-red-400' : 'text-muted' },
    { label: 'Status', value: task.status, type: 'status' },
    { label: 'Person', value: task.workerName || 'Unassigned', color: 'text-white' },
    { label: 'Approval', value: task.clientApproval || 'Pending', type: 'approval' },
    { label: 'Schedule', value: task.scheduleDate || '—', color: 'text-muted' },
    { label: 'Updated', value: task.updatedDate || '—', color: 'text-muted/50' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tactical Asset Deep-Dive" size="md">
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className={cn(
                "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300",
                task.contentCheck
                  ? "bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "border-white/10 bg-white/[0.02]"
              )}>
                <CheckCircle2 size={24} className={task.contentCheck ? "text-emerald-400" : "text-white/10"} />
             </div>
             <div>
                <p className="text-[10px] font-medium text-muted tracking-widest opacity-40 mb-1">Content Verification</p>
                <p className={cn("text-xs font-medium tracking-tight", task.contentCheck ? "text-emerald-400" : "text-muted")}>
                  {task.contentCheck ? 'Verified & Validated' : 'Awaiting Inspection'}
                </p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-medium text-muted tracking-widest opacity-40 mb-1">Asset ID</p>
             <p className="text-xs font-mono text-white/40">#{task.id?.slice(-8) || 'AUTO-GEN'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1.5">
              <p className="text-[9px] font-medium text-muted tracking-widest opacity-40">{field.label}</p>
              {field.type === 'status' ? (
                <div className={cn("inline-flex px-3 py-1 rounded-full text-[10px] font-medium tracking-widest border", getStatusColor(task.status))}>
                  {task.status}
                </div>
              ) : field.type === 'approval' ? (
                <div className={cn("inline-flex px-3 py-1 rounded-full text-[10px] font-medium tracking-widest border", getApprovalColor(task.clientApproval || 'Approval'))}>
                  {task.clientApproval || 'Approval'}
                </div>
              ) : (
                <p className={cn("text-sm font-medium tracking-tight", field.color)}>{field.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="pt-8 flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-medium text-white tracking-widest transition-all active:scale-95"
           >
             Close Intel
           </button>
        </div>
      </div>
    </Modal>
  )
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Done': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'In Progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    case 'Not Started': return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }
}

const getApprovalColor = (status) => {
  switch (status) {
    case 'Approval': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'Changes': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
    default: return 'text-muted bg-white/5 border-border'
  }
}

function TaskTable({ tasks, workers = [], onAdd, onUpdateTask, deleteTask, search, setSearch, statusFilter, setStatusFilter, onViewDetail, isMobile }) {

  return (
    <div className="flex flex-col h-full overflow-hidden p-0 bg-panel lg:border-l border-border">
      <div className="p-4 sm:p-5 border-b border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-sidebar">
        <div className="w-full md:w-72">
          <SearchBar value={search} onChange={setSearch} placeholder="Filter tasks..." />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-thin scrollbar-thumb-white/10">
          <button 
            className="flex-shrink-0 group flex items-center gap-2 pl-1.5 pr-6 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full transition-all" 
            onClick={() => onAdd()}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform">
              <Plus size={18} />
            </div>
            <span className="text-[10px] font-medium text-primary tracking-widest">Initialize</span>
          </button>
          
          <div className="relative flex-1 md:flex-initial min-w-[160px]">
            <StatusSelect
              value={statusFilter === 'All' ? 'All Operations' : statusFilter}
              options={['All Operations', 'Not Started', 'In Progress', 'Done']}
              onChange={(val) => setStatusFilter(val === 'All Operations' ? 'All' : val)}
              isFilter
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 pb-10">
        {isMobile ? (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {tasks.map(task => (
              <div key={task.id} className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 sm:p-6 shadow-2xl group/card relative overflow-hidden transition-all active:scale-[0.98]">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={() => onUpdateTask(task.id, { ...task, contentCheck: !task.contentCheck, updatedDate: new Date().toISOString().split('T')[0] })}
                      className={cn(
                        "w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 flex-shrink-0",
                        task.contentCheck
                          ? "bg-emerald-600 border-emerald-600 shadow-sm"
                          : "border-white/10 bg-white/[0.01] hover:border-white/20"
                      )}
                    >
                      <CheckCircle2 size={16} className={task.contentCheck ? "text-white" : "text-white/5"} />
                    </button>
                    <div className="min-w-0 cursor-pointer group" onClick={() => onViewDetail(task)}>
                      <h3 className="text-sm font-medium text-white tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors">{task.task}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] text-muted font-medium opacity-40 tracking-wider whitespace-nowrap">{formatDate(task.takenDate)}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[9px] text-primary font-medium opacity-60">{task.category || 'General'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => onAdd(task)} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"><Edit2 size={14} /></button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        if (confirm('Permanently decommission this tactical asset?')) deleteTask(task.id); 
                      }} 
                      className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="relative">
                    <StatusSelect
                      value={task.status}
                      options={['Not Started', 'In Progress', 'Done']}
                      onChange={val => onUpdateTask(task.id, { ...task, status: val })}
                      getStatusColor={getStatusColor}
                    />
                  </div>
                  <div className="relative">
                    <StatusSelect
                      value={task.clientApproval || 'Approval'}
                      options={['Approval', 'Changes']}
                      onChange={val => onUpdateTask(task.id, { ...task, clientApproval: val })}
                      getStatusColor={getApprovalColor}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[8px] font-medium text-primary">
                      {task.workerName?.charAt(0) || '?'}
                    </div>
                    <span className="text-[9px] font-medium text-white/50 truncate max-w-[100px]">{task.workerName || 'Unassigned'}</span>
                  </div>
                  {task.scheduleDate && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                      <CalendarIcon size={10} className="text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-medium text-muted">{task.scheduleDate}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm text-left border-separate border-spacing-0 min-w-[1250px] table-fixed overflow-visible">
            <thead className="text-[10px] text-muted font-medium bg-sidebar border-b border-border tracking-wider px-0">
              <tr>
                <th className="w-[100px] px-4 py-4 border-r border-border">Taken Date</th>
                <th className="px-4 py-4 border-r border-border min-w-[180px]">Content</th>
                <th className="w-[110px] px-4 py-4 border-r border-border">Decline Date</th>
                <th className="w-[125px] px-4 py-4 border-r border-border text-center">Status</th>
                <th className="w-[160px] px-4 py-4 border-r border-border">Person</th>
                <th className="w-[125px] px-4 py-4 border-r border-border text-center">Approval</th>
                <th className="w-[110px] px-4 py-4 border-r border-border">Schedule</th>
                <th className="w-[110px] px-4 py-4 border-r border-border">Updated</th>
                <th className="w-[100px] px-4 py-4 border-r border-border text-center">Check Box</th>
                <th className="w-[80px] px-4 py-4 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(
                tasks.reduce((acc, t) => {
                  const date = t.takenDate || 'No Date';
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(t);
                  return acc;
                }, {})
              ).sort(([a], [b]) => b.localeCompare(a)).map(([date, dayTasks]) => {
                return dayTasks.map((task, idx) => (
                  <tr key={task.id} className="hover:bg-sidebar transition-colors group">
                    <td className="px-4 py-4 text-secondary font-medium text-[11px] tabular-nums border-r border-border opacity-70">
                      {idx === 0 ? formatDate(date) : ''}
                    </td>
                    <td className="px-4 py-4 border-r border-border">
                      <div className="flex items-center gap-3 cursor-pointer group/task" onClick={() => onViewDetail(task)}>
                        <FileText size={14} className="text-muted group-hover/task:text-primary transition-colors opacity-40" />
                        <span className="text-white font-medium text-xs group-hover/task:text-primary transition-colors">{task.task}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-border text-[11px] font-medium text-red-400 opacity-60 tabular-nums">
                      {task.declineDate || '—'}
                    </td>
                    <td className="px-4 py-4 border-r border-border">
                      <StatusSelect
                        value={task.status}
                        options={['Not Started', 'In Progress', 'Done']}
                        onChange={val => onUpdateTask(task.id, { ...task, status: val })}
                        getStatusColor={getStatusColor}
                      />
                    </td>
                    <td className="px-4 py-4 border-r border-border">
                      <MultiWorkerSelect
                        currentWorkers={task.workerName}
                        allWorkers={workers}
                        rowIndex={idx}
                        onUpdate={(names) => onUpdateTask(task.id, { ...task, workerName: names })}
                      />
                    </td>
                    <td className="px-4 py-4 border-r border-border">
                      <StatusSelect
                        value={task.clientApproval || 'Approval'}
                        options={['Approval', 'Changes']}
                        onChange={val => onUpdateTask(task.id, { ...task, clientApproval: val })}
                        getStatusColor={getApprovalColor}
                      />
                    </td>
                    <td className="px-4 py-4 border-r border-border text-[11px] font-medium text-muted tabular-nums opacity-60">
                      {task.scheduleDate || '—'}
                    </td>
                    <td className="px-4 py-4 border-r border-border text-[11px] font-medium text-muted/30 tabular-nums">
                      {task.updatedDate || '—'}
                    </td>
                    <td className="px-4 py-4 border-r border-border text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => onUpdateTask(task.id, { 
                            ...task, 
                            contentCheck: !task.contentCheck, 
                            updatedDate: new Date().toISOString().split('T')[0] 
                          })}
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90",
                            task.contentCheck
                              ? "bg-emerald-600 border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              : "border-white/10 hover:border-white/30 bg-white/[0.02]"
                          )}
                        >
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full bg-white transition-all duration-300",
                            task.contentCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"
                          )} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onAdd(task)} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded transition-all"><Edit2 size={13} /></button>
                        <button 
                          onClick={() => { if (confirm('Decommission this asset?')) deleteTask(task.id); }} 
                          className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function CalendarView({ tasks, onViewDetail, deleteTask, isSmallScreen }) {
  const { desktopCollapsed } = useData()
  const calendarRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedTasks, setSelectedTasks] = useState(null)

  const events = useMemo(() => tasks.map(t => ({
    id: t.id,
    title: t.task || 'Tactical Asset',
    date: t.contentCheck ? t.updatedDate : (t.scheduleDate || t.takenDate),
    extendedProps: { ...t },
    backgroundColor: t.contentCheck 
      ? 'rgba(16, 185, 129, 0.2)' 
      : t.status === 'Done' 
        ? 'rgba(16, 185, 129, 0.1)' 
        : t.status === 'In Progress' 
          ? 'rgba(59, 130, 246, 0.1)' 
          : 'rgba(255, 255, 255, 0.05)',
    textColor: t.contentCheck ? '#34d399' : t.status === 'Done' ? '#10b981' : t.status === 'In Progress' ? '#3b82f6' : '#a1a1aa',
    borderColor: t.contentCheck ? 'rgba(52, 211, 153, 0.5)' : t.status === 'Done' ? 'rgba(16, 185, 129, 0.3)' : t.status === 'In Progress' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'
  })), [tasks])

  const handleDateClick = (arg) => {
    const api = calendarRef.current?.getApi()
    if (api && api.view.type === 'multiMonthYear') {
      api.changeView('dayGridMonth', arg.date)
      return
    }

    const dayTasks = tasks.filter(t => t.takenDate === arg.dateStr)
    if (dayTasks.length > 0) {
      setSelectedTasks({ date: arg.dateStr, tasks: dayTasks })
    } else {
      setSelectedTasks(null)
    }
  }

  useEffect(() => {
    const api = calendarRef.current?.getApi()
    if (api) {
      const timer = setTimeout(() => {
        api.updateSize()
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [desktopCollapsed])

  useEffect(() => {
    if (!containerRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      const api = calendarRef.current?.getApi()
      if (api) {
        api.updateSize()
        const width = containerRef.current.clientWidth
        if (width < 640 && api.view.type === 'dayGridMonth') {
          api.changeView('dayGridWeek')
        } else if (width >= 640 && api.view.type === 'dayGridWeek') {
          api.changeView('dayGridMonth')
        }
      }
    })
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div id="calendar-view" className="w-full flex-1 p-0 overflow-hidden flex flex-col bg-panel">
      <style>{`
        .fc-theme-standard td, .fc-theme-standard th { border-color: var(--border) !important; }
        .fc-scrollgrid { border-color: var(--border) !important; border-radius: 0.25rem !important; }
        .fc-theme-standard .fc-scrollgrid { border: none !important; }
        .fc-header-toolbar { margin: 0.75rem !important; flex-wrap: wrap; gap: 0.5rem; }
        .fc-button-primary { background-color: var(--sidebar) !important; border-color: var(--border) !important; color: var(--text-primary) !important; text-transform: capitalize !important; border-radius: 0.25rem !important; padding: 0.3rem 0.5rem !important; font-size: 0.7rem !important; }
        .fc-button-primary:hover { background-color: var(--border) !important; }
        .fc-button-active { background-color: var(--text-primary) !important; color: var(--bg-primary) !important; }
        .fc-day-today { background-color: rgba(255, 255, 255, 0.05) !important; }
        .fc-event { 
          border-radius: 6px !important; 
          font-size: 8px !important; 
          padding: 3px 6px !important; 
          cursor: pointer !important; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis; 
          font-weight: 800 !important;
          letter-spacing: 0.02em !important;
          border-width: 1px !important;
          margin: 1px 2px !important;
          transition: all 0.2s ease !important;
        }
        .fc-event:hover {
          filter: brightness(1.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .fc-col-header-cell { background-color: #111111 !important; border-bottom: 2px solid var(--border) !important; }
        .fc-col-header-cell-cushion { color: var(--text-primary) !important; font-weight: 800 !important; font-size: 0.7rem; padding: 0.6rem !important; display: block !important; }
        .fc-daygrid-day-number { color: var(--text-primary) !important; font-size: 0.7rem; padding: 0.3rem !important; }
        .fc-toolbar-title { color: var(--text-primary) !important; font-size: 0.9rem !important; font-weight: 700 !important; }
        
        .fc-theme-standard .fc-list, .fc-theme-standard .fc-list-day-cushion { background: transparent !important; }
        .fc-multimonth { background: transparent !important; }
        .fc-multimonth-month { border: none !important; transition: all 0.2s ease; border-radius: 0.5rem; }
        .fc-multimonth-month:hover { background: rgba(255, 255, 255, 0.05) !important; cursor: pointer; transform: scale(1.02); }
        .fc-multimonth-title { color: var(--text-primary) !important; font-size: 0.8rem !important; font-weight: 700 !important; background: transparent !important; padding: 0.75rem 0 !important; }
        .fc-multimonth-daygrid-table { background: transparent !important; }
        .fc-multimonth-daygrid-table td { pointer-events: none !important; }
        .fc-multimonth-month { pointer-events: auto !important; }
        
        @media (max-width: 768px) {
          .fc-header-toolbar { flex-direction: column; align-items: center; }
          .fc-toolbar-chunk { margin-bottom: 0.25rem; }
          .fc-event { font-size: 0.55rem !important; }
          .fc-button-primary { padding: 0.25rem 0.4rem !important; font-size: 0.65rem !important; }
          .fc-col-header-cell-cushion { font-size: 0.6rem !important; padding: 0.4rem !important; }
        }
      `}</style>

      <div className="p-4 sm:p-5 border-b border-border bg-sidebar flex items-center justify-between">
        <h2 className="text-[10px] sm:text-xs font-medium text-white flex items-center gap-2">
          <CalendarIcon size={14} className="text-primary" /> Operational Roadmap
        </h2>
      </div>

      <div ref={containerRef} className="p-0 bg-panel flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
          initialView={isSmallScreen ? 'dayGridWeek' : 'dayGridMonth'}
          initialDate={new Date().toISOString().split('T')[0]}
          events={events}
          dateClick={handleDateClick}
          headerToolbar={{
            left: isSmallScreen ? 'prev,next' : 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,dayGridWeek,dayGridDay'
          }}
          height="auto"
          contentHeight="auto"
          handleWindowResize={true}
          expandRows={true}
          eventDisplay="block"
          viewClassNames={isSmallScreen ? "mobile-calendar" : ""}
        />
      </div>

      <Modal isOpen={!!selectedTasks} onClose={() => setSelectedTasks(null)} title={`Tactical Assets for ${selectedTasks?.date}`} size="md">
        <div className="space-y-3 mt-4">
          {selectedTasks?.tasks.map(t => (
            <div 
              key={t.id} 
              className="p-4 border border-border rounded-xl bg-sidebar/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/item cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => {
                onViewDetail(t)
                setSelectedTasks(null)
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <div className={cn("w-1.5 h-1.5 rounded-full", t.contentCheck ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10")} />
                   <p className="font-medium text-sm text-white truncate group-hover/item:text-primary transition-colors">{t.task}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <span className="text-[9px] text-muted font-medium opacity-60 flex items-center gap-1.5">
                    <User size={10} className="text-primary/60" /> {t.workerName || 'Unassigned'}
                  </span>
                  <span className="text-[9px] text-muted font-medium opacity-60 flex items-center gap-1.5">
                    <CalendarIcon size={10} className="text-primary/60" /> {t.scheduleDate || 'No Schedule'}
                  </span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <div className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-medium tracking-widest text-center border",
                  t.status === 'Done' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    t.status === 'In Progress' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                      "bg-white/5 text-muted border-white/10"
                )}>
                  {t.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

function ClientListView({ tasks, clients, onSelect }) {
  const activeClients = useMemo(() => {
    return clients.filter(c => c.activeStatus === 'Active' && c.status === 'Onboard')
  }, [clients])

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-12 overflow-y-auto bg-black animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-12 border-b border-white/5 pb-8 gap-6 text-center md:text-left">
          <div className="flex-1">
            <h1 className="page-heading-xl">Intelligence Workspace</h1>
            <p className="text-[10px] sm:text-xs text-muted mt-2 font-medium opacity-50 tracking-widest font-mono">Select a strategic partner identity to initiate deep-dive analysis</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
            <span className="text-white font-medium text-xl lg:text-2xl tabular-nums leading-none tracking-tighter">{activeClients.length}</span>
            <div className="flex flex-col">
              <span className="text-primary text-[8px] font-medium tracking-widest leading-none">Active</span>
              <span className="text-muted text-[8px] font-medium opacity-40 tracking-widest leading-none mt-1">Partners</span>
            </div>
          </div>
        </div>

        {activeClients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {activeClients.map(client => {
              const clientTasks = tasks.filter(t => t.clientId === client.id)
              const doneCount = clientTasks.filter(t => t.status === 'Done').length

              return (
                <button
                  key={client.id}
                  onClick={() => onSelect(client.id)}
                  className="group flex flex-col p-4 sm:p-6 bg-[#0d0d0d] border border-white/5 hover:border-primary/50 transition-all duration-300 text-left rounded-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />

                  <div className="flex items-center gap-4 mb-4 sm:mb-6 relative z-10">
                    <ClientAvatar name={client.name} logo={client.logo} size="md" />
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-primary transition-colors truncate tracking-tight">{client.name}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-auto mb-4 sm:mb-6 relative z-10">
                    <div className="bg-[#111] p-2.5 sm:p-3 rounded-lg border border-white/5">
                      <p className="text-[8px] sm:text-[9px] text-muted font-medium opacity-30 mb-1">Total Assets</p>
                      <p className="text-lg sm:text-xl font-medium text-white tabular-nums leading-none">{clientTasks.length}</p>
                    </div>
                    <div className="bg-[#111] p-2.5 sm:p-3 rounded-lg border border-white/5">
                      <p className="text-[8px] sm:text-[9px] text-muted font-medium opacity-30 mb-1">Completed</p>
                      <p className="text-lg sm:text-xl font-medium text-emerald-400 tabular-nums leading-none">{doneCount}</p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/5 flex items-center justify-between text-[10px] sm:text-xs font-medium text-muted opacity-60 group-hover:text-white transition-all relative z-10">
                    <span>View Full Dashboard</span>
                    <Plus size={14} className="group-hover:translate-x-1 group-hover:rotate-90 transition-all duration-300" />
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState 
              title="No Active Partnerships" 
              description="Deploy new client identities in the Clients Details module to begin tracking tactical operations." 
              icon={Target}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ClientWorks() {
  const { tasks, clients, workers, addTask, updateTask, deleteTask, setHideHeader, setDesktopCollapsed, desktopCollapsed } = useData()
  const { isManager, isJeevan } = useAuth()

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [detailTask, setDetailTask] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isSmallScreen = windowWidth < 640
  const isTablet = windowWidth < 1024

  const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId), [clients, selectedClientId])
  const clientTasks = useMemo(() => tasks.filter(t => t.clientId === selectedClientId), [tasks, selectedClientId])

  const [formValues, setFormValues] = useState({
    task: '',
    status: 'Not Started',
    workerName: '',
    clientApproval: 'Approval',
    takenDate: new Date().toISOString().split('T')[0],
    scheduleDate: '',
    declineDate: '',
    category: 'General'
  })

  useEffect(() => {
    if (showAddModal) {
      if (editTask) {
        setFormValues({ ...editTask })
      } else {
        setFormValues({
          task: '',
          status: 'Not Started',
          workerName: '',
          clientApproval: 'Approval',
          takenDate: new Date().toISOString().split('T')[0],
          scheduleDate: '',
          declineDate: '',
          category: 'General'
        })
      }
    }
  }, [showAddModal, editTask])

  const filteredTasks = useMemo(() => {
    return clientTasks.filter(t => {
      const matchesSearch = !search || t.task?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [clientTasks, search, statusFilter])

  const handleSave = () => {
    const payload = {
      ...formValues,
      clientId: selectedClientId,
      clientName: selectedClient?.name || 'Unknown',
      updatedDate: new Date().toISOString().split('T')[0]
    }
    if (editTask) updateTask(editTask.id, payload)
    else addTask(payload)
    setShowAddModal(false)
    setEditTask(null)
  }

  if (!selectedClientId) {
    return <ClientListView tasks={tasks} clients={clients} onSelect={setSelectedClientId} />
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-background text-white">
      <div className="w-full flex flex-col">
        <DashboardOverview
          title={selectedClient?.name}
          tasks={clientTasks}
          onExpandSidebar={() => setDesktopCollapsed(false)}
          isSidebarCollapsed={desktopCollapsed}
          onBack={() => setSelectedClientId('')}
        />

        <div className="w-full min-w-0">
          <div className="w-full border-b border-border">
            <TaskTable
              tasks={filteredTasks}
              workers={workers}
              onAdd={(task) => { setEditTask(task); setShowAddModal(true); }}
              onUpdateTask={updateTask}
              deleteTask={deleteTask}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onViewDetail={setDetailTask}
              isMobile={isTablet}
            />
          </div>
        </div>

        <div className="min-h-[400px] sm:min-h-[500px] h-[500px] sm:h-[600px] border-b border-border bg-background flex flex-col">
          <CalendarView 
            tasks={clientTasks.filter(t => t.clientApproval === 'Approval' || t.status === 'Done' || t.contentCheck || !t.clientApproval)} 
            onViewDetail={setDetailTask}
            deleteTask={deleteTask}
            isSmallScreen={isSmallScreen}
          />
        </div>

        <div className="py-16 sm:py-24 lg:py-32 flex justify-center bg-[#050505]">
          <button
            onClick={() => setSelectedClientId('')}
            className="group flex items-center gap-4 pl-1.5 pr-8 py-1.5 bg-black/40 hover:bg-black/60 shadow-2xl backdrop-blur-3xl border border-white/10 rounded-full transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowLeft size={18} className="text-black" />
            </div>
            <span className="text-[10px] font-medium text-white/50 group-hover:text-white transition-opacity tracking-widest">Return to Workspace</span>
          </button>
        </div>
      </div>

      <TaskDetailModal isOpen={!!detailTask} task={detailTask} onClose={() => setDetailTask(null)} />
      
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setEditTask(null); }} title={editTask ? "Refine Tactical Asset" : "Initialize New Asset"} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <FormField label="Taken Date">
            <input 
              type="date" 
              value={formValues.takenDate} 
              onChange={e => setFormValues(prev => ({ ...prev, takenDate: e.target.value }))}
              className="input" 
            />
          </FormField>
          
          <FormField label="Tactical Content">
            <input 
              type="text" 
              placeholder="e.g., Brand Short Film" 
              value={formValues.task}
              onChange={e => setFormValues(prev => ({ ...prev, task: e.target.value }))}
              className="input" 
            />
          </FormField>
          
          <FormField label="Personnel Assignment">
            <CustomSelect 
              value={formValues.workerName}
              options={[{ label: 'Unassigned', value: '' }, ...workers.map(w => ({ label: `${w.name} (${w.role})`, value: w.name }))]}
              onChange={val => setFormValues(prev => ({ ...prev, workerName: val }))}
              placeholder="Unassigned"
              isFilter
            />
          </FormField>
          
          <FormField label="Operational Status">
            <StatusSelect 
              value={formValues.status}
              options={['Not Started', 'In Progress', 'Done']}
              onChange={val => setFormValues(prev => ({ ...prev, status: val }))}
              isFilter
            />
          </FormField>
          
          <FormField label="Client Approval">
            <StatusSelect 
              value={formValues.clientApproval}
              options={['Approval', 'Changes']}
              onChange={val => setFormValues(prev => ({ ...prev, clientApproval: val }))}
              isFilter
            />
          </FormField>
          
          <FormField label="Schedule Date">
            <input 
              type="date" 
              value={formValues.scheduleDate}
              onChange={e => setFormValues(prev => ({ ...prev, scheduleDate: e.target.value }))}
              className="input" 
            />
          </FormField>
          
          <FormField label="Decline Date">
            <input 
              type="date" 
              value={formValues.declineDate}
              onChange={e => setFormValues(prev => ({ ...prev, declineDate: e.target.value }))}
              className="input" 
            />
          </FormField>
          
          <FormField label="Strategic Category">
            <input 
              type="text" 
              placeholder="e.g., Branding" 
              value={formValues.category}
              onChange={e => setFormValues(prev => ({ ...prev, category: e.target.value }))}
              className="input" 
            />
          </FormField>

          <div className="md:col-span-2 pt-6 flex items-center gap-3 border-t border-white/5">
            <input
              type="checkbox"
              id="contentCheck"
              className="w-4 h-4 rounded border-white/10 bg-black"
              checked={!!formValues.contentCheck}
              onChange={e => setFormValues(prev => ({ ...prev, contentCheck: e.target.checked }))}
            />
            <label htmlFor="contentCheck" className="text-xs font-medium text-muted cursor-pointer">Mark Content as Verified & Ready</label>
          </div>

          <div className="md:col-span-2 pt-6 flex justify-end gap-3">
            <button onClick={() => setShowAddModal(false)} className="px-6 py-2 rounded-lg text-sm font-medium text-muted hover:bg-white/5 transition-all">Cancel</button>
            <button
              onClick={handleSave}
              className="px-8 py-2 rounded-lg text-sm font-medium bg-primary text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {editTask ? 'Update Intelligence' : 'Deploy Asset'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

