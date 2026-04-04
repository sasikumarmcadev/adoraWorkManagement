import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useData } from '../context/DataContext'
import { formatDate, cn } from '../lib/utils'
import { Plus, Edit2, Filter, Search, Target, Move, Image as ImageIcon, Trash2, Calendar as CalendarIcon, MoreVertical, ArrowLeft, Menu, X, FileText, CheckCircle2, Star } from 'lucide-react'
import { Modal, FormField, SearchBar, StatusSelect, CustomSelect } from '../components/ui/index'

// FullCalendar imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'

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

// --- COVER UPLOADER (Helper Component) ---
function CoverUploader({ onUpload, isNav }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUpload(url)
    }
  }

  if (isNav) {
    return (
      <>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-3 px-3 py-2 text-white text-xs font-medium hover:bg-white/5 rounded-lg transition-colors"
        >
          <ImageIcon size={14} className="text-muted" /> Change Cover Image
        </button>
      </>
    )
  }

  return (
    <>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111]/80 hover:bg-[#222]/90 text-white text-xs font-medium rounded-md backdrop-blur-sm border border-white/10 transition-colors">
        <ImageIcon size={14} /> Change Cover
      </button>
    </>
  )
}

// --- COVER HEADER SECTION ---
function CoverHeader({ title, onExpandSidebar, isSidebarCollapsed }) {
  const [coverData, setCoverData] = useState(() => {
    const saved = localStorage.getItem('videoGrapherCover')
    return saved ? JSON.parse(saved) : {
      img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000',
      positionY: 50
    }
  })

  const [showOptions, setShowOptions] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowOptions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveCover = (data) => {
    setCoverData(data)
    localStorage.setItem('videoGrapherCover', JSON.stringify(data))
    setShowOptions(false)
  }

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(coverData.positionY)
  const containerRef = useRef(null)

  const handlePointerDown = (e) => {
    if (!isDragging) return
    e.target.setPointerCapture(e.pointerId)
    setDragStart(e.clientY)
    setStartY(currentY)
  }

  const handlePointerMove = (e) => {
    if (!isDragging || !e.target.hasPointerCapture(e.pointerId)) return
    const containerHeight = containerRef.current.clientHeight
    const delta = e.clientY - dragStart
    const percentageDelta = (delta / containerHeight) * 100
    let newY = startY - percentageDelta
    if (newY < 0) newY = 0
    if (newY > 100) newY = 100
    setCurrentY(newY)
  }

  const handlePointerUp = (e) => {
    if (!isDragging) return
    e.target.releasePointerCapture(e.pointerId)
  }

  const handleSavePosition = () => {
    setIsDragging(false)
    saveCover({ ...coverData, positionY: currentY })
  }

  if (!coverData.img) {
    return (
      <div className="h-[140px] sm:h-[200px] w-full bg-panel relative flex items-center justify-center group border-b border-border">
        <CoverUploader onUpload={(url) => saveCover({ ...coverData, img: url, positionY: 50 })} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`h-[140px] sm:h-[200px] w-full relative overflow-hidden group border-b border-border ${isDragging ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={coverData.img}
        alt="Cover"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-all duration-300"
        style={{
          objectPosition: `center ${isDragging ? currentY : coverData.positionY}%`,
          filter: showOptions || isDragging ? 'brightness(0.6)' : 'brightness(1)'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      <div className={`absolute top-4 right-6 z-30 transition-opacity duration-300 ${isDragging || showOptions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} ref={menuRef}>
        {isDragging ? (
          <button onClick={handleSavePosition} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-hover text-black text-xs font-medium rounded-full shadow-lg transition-all scale-105">
            Save New Position
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 bg-black/40 hover:bg-black/80 text-white rounded-full backdrop-blur-md border border-white/10 transition-all shadow-xl"
            >
              <MoreVertical size={20} />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-1.5 flex flex-col gap-1">
                  <CoverUploader onUpload={(url) => saveCover({ ...coverData, img: url, positionY: 50 })} isNav />
                  <button
                    onClick={() => { setIsDragging(true); setCurrentY(coverData.positionY); setShowOptions(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-white text-xs font-medium hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Move size={14} className="text-muted" /> Reposition Cover
                  </button>
                  <div className="h-px bg-white/5 mx-2 my-1" />
                  <button
                    onClick={() => saveCover({ ...coverData, img: null })}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-400 text-xs font-medium hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} /> Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!isDragging && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center gap-3 sm:gap-6 z-50 animate-in fade-in slide-in-from-left-4 duration-700">
          {isSidebarCollapsed && (
            <div className="hidden lg:flex items-center gap-2">
              <div className="p-1 px-2 sm:px-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 sm:gap-3 shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dhw6yweku/image/upload/v1756276288/l3kbqtpkrsz2lqshmmmj.png"
                  alt="Logo"
                  className="h-5 w-auto sm:h-6 brightness-110"
                />
                <div className="w-px h-3 sm:h-4 bg-white/10" />
                <button
                  onClick={onExpandSidebar}
                  className="p-1 sm:p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all group"
                  title="Expand Sidebar"
                >
                  <SidebarIcon size={14} className="sm:w-[18px] sm:h-[18px] transition-colors duration-500" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-0">
            <h2 className="text-xl sm:text-2xl font-medium text-white leading-none drop-shadow-2xl tracking-tight">{title}</h2>
          </div>
        </div>
      )}

      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/60 backdrop-blur px-5 py-2.5 rounded-full text-white text-sm font-medium border border-white/20 shadow-2xl">
            Drag image vertically to reposition
          </div>
        </div>
      )}
    </div>
  )
}

function IncentiveCard() {
  return (
    <div className="h-full flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 bg-panel">
      <div className="flex items-center gap-2">
        <Target size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />
        <h3 className="font-medium text-base sm:text-lg">Worker Incentive</h3>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3 sm:p-4">
        <h4 className="text-emerald-400 font-medium mb-1 text-sm sm:text-base">Monthly Target</h4>
        <p className="text-emerald-300 text-xs sm:text-sm font-medium">Achieved = +1000 Bonus</p>
      </div>

      <div className="bg-surface-800/30 p-3 sm:p-4 rounded-md border border-border flex-1">
        <p className="text-[10px] sm:text-xs text-muted tracking-widest mb-2 sm:mb-3 font-medium">Notes</p>
        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border" /> No shortcuts</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border" /> Just standards</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border" /> Deliver excellence</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border" /> Earn more</li>
        </ul>
      </div>
    </div>
  )
}

function VideoGrapherTaskTable({ tasks, onAdd, onUpdateTask, deleteTask, search, setSearch, statusFilter, setStatusFilter, activeFilter, setActiveFilter, onIncentiveClick }) {
  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    progress: tasks.filter(t => t.status === 'In Progress').length,
    workDone: tasks.filter(t => t.contentCheck).length,
    incentive: tasks.filter(t => t.incentiveCheck).length
  }), [tasks])

  const [mobileView, setMobileView] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'text-emerald-400 bg-[#062016] border-[#0a3622]'
      case 'In Progress': return 'text-blue-400 bg-[#0b213f] border-[#0f2d54]'
      case 'Not Started': return 'text-white/60 bg-[#1a1a1a] border-white/10'
      default: return 'text-gray-400 bg-[#111] border-white/5'
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-0 bg-panel">
      <div className="px-4 py-3 bg-[#050505] border-b border-white/5 overflow-x-auto scrollbar-none">
        <div className="flex sm:grid sm:grid-cols-5 gap-2 min-w-max sm:min-w-0">
          <div className="flex-1 min-w-[100px] sm:min-w-0 bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
            <p className="text-[10px] text-muted font-medium tracking-tighter">Total</p>
            <p className="text-sm font-medium text-white leading-none mt-1">{stats.total}</p>
          </div>
          <div className="flex-1 min-w-[100px] sm:min-w-0 bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
            <p className="text-[10px] text-emerald-500/60 font-medium tracking-tighter">Completed</p>
            <p className="text-sm font-medium text-emerald-400 leading-none mt-1">{stats.done}</p>
          </div>
          <div className="flex-1 min-w-[100px] sm:min-w-0 bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
            <p className="text-[10px] text-blue-500/60 font-medium tracking-tighter">In Progress</p>
            <p className="text-sm font-medium text-blue-400 leading-none mt-1">{stats.progress}</p>
          </div>
          <div className="flex-1 min-w-[100px] sm:min-w-0 bg-emerald-500/5 rounded-lg p-2 text-center border border-emerald-500/10">
            <p className="text-[10px] text-emerald-400/60 font-medium tracking-tighter">Work Done</p>
            <p className="text-sm font-medium text-emerald-400 leading-none mt-1">{stats.workDone}</p>
          </div>
          <div className="flex-1 min-w-[100px] sm:min-w-0 bg-blue-500/5 rounded-lg p-2 text-center border border-blue-500/10">
            <p className="text-[10px] text-blue-400/60 font-medium tracking-tighter">Incentives</p>
            <p className="text-sm font-medium text-blue-400 leading-none mt-1">{stats.incentive}</p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-sidebar">
        <div className="w-full sm:flex-1 flex items-center gap-2">
          <div className="flex-1 max-w-[400px] h-[38px]">
            <div className="h-full [&>div]:h-full [&_input]:h-full [&_input]:py-0">
              <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
            </div>
          </div>
          <div className="flex items-center gap-2 h-[38px]">
            <StatusSelect
              value={activeFilter}
              options={[
                { value: 'All', label: 'All Shoots' },
                { value: 'WorkDone', label: 'Work Done' },
                { value: 'Incentive', label: 'Incentive' }
              ]}
              onChange={setActiveFilter}
              isFilter
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="h-[38px]">
            <StatusSelect
              value={statusFilter === 'All' ? 'All Status' : statusFilter}
              options={['All Status', 'Not Started', 'In Progress', 'Done']}
              onChange={(val) => setStatusFilter(val === 'All Status' ? 'All' : val)}
              isFilter
            />
          </div>
          <button
            onClick={onAdd}
            className="h-[38px] group flex-1 md:flex-none flex items-center justify-center gap-3 pl-1.5 pr-6 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <Plus size={16} />
            </div>
            <span className="text-[12px] font-medium text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Task</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {mobileView ? (
          <div className="p-3 space-y-3">
            {(() => {
              let lastDate = '';
              return [...tasks].sort((a, b) => {
                const dateA = a.takenDate || '';
                const dateB = b.takenDate || '';
                if (dateA === dateB) return (b.id || '').localeCompare(a.id || '');
                if (!dateA) return -1;
                if (!dateB) return 1;
                return dateB.localeCompare(dateA);
              }).map((task) => {
                const showDate = task.takenDate !== lastDate;
                lastDate = task.takenDate;

                return (
                  <div key={task.id} className="bg-panel border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-secondary font-medium text-[10px] tracking-wider opacity-50 whitespace-nowrap">Taken Date</span>
                        <span className="text-white font-medium text-sm leading-none mt-1">{showDate ? formatDate(task.takenDate) : <span className="opacity-0">---</span>}</span>
                      </div>
                      <StatusSelect
                        value={task.status}
                        options={['Not Started', 'In Progress', 'Done']}
                        onChange={(newStatus) => onUpdateTask(task.id, { status: newStatus })}
                        getStatusColor={getStatusColor}
                      />
                    </div>

                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 border border-primary/20 text-primary mb-2">
                        {task.clientName}
                      </span>
                      <div className="bg-surface-800/30 p-2.5 rounded-lg border border-white/5">
                        <div className="text-xs text-primary py-0.5 flex items-start gap-2">
                          <span className="opacity-50 mt-1">•</span>
                          <span>{task.task || 'No description'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted pt-3 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="opacity-40 font-medium text-[8px]">Edit Date</span>
                          <span className="text-white/60 font-medium">{formatDate(task.editDate) || '—'}</span>
                        </div>
                        <div className="flex flex-col text-center">
                          <span className="opacity-40 font-medium text-[8px]">Index</span>
                          <span className="text-white/60 font-medium">1</span>
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <button
                          onClick={() => onUpdateTask(task.id, {
                            contentCheck: !task.contentCheck,
                            incentiveCheck: false,
                            updatedDate: new Date().toISOString().split('T')[0],
                          })}
                          className={cn(
                            "w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-90",
                            task.contentCheck
                              ? "bg-emerald-600 border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              : "border-white/10 bg-white/[0.02]"
                          )}
                        >
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full bg-white transition-all duration-300",
                            task.contentCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"
                          )} />
                        </button>
                        <div className="w-px h-5 bg-white/5 mx-0.5" />
                        <button
                          onClick={() => onIncentiveClick(task)}
                          className={cn(
                            "p-2 rounded-full transition-all",
                            task.incentiveCheck ? "text-blue-400 bg-blue-400/10" : "text-muted hover:text-blue-400"
                          )}
                        >
                          <Star size={14} fill={task.incentiveCheck ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => onAdd(task)}
                          className="p-2 text-muted hover:text-primary hover:bg-primary/5 rounded-full transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => { if (confirm('Decommission this asset?')) deleteTask(task.id); }}
                          className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            })()}
            {tasks.length === 0 && <div className="py-12 text-center text-muted">No tasks found...</div>}
          </div>
        ) : (
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted font-medium bg-sidebar border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Client Name</th>
                <th className="px-4 py-3 font-medium">Shoot Details</th>
                <th className="px-4 py-3 font-medium">Decline Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Approval</th>
                <th className="px-4 py-3 font-medium text-center">Work Done</th>
                <th className="px-4 py-3 font-medium text-center">Incentive</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(() => {
                let lastDate = '';
                return [...tasks].sort((a, b) => {
                  const dateA = a.takenDate || '';
                  const dateB = b.takenDate || '';
                  if (dateA === dateB) return (b.id || '').localeCompare(a.id || '');
                  if (!dateA) return -1;
                  if (!dateB) return 1;
                  return dateB.localeCompare(dateA);
                }).map((task, idx) => {
                  const showDate = task.takenDate !== lastDate;
                  lastDate = task.takenDate;

                  return (
                    <tr key={task.id} className="hover:bg-panel transition-colors border-b border-border last:border-0 group/row">
                      <td className="px-4 py-4 text-secondary font-medium min-w-[120px]">
                        {showDate ? (
                          <div className="flex flex-col">
                            <span className="text-white">{formatDate(task.takenDate)}</span>
                            {showDate && <div className="h-px w-full bg-border/50 mt-2 block sm:hidden" />}
                          </div>
                        ) : (
                          <span className="opacity-0 pointer-events-none hidden sm:inline">{formatDate(task.takenDate)}</span>
                        )}
                       </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 border border-primary/20 text-primary">
                          {task.clientName}
                        </span>
                       </td>
                      <td className="px-4 py-4 text-primary max-w-[300px]">
                        <div className="flex items-center gap-1 truncate text-xs opacity-90">
                          • {task.task || 'No description'}
                        </div>
                       </td>
                      <td className="px-4 py-4 text-secondary text-xs">{formatDate(task.declineDate)}</td>
                      <td className="px-4 py-4">
                        <StatusSelect
                          value={task.status}
                          options={['Not Started', 'In Progress', 'Done']}
                          onChange={(newStatus) => onUpdateTask(task.id, { status: newStatus })}
                          getStatusColor={getStatusColor}
                        />
                        </td>
                      <td className="px-4 py-4 text-center">
                        <StatusSelect
                          value={task.clientApproval === 'Approval' ? 'Completed' : (task.clientApproval || 'Completed')}
                          options={['Completed', 'Changes', 'No Changes']}
                          onChange={(newVal) => onUpdateTask(task.id, { clientApproval: newVal === 'Completed' ? 'Approval' : newVal })}
                          getStatusColor={(s) => {
                            if (s === 'Completed') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                            if (s === 'Changes') return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
                            return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                          }}
                        />
                        </td>
                      <td className="px-4 py-4 text-center border-r border-border">
                        <div className="flex justify-center">
                          <button
                            onClick={() => onUpdateTask(task.id, {
                              contentCheck: !task.contentCheck,
                              incentiveCheck: false,
                              updatedDate: new Date().toISOString().split('T')[0],
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
                      <td className="px-4 py-4 text-center border-r border-border">
                        <div className="flex justify-center">
                          <button
                            onClick={() => onIncentiveClick(task)}
                            className={cn(
                              "p-2 rounded-full transition-all duration-300 cursor-pointer active:scale-90",
                              task.incentiveCheck
                                ? "text-blue-400 bg-blue-400/10"
                                : "text-muted hover:text-blue-400 hover:bg-white/5"
                            )}
                          >
                            <Star size={16} fill={task.incentiveCheck ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => onAdd(task)} className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded transition-all"><Plus size={14} /></button>
                          <button onClick={() => { if (confirm('Decommission this asset?')) deleteTask(task.id); }} className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded transition-all"><Trash2 size={14} /></button>
                        </div>
                        </td>
                    </tr>
                  )
                })
              })()}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted">
                    No tasks found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function IncentiveModal({ isOpen, onClose, onSave, task, isReadOnly }) {
  const { evaluationCriteria } = useData()
  const role = task?.workerRole || 'Video Grapher'
  const criteria = evaluationCriteria[role] || evaluationCriteria['Video Grapher'] || []
  
  const [scores, setScores] = useState({})
  const [note, setNote] = useState('')

  useEffect(() => {
    if (task && criteria.length > 0) {
      const initialScores = {}
      criteria.forEach(c => {
        initialScores[c.id] = (task.evaluationScores?.[c.id] || '').toString()
      })
      setScores(initialScores)
      setNote(task.performanceNote || '')
    }
  }, [task, isOpen, criteria])

  const totalMark = useMemo(() =>
    Object.values(scores).reduce((acc, v) => acc + (parseInt(v) || 0), 0)
  , [scores])

  const perf = useMemo(() => {
    if (totalMark >= 90) return { label: 'Top performer',     color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', bonus: 'Full bonus eligible',    barColor: '#34d399', stars: 5 }
    if (totalMark >= 75) return { label: 'Good',              color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', bonus: 'Partial bonus eligible', barColor: '#60a5fa', stars: 4 }
    if (totalMark >= 60) return { label: 'Needs improvement', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', bonus: 'No bonus',               barColor: '#f59e0b', stars: 3 }
    return                      { label: 'Poor performance',  color: '#f87171', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  bonus: 'No bonus',               barColor: '#f87171', stars: 1 }
  }, [totalMark])

  const getCriterionStatus = (val, max) => {
    const pct = (parseInt(val) || 0) / max
    if (pct >= 0.8) return { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)',  icon: <CheckCircle2 size={14} color="#34d399" /> }
    if (pct >= 0.5) return { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.2)',  icon: <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 500, lineHeight: 1 }}>!</span> }
    return                 { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.2)',   icon: <X size={14} color="#f87171" /> }
  }

  const handleScoreChange = (key, value, max) => {
    if (isReadOnly) return
    if (value === '') { setScores(p => ({ ...p, [key]: '' })); return }
    const n = parseInt(value)
    if (!isNaN(n) && n >= 0 && n <= max) setScores(p => ({ ...p, [key]: n.toString() }))
  }

  const handleSave = () => {
    onSave({
      ...task,
      performanceRating: perf.stars,
      incentivePoints: totalMark,
      performanceNote: note,
      evaluationScores: Object.fromEntries(
        criteria.map(c => [c.id, parseInt(scores[c.id]) || 0])
      ),
    })
  }

  const initials = task?.clientName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <style>{`
        .incentive-spin::-webkit-inner-spin-button,
        .incentive-spin::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .incentive-spin { -moz-appearance: textfield; }
        .incentive-step-btn { transition: background 0.15s; }
        .incentive-step-btn:hover { background: rgba(255,255,255,0.07) !important; }
        .incentive-step-btn:active { background: rgba(255,255,255,0.12) !important; transform: scale(0.95); }
      `}</style>

      <div style={{ marginTop: -8 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(59,130,246,0.15)', border: '0.5px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={12} color="#60a5fa" fill="#60a5fa" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{isReadOnly ? 'Evaluation Overview' : 'Performance Evaluation'}</span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            {isReadOnly ? 'Review the recorded assessment details' : 'Score each criterion and generate the incentive report'}
          </p>
        </div>

        {/* ── Target pill ── */}
        <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, color: '#60a5fa', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#fff', margin: 0 }}>{task?.clientName}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{task?.task} · {role}</p>
            </div>
          </div>
          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.25)', color: '#60a5fa', fontWeight: 500, letterSpacing: '0.04em', flexShrink: 0 }}>
            SHOOT
          </span>
        </div>

        {/* ── Criteria rows ── */}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Evaluation Criteria
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {criteria.map(c => {
            const currentVal = parseInt(scores[c.id]) || 0
            const status = getCriterionStatus(scores[c.id], c.max)

            return (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.025)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>

                {/* Label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>{c.sub}</p>
                </div>

                {/* Custom stepper */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', flexShrink: 0, opacity: isReadOnly ? 0.6 : 1 }}>
                  <button
                    className="incentive-step-btn"
                    disabled={isReadOnly}
                    onClick={() => handleScoreChange(c.id, Math.max(0, currentVal - 1).toString(), c.max)}
                    style={{ width: 28, height: 34, background: 'transparent', border: 'none', borderRight: '0.5px solid rgba(255,255,255,0.07)', cursor: isReadOnly ? 'not-allowed' : 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1, flexShrink: 0, padding: 0 }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={c.max}
                    disabled={isReadOnly}
                    value={scores[c.id]}
                    onChange={e => handleScoreChange(c.id, e.target.value, c.max)}
                    className="incentive-spin"
                    style={{ width: 44, height: 34, textAlign: 'center', fontSize: 14, fontWeight: 500, color: '#60a5fa', padding: 0, background: 'transparent', border: 'none', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
                  />
                  <button
                    className="incentive-step-btn"
                    disabled={isReadOnly}
                    onClick={() => handleScoreChange(c.id, Math.min(c.max, currentVal + 1).toString(), c.max)}
                    style={{ width: 28, height: 34, background: 'transparent', border: 'none', borderLeft: '0.5px solid rgba(255,255,255,0.07)', cursor: isReadOnly ? 'not-allowed' : 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1, flexShrink: 0, padding: 0 }}
                  >
                    +
                  </button>
                </div>

                {/* Max label */}
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', minWidth: 28, flexShrink: 0 }}>/ {c.max}</span>

                {/* Status icon */}
                <div style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: status.bg, border: `0.5px solid ${status.border}`, flexShrink: 0, transition: 'background 0.2s, border-color 0.2s' }}>
                  {status.icon}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Score summary ── */}
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '0.5px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 4px' }}>Total score</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 500, color: '#fff', lineHeight: 1 }}>{totalMark}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>/ 100</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: 20, background: perf.bg, border: `0.5px solid ${perf.border}`, marginBottom: 6, transition: 'background 0.3s, border-color 0.3s' }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: perf.color, transition: 'color 0.3s' }}>{perf.label}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginBottom: 4 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={12} color={s <= perf.stars ? perf.color : 'rgba(255,255,255,0.12)'} fill={s <= perf.stars ? perf.color : 'none'} />
              ))}
            </div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{perf.bonus}</p>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ height: '100%', width: `${totalMark}%`, background: perf.barColor, borderRadius: 99, transition: 'width 0.3s ease, background 0.3s ease' }} />
        </div>

        {/* ── Note ── */}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 6px' }}>
          Internal note <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span>
        </p>
        <textarea
          className="input"
          style={{ width: '100%', boxSizing: 'border-box', minHeight: 64, resize: 'none', fontSize: 12, lineHeight: 1.5, marginBottom: 16, opacity: isReadOnly ? 0.6 : 1 }}
          placeholder={isReadOnly ? 'No feedback recorded for this assessment.' : 'Document any specific feedback or shoot variations...'}
          value={note}
          disabled={isReadOnly}
          onChange={e => setNote(e.target.value)}
        />

        {/* ── CTA ── */}
        {!isReadOnly ? (
          <button
            disabled={totalMark === 0}
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '12px',
              background: totalMark === 0 ? 'rgba(37,99,235,0.3)' : '#2563eb',
              border: 'none',
              borderRadius: 10,
              cursor: totalMark === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s, opacity 0.2s',
            }}
            onMouseEnter={e => { if (totalMark > 0) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <CheckCircle2 size={15} color="#fff" />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Finalize evaluation
            </span>
          </button>
        ) : (
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            <ArrowLeft size={14} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Review complete
            </span>
          </button>
        )}

      </div>
    </Modal>
  )
}
function AddTaskModal({ isOpen, onClose, onSave, clients, editTask }) {
  const [form, setForm] = useState({
    takenDate: new Date().toISOString().split('T')[0],
    status: 'Not Started',
    taskCount: 1,
    selectedClients: []
  })

  useEffect(() => {
    if (editTask) {
      if (Array.isArray(editTask)) {
        const first = editTask[0];
        setForm({
          ...first,
          selectedClient: { id: first.clientId, name: first.clientName }
        });
      } else {
        setForm({
          ...editTask,
          selectedClient: { id: editTask.clientId, name: editTask.clientName }
        });
      }
    } else {
      setForm({
        takenDate: new Date().toISOString().split('T')[0],
        status: 'Not Started',
        taskCount: 1,
        selectedClient: null
      })
    }
  }, [editTask, isOpen])

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const selectClient = (client) => {
    setForm(prev => ({ ...prev, selectedClient: client }))
  }

  const handleSave = () => {
    if (!form.selectedClient) {
      alert('Please select a client')
      return
    }

    onSave({
      ...form,
      clientId: form.selectedClient.id,
      clientName: form.selectedClient.name,
      taskCount: 1
    })

    setForm({
      takenDate: new Date().toISOString().split('T')[0],
      status: 'Not Started',
      taskCount: 1,
      selectedClient: null
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Shoot/Task" size="md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <FormField label="Date">
          <input type="date" className="input" value={form.takenDate || ''} onChange={e => f('takenDate', e.target.value)} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Select Client">
            <CustomSelect
              value={form.selectedClient?.id || ''}
              options={clients.map(c => ({ label: c.name, value: c.id }))}
              onChange={(val) => {
                const client = clients.find(c => c.id === val)
                if (client) selectClient({ id: client.id, name: client.name })
              }}
              placeholder="Choose a client..."
              isFilter
            />
          </FormField>
          {form.selectedClient && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-[10px] text-muted font-medium w-full mb-1">Targeting Asset for:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium">
                {form.selectedClient.name}
              </span>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <FormField label="Shoot Details">
            <input className="input" value={form.task || ''} onChange={e => f('task', e.target.value)} placeholder="Task details" />
          </FormField>
        </div>
        <FormField label="Count (Auto)">
          <div className="input bg-white/5 border-white/10 text-primary font-medium flex items-center h-[42px] pointer-events-none">
            {form.selectedClient ? '1' : '0'} Client Selected
          </div>
        </FormField>
        <FormField label="Status">
          <StatusSelect
            value={form.status || 'Not Started'}
            options={['Not Started', 'In Progress', 'Done']}
            onChange={val => f('status', val)}
            isFilter
          />
        </FormField>
        <FormField label="Decline Date (Optional)">
          <input type="date" className="input" value={form.declineDate || ''} onChange={e => f('declineDate', e.target.value)} />
        </FormField>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6 border-t border-white/5 pt-5">
        <button className="btn-secondary w-full sm:w-auto order-1 sm:order-none" onClick={onClose}>Cancel</button>
        <button className="btn-primary w-full sm:w-auto" onClick={handleSave}>{editTask ? 'Add Task' : 'Deploy Asset'}</button>
      </div>
    </Modal>
  )
}

// --- PERFORMANCE EVALUATION SUMMARY POPUP ---
function PerformanceEvaluationModal({ isOpen, onClose, date, tasks }) {
  const dayIncentiveTasks = tasks.filter(t => t.incentiveCheck && (t.takenDate || t.scheduleDate || t.updatedDate) === date)
  const totalPoints = dayIncentiveTasks.reduce((acc, t) => acc + (parseFloat(t.incentivePoints) || 1), 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily Performance" size="sm">
      <div className="space-y-6">
        <div className="bg-panel rounded-2xl p-8 text-center border border-border shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-50" />
          <div className="relative z-10">
            <p className="text-[10px] text-muted uppercase tracking-[0.2em] mb-4 font-bold">Incentive Aggregate</p>
            <div className="text-8xl font-black text-white leading-none tracking-tighter mb-2 animate-in zoom-in duration-500">
              {totalPoints}
            </div>
            <div className="h-1.5 w-12 bg-primary mx-auto rounded-full mb-4 shadow-[0_0_15px_rgba(255,245,0,0.5)]" />
            <p className="text-xs text-muted font-medium italic">{date ? formatDate(date) : ""}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Mark Details</h4>
            <span className="text-[9px] text-muted-foreground/60 italic font-medium">Click to restricted view</span>
          </div>
          <div className="bg-panel border border-border rounded-xl divide-y divide-white/5 overflow-hidden">
            {dayIncentiveTasks.length > 0 ? dayIncentiveTasks.map((t, idx) => (
              <button 
                key={idx} 
                onClick={() => {
                  onClose();
                  // This will be handled by the parent caller who passed the tasks
                  if (typeof window !== 'undefined' && window.__onTaskClick) window.__onTaskClick(t);
                }}
                className="w-full text-left p-4 flex items-start gap-4 hover:bg-white/[0.04] active:bg-white/[0.08] transition-all group"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{t.clientName}</p>
                  <p className="text-[10px] text-muted truncate mt-0.5">{t.task}</p>
                </div>
                <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  +{parseFloat(t.incentivePoints) || 1.0}
                </div>
              </button>
            )) : (
              <div className="p-8 text-center text-muted text-xs italic">
                No evaluation marks found for this date.
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-xl text-xs font-bold text-white tracking-[0.3em] uppercase transition-all active:scale-95"
        >
          Dismiss View
        </button>
      </div>
    </Modal>
  )
}

function CalendarView({ tasks, deleteTask, onTaskClick }) {
  const { desktopCollapsed } = useData()
  const calendarRef = useRef(null)
  const containerRef = useRef(null)
  const [showEvalModal, setShowEvalModal] = useState(false)
  const [evalDate, setEvalDate] = useState('')

  // Expose the task click handler globally for the sub-modal list
  useEffect(() => {
    if (onTaskClick) {
      window.__onTaskClick = onTaskClick
    }
    return () => delete window.__onTaskClick
  }, [onTaskClick])
  
  const events = useMemo(() => {
    const grouped = tasks.reduce((acc, t) => {
      const date = t.takenDate || t.scheduleDate || t.updatedDate;
      if (!acc[date]) acc[date] = { count: 0, incentives: 0 };
      if (t.incentiveCheck) acc[date].incentives += (parseFloat(t.incentivePoints) || 1);
      acc[date].count++;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, data]) => ({
      id: date,
      title: data.incentives > 0 ? data.incentives.toString() : "",
      date: date,
      extendedProps: { incentives: data.incentives, total: data.count }
    }));
  }, [tasks])

  const handleDateClick = (arg) => {
    const dayTasks = tasks.filter(t => t.incentiveCheck && (t.takenDate || t.scheduleDate || t.updatedDate) === arg.dateStr)
    if (dayTasks.length === 1) {
      if (onTaskClick) onTaskClick(dayTasks[0])
    } else if (dayTasks.length > 1) {
      setEvalDate(arg.dateStr)
      setShowEvalModal(true)
    }
  }

  const renderEventContent = (eventInfo) => {
    const pts = parseInt(eventInfo.event.title)
    if (!pts || isNaN(pts)) return null
    return (
      <div className="w-full h-full flex items-center justify-center py-2 group">
        <span className="text-2xl sm:text-3xl font-black text-white/20 hover:text-white transition-colors cursor-pointer select-none">
          {pts}
        </span>
      </div>
    )
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

  return (
    <div id="calendar-view" className="w-full flex-1 p-0 overflow-hidden flex flex-col bg-panel">
      <style>{`
        .fc { background: transparent !important; }
        .fc-theme-standard td, .fc-theme-standard th { border: none !important; }
        .fc-col-header-cell { background: #080808 !important; font-size: 10px !important; font-weight: 500 !important; color: rgba(255,255,255,0.3) !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; padding: 12px 0 !important; border: none !important; }
        .fc-header-toolbar { margin: 0 !important; padding: 1.25rem !important; border: none !important; background: #050505 !important; }
        .fc-toolbar-title { color: #fff !important; font-size: 13px !important; font-weight: 600 !important; letter-spacing: 0.05em; }
        .fc-button-primary { background: #0c0c0c !important; border: 1px solid rgba(255,255,255,0.08) !important; color: #fff !important; text-transform: capitalize !important; border-radius: 99px !important; padding: 5px 14px !important; font-size: 10px !important; font-weight: 600 !important; transition: all 0.2s !important; }
        .fc-button-primary:hover { border-color: rgba(255,255,255,0.2) !important; background: #111 !important; }
        .fc-button-active { background: #fff !important; color: #000 !important; border-color: #fff !important; }
        .fc-day-today { background: rgba(255, 255, 255, 0.02) !important; }
        .fc-day-today .fc-daygrid-day-number { color: #fff !important; font-weight: 800 !important; opacity: 1 !important; }
        .fc-daygrid-day-number { font-size: 11px !important; font-weight: 500 !important; opacity: 0.2 !important; padding: 10px !important; }
        .fc-scrollgrid { border: none !important; }
        .fc-daygrid-day { border: none !important; }
        .fc-scroller { scrollbar-width: none !important; }
        .fc-scroller::-webkit-scrollbar { display: none !important; }

        @media (max-width: 768px) {
          .fc-daygrid-day-frame { min-height: 80px !important; }
        }
      `}</style>

      <div className="p-3 sm:p-5 border-b border-border bg-sidebar">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
              <Star size={18} className="text-white/40" />
              Performance Calendar
            </h2>
            <p className="text-[10px] text-muted mt-0.5 uppercase tracking-widest">Total incentive points per day</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Score Tracker</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="p-0 bg-panel flex-1 overflow-auto scrollbar-none">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={(info) => handleDateClick({ dateStr: info.event.startStr })}
          eventContent={renderEventContent}
          headerToolbar={{ left: 'prev,next', center: 'title', right: 'today' }}
          height="auto"
        />
      </div>

      <PerformanceEvaluationModal
        isOpen={showEvalModal}
        onClose={() => setShowEvalModal(false)}
        date={evalDate}
        tasks={tasks}
      />
    </div>
  )
}

function VideoGrapherListView({ tasks, onSelect }) {
  const { workers } = useData()
  const [searchGrapher, setSearchGrapher] = useState('')

  const videoGraphers = useMemo(() => {
    const names = Array.from(new Set(workers.filter(w => w.role === 'Video Grapher').map(w => w.name)))
    const filtered = names.filter(name => name.toLowerCase().includes(searchGrapher.toLowerCase()))
    return filtered.sort((a, b) => {
      const wA = workers.find(w => w.name === a)
      const wB = workers.find(w => w.name === b)
      if (wA?.isTeamLead && !wB?.isTeamLead) return -1
      if (!wA?.isTeamLead && wB?.isTeamLead) return 1
      return a.localeCompare(b)
    })
  }, [workers, searchGrapher])

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 border-b border-border pb-4 gap-3">
          <div>
            <h1 className="page-heading-lg">Video Grapher Management</h1>
            <p className="text-xs sm:text-sm text-muted mt-1">Select a video grapher to view their schedule and shoots</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md">
            <span className="text-primary font-medium text-sm sm:text-base">{videoGraphers.length}</span>
            <span className="text-muted text-[10px] sm:text-xs ml-2 tracking-wider">Active Professionals</span>
          </div>
        </div>

        <div className="mb-6">
          <SearchBar value={searchGrapher} onChange={setSearchGrapher} placeholder="Search video graphers by name..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videoGraphers.map(name => {
            const grapherTasks = tasks.filter(t => t.workerName === name && t.workerRole === 'Video Grapher')
            const stats = {
              total: grapherTasks.length,
              pending: grapherTasks.filter(t => t.status !== 'Done').length,
              done: grapherTasks.filter(t => t.status === 'Done').length
            }

            return (
              <button
                key={name}
                onClick={() => onSelect(name)}
                className="group flex flex-col p-4 sm:p-6 bg-panel border border-border hover:border-primary/50 transition-all text-left rounded-lg hover:shadow-xl hover:scale-[1.02] duration-200"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-800 border border-border flex items-center justify-center text-primary font-medium text-base sm:text-lg overflow-hidden group-hover:scale-110 transition-transform">
                    {workers.find(w => w.name === name)?.avatar?.startsWith('http') ? (
                      <img src={workers.find(w => w.name === name).avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-primary transition-colors">{name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] sm:text-[10px] text-muted tracking-widest font-medium">Capture Specialist</p>
                      {workers.find(w => w.name === name)?.level && (
                        <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
                          {workers.find(w => w.name === name).level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <div className="bg-[#111] p-2 rounded border border-white/5 text-center">
                    <p className="text-[8px] text-muted font-medium mb-0.5">Shoots</p>
                    <p className="text-sm font-medium text-white">{stats.total}</p>
                  </div>
                  <div className="bg-[#111] p-2 rounded border border-white/5 text-center">
                    <p className="text-[8px] text-muted font-medium mb-0.5">Pending</p>
                    <p className="text-sm font-medium text-orange-400">{stats.pending}</p>
                  </div>
                  <div className="bg-[#111] p-2 rounded border border-white/5 text-center">
                    <p className="text-[8px] text-muted font-medium mb-0.5">Done</p>
                    <p className="text-sm font-medium text-emerald-400">{stats.done}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-end text-[10px] text-muted">
                  <span className="group-hover:translate-x-1 transition-transform text-primary text-[10px] font-medium">View Dashboard →</span>
                </div>
              </button>
            )
          })}
        </div>

        {videoGraphers.length === 0 && (
          <div className="text-center py-12 text-muted">
            No video graphers found matching your search
          </div>
        )}
      </div>
    </div>
  )
}

function DayWiseWorkList({ tasks }) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const workDoneTasks = useMemo(() => {
    return tasks.filter(task => task.contentCheck === true)
  }, [tasks])

  const allDatesInMonth = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const dates = []
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }, [viewYear, viewMonth])

  const groupedByDate = useMemo(() => {
    const grouped = new Map()
    workDoneTasks.forEach(task => {
      const date = task.takenDate || task.scheduleDate || task.updatedDate
      if (!date) return
      if (!grouped.has(date)) grouped.set(date, [])
      grouped.get(date).push(task)
    })
    return allDatesInMonth.map(date => ({
      date,
      tasks: grouped.get(date) || []
    }))
  }, [workDoneTasks, allDatesInMonth])

  // ── Solid saturated badge palette ──
  const clientColorMap = useMemo(() => {
    const palette = [
      { bg: '#DBEAFE', text: '#1E40AF' }, // soft blue
{ bg: '#DCFCE7', text: '#15803D' }, // soft green
{ bg: '#FEF3C7', text: '#92400E' }, // soft amber
{ bg: '#FCE7F3', text: '#9D174D' }, // soft pink
{ bg: '#EDE9FE', text: '#5B21B6' }, // soft purple
{ bg: '#CFFAFE', text: '#155E75' }, // soft cyan
{ bg: '#FFEDD5', text: '#9A3412' }, // soft orange
{ bg: '#ECFCCB', text: '#3F6212' }, // soft lime
    ]
    const map = new Map()
    let idx = 0
    workDoneTasks.forEach(task => {
      if (task.clientName && !map.has(task.clientName)) {
        map.set(task.clientName, palette[idx % palette.length])
        idx++
      }
    })
    return map
  }, [workDoneTasks])

  const getClientColor = (name) =>
    clientColorMap.get(name) || { bg: '#4B5563', text: '#ffffff' }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
  const todayStr = now.toISOString().split('T')[0]
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()

  const monthWorkCount = useMemo(() =>
    groupedByDate.reduce((acc, g) => acc + g.tasks.length, 0)
  , [groupedByDate])

  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const goToNext = () => {
    if (isCurrentMonth) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const goToCurrentMonth = () => {
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
  }

  const renderClientBadges = (group) => {
    const clientGroups = new Map()
    group.tasks.forEach(task => {
      if (!clientGroups.has(task.clientName)) clientGroups.set(task.clientName, [])
      clientGroups.get(task.clientName).push(task)
    })
    return Array.from(clientGroups.entries()).map(([clientName]) => {
      const color = getClientColor(clientName)
      return (
        <span
          key={clientName}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
          style={{ backgroundColor: color.bg, color: color.text }}
        >
          {clientName}
        </span>
      )
    })
  }

  return (
    <div className="w-full bg-panel">

      {/* ── Header ── */}
      <div className="px-3 sm:px-4 py-3 bg-sidebar border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex-shrink-0 w-1 h-5 bg-emerald-500 rounded-full" />
            <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
              DAY WISE WORK LIST
            </h2>
          </div>
          <div className="flex-shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="text-[10px] font-medium text-emerald-400 whitespace-nowrap">
              {monthWorkCount} Completed
            </span>
          </div>
        </div>
        <p className="text-[10px] text-muted mt-1 ml-3">Work completed tasks grouped by date</p>
      </div>

      {/* ── Month Navigation ── */}
      <div className="px-3 sm:px-4 py-2 bg-[#0a0a0a] border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={goToPrev}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all active:scale-95"
          >
            <ArrowLeft size={11} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide text-center">
              {monthLabel}
            </span>
            {!isCurrentMonth && (
              <button
                onClick={goToCurrentMonth}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all whitespace-nowrap active:scale-95"
              >
                <CalendarIcon size={9} />
                <span>Today</span>
              </button>
            )}
          </div>

          <button
            onClick={goToNext}
            disabled={isCurrentMonth}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all active:scale-95 ${
              isCurrentMonth
                ? 'text-muted/20 border-white/5 cursor-not-allowed'
                : 'text-muted hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowLeft size={11} className="rotate-180" />
          </button>
        </div>
      </div>

      {/* ── Mobile Card List ── */}
      {isMobile ? (
        <div className="divide-y divide-border/40">
          {groupedByDate.map((group) => {
            const isToday = group.date === todayStr

            if (group.tasks.length === 0) {
              return (
                <div
                  key={group.date}
                  className={`flex items-center justify-between px-4 py-3 ${isToday ? 'bg-blue-500/5' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isToday ? 'text-blue-400' : 'text-white/60'}`}>
                      {formatDate(group.date)}
                    </span>
                    {isToday && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-muted/40 text-sm leading-none">—</span>
                </div>
              )
            }

            return (
              <div key={group.date} className={`${isToday ? 'bg-blue-500/5' : ''}`}>
                {/* Date Row */}
                <div className="flex items-center px-4 py-3 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isToday ? 'text-blue-400' : 'text-white'}`}>
                      {formatDate(group.date)}
                    </span>
                    {isToday && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                        Today
                      </span>
                    )}
                  </div>
                </div>
                {/* Client Badges Row */}
                <div className="px-4 py-2.5 flex flex-wrap gap-2">
                  {renderClientBadges(group)}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── Desktop Table ── */
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-muted font-semibold bg-[#0a0a0a] border-b border-border">
              <tr>
                <th className="px-4 py-2.5 font-medium uppercase tracking-wider w-[140px]">Date</th>
                <th className="px-4 py-2.5 font-medium uppercase tracking-wider">Category</th>
                <th className="px-4 py-2.5 font-medium uppercase tracking-wider text-center w-[80px]">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {groupedByDate.map((group) => {
                const isToday = group.date === todayStr

                if (group.tasks.length === 0) {
                  return (
                    <tr key={group.date} className={`transition-colors ${isToday ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}`}>
                      <td className="px-4 py-2 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className={isToday ? 'text-blue-400 font-semibold' : 'text-white/60'}>
                            {formatDate(group.date)}
                          </span>
                          {isToday && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                              Today
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-muted/40 text-xs">—</td>
                      <td className="px-4 py-2 text-center">
                        <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-white/5 border border-white/10 text-muted/40 text-[10px] font-semibold">
                          0
                        </span>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr key={group.date} className={`transition-colors ${isToday ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}`}>
                    <td className="px-4 py-2.5 text-xs font-medium align-middle w-[140px]">
                      <div className="flex items-center gap-2">
                        <span className={isToday ? 'text-blue-400 font-semibold' : 'text-white'}>
                          {formatDate(group.date)}
                        </span>
                        {isToday && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                            Today
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="flex flex-wrap gap-2">
                        {renderClientBadges(group)}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center align-middle">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                        {group.tasks.length}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function VideoGrapherPage() {
  const { tasks, addTask, updateTask, deleteTask, clients, setHideHeader, setDesktopCollapsed, desktopCollapsed } = useData()
  const [selectedGrapher, setSelectedGrapher] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeFilter, setActiveFilter] = useState('All')
  const [incentiveTask, setIncentiveTask] = useState(null)
  const [viewOnlyIncentive, setViewOnlyIncentive] = useState(false)
  const [activeTab, setActiveTab] = useState('shoots')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setHideHeader(!!selectedGrapher)
    return () => setHideHeader(false)
  }, [selectedGrapher, setHideHeader])

  const grapherTasks = useMemo(() => tasks.filter(t => {
    const isOwner = (t.workerRole === 'Video Grapher' || t.workerName === selectedGrapher) && (!selectedGrapher || t.workerName === selectedGrapher)
    if (!isOwner) return false

    const matchesSearch = !search ||
      t.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      t.task?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter

    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'WorkDone' && t.contentCheck) ||
      (activeFilter === 'Incentive' && t.incentiveCheck)

    return matchesSearch && matchesStatus && matchesFilter
  }), [tasks, selectedGrapher, search, statusFilter, activeFilter])

  const handleSaveIncentive = (performanceData) => {
    updateTask(performanceData.id, {
      ...performanceData,
      incentiveCheck: true,
      contentCheck: false,
      updatedDate: new Date().toISOString().split('T')[0]
    })
    setIncentiveTask(null)
  }

  const handleAddTask = (form) => {
    if (form.id) {
      updateTask(form.id, form)
    } else {
      addTask({
        ...form,
        workerRole: 'Video Grapher',
        workerName: selectedGrapher,
        clientName: form.clientName,
        clientApproval: 'Approval',
        updatedDate: new Date().toISOString().split('T')[0]
      })
    }
    setShowAddModal(false)
    setEditTask(null)
  }

  const handleCalendarPerformanceClick = (task) => {
    setIncentiveTask(task)
    setViewOnlyIncentive(true)
  }

  const handleExpandSidebar = () => {
    setDesktopCollapsed(false)
  }

  if (!selectedGrapher) {
    return <VideoGrapherListView tasks={tasks} onSelect={setSelectedGrapher} />
  }

  return (
    <div className={`w-full flex-1 flex flex-col p-0 m-0 overflow-hidden ${selectedGrapher ? 'h-screen' : ''}`}>
      <div className="flex-none sticky top-0 z-40 bg-background shadow-2xl">
        <CoverHeader
          title={selectedGrapher}
          onExpandSidebar={handleExpandSidebar}
          isSidebarCollapsed={desktopCollapsed}
        />
      </div>

      <div className="flex-1 overflow-y-auto relative">
        <div className="w-full flex flex-col px-0">
          
          {/* MOBILE TABS SWITCHER */}
          {isMobile && (
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 p-1 flex items-center gap-1 overflow-x-auto scrollbar-none no-scrollbar">
              {[
                { id: 'shoots', label: 'Daily Shoots', icon: <Target size={14} /> },
                { id: 'worklist', label: 'Analytics', icon: <FileText size={14} /> },
                { id: 'performance', label: 'Performance', icon: <Star size={14} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                    : 'text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* DESKTOP LAYOUT (Full) OR MOBILE LAYOUT (Tabbed) */}
          {(!isMobile || activeTab === 'shoots') && (
            <div className={`${!isMobile ? 'flex flex-col lg:grid lg:grid-cols-4' : 'flex flex-col'} gap-0 mb-0 flex-none border-b border-border`}>
              {!isMobile && (
                <div className="w-full lg:col-span-1 border-b lg:border-b-0 lg:border-r border-border bg-sidebar/50">
                  <IncentiveCard />
                </div>
              )}
              <div className={`w-full ${!isMobile ? 'lg:col-span-3' : ''} min-w-0 overflow-hidden`}>
                <VideoGrapherTaskTable
                  tasks={grapherTasks}
                  onAdd={(task) => { setEditTask(task); setShowAddModal(true); }}
                  onUpdateTask={updateTask}
                  deleteTask={deleteTask}
                  search={search}
                  setSearch={setSearch}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  onIncentiveClick={(task) => { setIncentiveTask(task); setViewOnlyIncentive(false); }}
                />
              </div>
            </div>
          )}
          
          {(!isMobile || activeTab === 'worklist') && (
            <div className="w-full border-b border-border">
              <DayWiseWorkList tasks={grapherTasks} />
            </div>
          )}
          
          {(!isMobile || activeTab === 'performance') && (
            <div className="flex flex-col">
              {isMobile && (
                <div className="border-b border-border">
                   <IncentiveCard />
                </div>
              )}
              <div className="min-h-[400px] sm:min-h-[500px] h-[500px] sm:h-[600px] flex flex-col">
                <CalendarView
                  tasks={grapherTasks}
                  deleteTask={deleteTask}
                  onTaskClick={handleCalendarPerformanceClick}
                />
              </div>
            </div>
          )}

          {/* MOBILE FLOATING ACTION BUTTON */}
          {isMobile && activeTab === 'shoots' && (
            <button
              onClick={() => { setEditTask(null); setShowAddModal(true); }}
              className="fixed bottom-6 right-6 w-11 h-11 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-50 animate-in zoom-in-50 duration-300"
            >
              <Plus size={22} />
            </button>
          )}

          {/* BACK BUTTON AT BOTTOM - Adjusted for mobile */}
          <div className={`p-10 ${isMobile ? 'pb-20' : 'lg:p-20'} flex justify-center bg-background`}>
            <button
              onClick={() => setSelectedGrapher(null)}
              className="group flex items-center gap-2 sm:gap-4 pl-1.5 pr-4 sm:pr-8 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full transition-all"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-primary transition-colors">
                <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px] text-black" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">Back</span>
            </button>
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditTask(null); }}
        onSave={handleAddTask}
        clients={clients}
        editTask={editTask}
      />

      <IncentiveModal
        isOpen={!!incentiveTask}
        onClose={() => setIncentiveTask(null)}
        onSave={handleSaveIncentive}
        task={incentiveTask}
        isReadOnly={viewOnlyIncentive}
      />

    </div>
  )
}