import { useState, useRef, useEffect, useMemo } from 'react'
import { useData } from '../context/DataContext'
import { formatDate, cn } from '../lib/utils'
import { Modal, FormField, SearchBar, StatusSelect, CustomSelect } from '../components/ui/index'
import { Star, CheckCircle2, Bookmark, ArrowLeft } from 'lucide-react'

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

// --- WORK DONE SVG ICON ---
const WorkDoneIcon = ({ size = 12, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    width={size}
    height={size}
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    const saved = localStorage.getItem('softwareDeveloperCover')
    return saved ? JSON.parse(saved) : {
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000',
      positionY: 50
    }
  })

  const [showOptions, setShowOptions] = useState(false)
  const menuRef = useRef(null)

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowOptions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const saveCover = (data) => {
    setCoverData(data)
    localStorage.setItem('softwareDeveloperCover', JSON.stringify(data))
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

function TaskTable({ tasks, onAdd, onUpdateTask, deleteTask, search, setSearch, statusFilter, setStatusFilter, activeFilter, setActiveFilter, onIncentiveClick }) {
  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    progress: tasks.filter(t => t.status === 'In Progress').length,
    workDone: tasks.filter(t => t.contentCheck).length,
    incentives: tasks.filter(t => t.incentiveCheck).length
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
      {/* Task Stats Row */}
      <div className="px-4 py-3 bg-[#050505] border-b border-white/5 overflow-x-auto scrollbar-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 min-w-[400px]">
          <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
            <p className="text-[10px] text-muted font-medium tracking-tighter">Total</p>
            <p className="text-sm font-medium text-white leading-none mt-1">{stats.total}</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
            <p className="text-[10px] text-emerald-500/60 font-medium tracking-tighter">Completed</p>
            <p className="text-sm font-medium text-emerald-400 leading-none mt-1">{stats.done}</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-2 text-center border border-white/5">
            <p className="text-[10px] text-blue-500/60 font-medium tracking-tighter">In Progress</p>
            <p className="text-sm font-medium text-blue-400 leading-none mt-1">{stats.progress}</p>
          </div>
          <div className="bg-emerald-500/5 rounded-lg p-2 text-center border border-emerald-500/10">
            <p className="text-[10px] text-emerald-400/60 font-medium tracking-tighter">Work Done</p>
            <p className="text-sm font-medium text-emerald-400 leading-none mt-1">{stats.workDone}</p>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-2 text-center border border-blue-500/10">
            <p className="text-[10px] text-blue-400/60 font-medium tracking-tighter">Incentives</p>
            <p className="text-sm font-medium text-blue-400 leading-none mt-1">{stats.incentives}</p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-sidebar">
        <div className="w-full sm:flex-1 flex items-center gap-2">
          <div className="flex-1 max-w-[400px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-sidebar border border-white/10 rounded-md py-2 px-3 text-xs font-medium text-white outline-none focus:border-primary/40 transition-all h-[38px] appearance-none"
              style={{ backgroundImage: 'linear-gradient(45deg, transparent 50%, #444 50%), linear-gradient(135deg, #444 50%, transparent 50%)', backgroundPosition: 'calc(100% - 15px) center, calc(100% - 10px) center', backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}
            >
              <option value="All">All Projects</option>
              <option value="WorkDone">Work Done</option>
              <option value="Incentive">Incentive</option>
            </select>

          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onAdd}
            className="group flex items-center justify-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <Plus size={18} />
            </div>
            <span className="text-[12px] font-medium text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Project</span>
          </button>
          <div className="relative">
            <StatusSelect
              value={statusFilter === 'All' ? 'All Status' : statusFilter}
              options={['All Status', 'Not Started', 'In Progress', 'Done']}
              onChange={(val) => setStatusFilter(val === 'All Status' ? 'All' : val)}
              isFilter
            />
          </div>
          <a href="#calendar-view" className="btn-ghost py-1.5 px-3 text-xs sm:text-sm whitespace-nowrap">
            <CalendarIcon size={12} className="sm:w-[14px] sm:h-[14px]" /> Calendar View
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {mobileView ? (
          <div className="p-3 space-y-3">
            {(() => {
              let lastDate = '';
              return [...tasks].sort((a, b) => (b.takenDate || '').localeCompare(a.takenDate || '')).map((task) => {
                const showDate = task.takenDate !== lastDate;
                lastDate = task.takenDate;

                return (
                  <div key={task.id} className="bg-panel border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-secondary font-medium text-[10px]  tracking-wider opacity-50 whitespace-nowrap">Taken Date</span>
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
                          <span className="opacity-40  font-medium text-[8px]">Decline Date</span>
                          <span className="text-white/60 font-medium">{formatDate(task.declineDate) || '—'}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="opacity-40  font-medium text-[8px]">Work Done</span>
                          <button
                            onClick={() => onUpdateTask(task.id, {
                              contentCheck: !task.contentCheck,
                              updatedDate: new Date().toISOString().split('T')[0],
                            })}
                            className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center transition-all mt-1",
                              task.contentCheck ? "bg-emerald-600 border-emerald-600" : "border-white/10"
                            )}
                          >
                            <div className={cn("w-1 h-1 rounded-full bg-white", task.contentCheck ? "scale-100" : "scale-0")} />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-1">
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
                <th className="px-4 py-3 font-medium">Project Name</th>
                <th className="px-4 py-3 font-medium">Decline Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Approval</th>
                <th className="px-4 py-3 font-medium text-center">Work Done</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(() => {
                let lastDate = '';
                return [...tasks].sort((a, b) => (b.takenDate || '').localeCompare(a.takenDate || '')).map((task, idx) => {
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
                    No projects found...
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

function IncentiveModal({ isOpen, onClose, onSave, task }) {
  const [scores, setScores] = useState({
    speed: '',
    quality: '',
    creativity: '',
    deadline: ''
  })
  const [note, setNote] = useState('')

  useEffect(() => {
    if (task) {
      setScores({
        speed: (task.evaluationScores?.speed || '').toString(),
        quality: (task.evaluationScores?.quality || '').toString(),
        creativity: (task.evaluationScores?.creativity || '').toString(),
        deadline: (task.evaluationScores?.deadline || '').toString()
      })
      setNote(task.performanceNote || '')
    } else {
      setScores({ speed: '', quality: '', creativity: '', deadline: '' })
      setNote('')
    }
  }, [task, isOpen])

  const totalMark = useMemo(() => {
    return Object.values(scores).reduce((acc, val) => acc + (parseInt(val) || 0), 0)
  }, [scores])

  const performanceCategory = useMemo(() => {
    if (totalMark >= 90) return { label: 'Top Performer', color: 'text-emerald-400', bg: 'bg-emerald-400/10', bonus: 'Full BonusEligible' }
    if (totalMark >= 75) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-400/10', bonus: 'Partial Bonus' }
    if (totalMark >= 60) return { label: 'Needs Improvement', color: 'text-orange-400', bg: 'bg-orange-400/10', bonus: 'No Bonus' }
    return { label: 'Poor Performance', color: 'text-red-400', bg: 'bg-red-400/10', bonus: 'No Bonus' }
  }, [totalMark])

  const autoStars = Math.min(5, Math.ceil(totalMark / 20))

  const handleSave = () => {
    onSave({
      ...task,
      performanceRating: autoStars,
      incentivePoints: totalMark,
      performanceNote: note,
      incentiveCheck: true,
      contentCheck: false,
      evaluationScores: {
        speed: parseInt(scores.speed) || 0,
        quality: parseInt(scores.quality) || 0,
        creativity: parseInt(scores.creativity) || 0,
        deadline: parseInt(scores.deadline) || 0
      },
      updatedDate: new Date().toISOString().split('T')[0]
    })
    onClose()
  }

  const handleScoreChange = (key, value, max) => {
    const val = parseInt(value)
    if (value === '' || (val >= 0 && val <= max)) {
      setScores(prev => ({ ...prev, [key]: value }))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Developer Performance Evaluation" size="md">
      <div className="space-y-6 mt-4">
        <div className="bg-[#050505] p-3.5 rounded-xl border border-white/5 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[9px] text-muted uppercase tracking-widest font-bold mb-0.5 opacity-50">Target Sprint/Project</p>
            <p className="text-sm font-semibold text-white truncate">{task?.clientName}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">Software</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between text-[10px] text-muted uppercase tracking-widest mb-1 px-1">
            <span>Criteria Question</span>
            <span>Marks / Max</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'speed', label: 'Feature Delivery & Execution', max: 25 },
              { id: 'quality', label: 'Code Quality (Bug-Free)', max: 25 },
              { id: 'creativity', label: 'Architecture & Scalability', max: 25 },
              { id: 'deadline', label: 'Sprint Discipline (On Time)', max: 25 }
            ].map((c) => (
              <div key={c.id} className="flex items-center gap-4 bg-sidebar/30 p-3 rounded-lg border border-white/[0.03]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/90">{c.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-16 h-[34px] bg-[#0a0a0a] border border-white/10 rounded-md text-center text-sm font-bold text-blue-400 focus:border-blue-500/50 outline-none transition-all"
                    placeholder="0"
                    value={scores[c.id]}
                    onChange={(e) => handleScoreChange(c.id, e.target.value, c.max)}
                  />
                  <span className="text-[10px] text-muted font-bold w-6">/{c.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#050505] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/20" />

          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="text-center sm:text-left">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1 opacity-50">Total Performance Score</p>
              <div className="flex items-end gap-1 justify-center sm:justify-start">
                <span className="text-4xl font-bold text-white leading-none">{totalMark}</span>
                <span className="text-sm font-bold text-muted mb-1">/ 100</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${performanceCategory.bg} border border-white/5 text-center`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${performanceCategory.color}`}>{performanceCategory.label}</p>
              <p className="text-xs font-bold text-white">{performanceCategory.bonus}</p>
              <div className="flex justify-center mt-2.5 gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={10} fill={s <= autoStars ? "currentColor" : "none"} className={s <= autoStars ? performanceCategory.color : "text-white/10"} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <FormField label="Internal Performance Review Note (Optional)">
          <textarea
            className="input min-h-[80px] py-3 h-auto resize-none bg-[#0a0a0a]/50 text-xs"
            placeholder="Document any technical challenges or wins..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </FormField>

        <div className="pt-2">
          <button
            disabled={totalMark === 0}
            onClick={handleSave}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95"
          >
            <CheckCircle2 size={16} />
            Finalize Evaluation
          </button>
        </div>
      </div>
    </Modal>
  )
}

function AddTaskModal({ isOpen, onClose, onSave, clients, editTask }) {
  const [form, setForm] = useState({
    takenDate: new Date().toISOString().split('T')[0],
    status: 'Not Started',
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
      selectedClient: null
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project/Task" size="md">
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
          <FormField label="Project Name">
            <input className="input" value={form.task || ''} onChange={e => f('task', e.target.value)} placeholder="Project details" />
          </FormField>
        </div>
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
        <button className="btn-primary w-full sm:w-auto" onClick={handleSave}>{editTask ? 'Update Project' : 'Launch Project'}</button>
      </div>
    </Modal>
  )
}


function CalendarView({ tasks, deleteTask }) {
  const { desktopCollapsed } = useData()
  const calendarRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedTasks, setSelectedTasks] = useState(null)
  const events = useMemo(() => {
    // Group tasks by Date + ClientName to show only one entry per client per day in calendar
    const grouped = [...tasks].reduce((acc, t) => {
      const date = t.takenDate || t.scheduleDate || t.updatedDate;
      const type = t.contentCheck ? 'work' : 'done';
      const key = `${date}-${t.clientName}-${type}`;
      if (!acc[key]) {
        acc[key] = { ...t, date, count: 1, allCompleted: t.contentCheck };
      } else {
        acc[key].count++;
        acc[key].allCompleted = acc[key].allCompleted || t.contentCheck;
      }
      return acc;
    }, {});

    return Object.values(grouped).map(t => ({
      id: t.id,
      title: (t.allCompleted ? `WORK: ${t.clientName}` : `DONE: ${t.clientName}`) + ` (${t.count})`,
      date: t.date,
      extendedProps: { ...t },
      backgroundColor: t.allCompleted ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
      textColor: t.allCompleted ? '#34d399' : '#a1a1aa',
      borderColor: t.allCompleted ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.2)'
    }));
  }, [tasks])

  const handleDateClick = (arg) => {
    const api = calendarRef.current?.getApi()
    if (api && api.view.type === 'multiMonthYear') {
      api.changeView('dayGridMonth', arg.date)
      return
    }

    const dayTasks = tasks.filter(t => (t.takenDate || t.scheduleDate || t.updatedDate) === arg.dateStr)
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
      if (api) api.updateSize()
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
        .fc-button-primary { background-color: var(--bg-card) !important; border-color: var(--border) !important; color: var(--text-primary) !important; text-transform: capitalize !important; border-radius: 0.25rem !important; padding: 0.3rem 0.5rem !important; font-size: 0.7rem !important; }
        .fc-button-primary:hover { background-color: var(--border) !important; }
        .fc-button-active { background-color: var(--text-primary) !important; color: var(--bg-primary) !important; }
        .fc-day-today { background-color: rgba(255, 255, 255, 0.05) !important; }
        .fc-event { 
          border-radius: 9999px !important; 
          font-size: 8px !important; 
          padding: 3px 6px !important; 
          cursor: pointer !important; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis; 
          font-weight: 800 !important;
          text-transform:  !important;
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

      <div className="p-3 sm:p-5 border-b border-border bg-sidebar">
        <h2 className="text-base sm:text-lg font-medium text-primary">Development Roadmap</h2>
      </div>

      <div ref={containerRef} className="p-0 bg-panel flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, multiMonthPlugin]}
          initialView={window.innerWidth < 640 ? 'dayGridWeek' : 'dayGridMonth'}
          initialDate={new Date().toISOString().split('T')[0]}
          events={events}
          dateClick={handleDateClick}
          headerToolbar={{
            left: window.innerWidth < 640 ? 'prev,next' : 'prev,next today',
            center: 'title',
            right: window.innerWidth < 640 ? 'today' : 'multiMonthYear,dayGridMonth,dayGridWeek'
          }}
          height="auto"
          contentHeight="auto"
          handleWindowResize={true}
          expandRows={true}
          eventDisplay="block"
          viewClassNames={window.innerWidth < 1200 ? "mobile-calendar" : ""}
        />
      </div>

      <Modal isOpen={!!selectedTasks} onClose={() => setSelectedTasks(null)} title={`Tasks for ${selectedTasks?.date}`} size="md">
        <div className="space-y-2 mt-4">
          {selectedTasks?.tasks.map(t => (
            <div key={t.id} className="p-3 border border-border rounded-md bg-sidebar flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm text-white truncate">{t.clientName}</p>
                  <p className="text-xs text-muted truncate max-w-[200px]">{t.task}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#222] text-primary self-end">{t.status}</span>
                  <div className="flex gap-1">
                    {t.contentCheck && <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">WORK DONE</span>}
                  </div>
                </div>
                <button
                  onClick={() => { if (confirm('Decommission this asset?')) { deleteTask(t.id); setSelectedTasks(prev => ({ ...prev, tasks: prev.tasks.filter(x => x.id !== t.id) })); } }}
                  className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

function SoftwareDeveloperListView({ tasks, onSelect }) {
  const { workers } = useData()
  const [searchDev, setSearchDev] = useState('')

  const developers = useMemo(() => {
    const names = Array.from(new Set(workers.filter(w => w.role === 'Software Developer').map(w => w.name)))
    const filtered = names.filter(name => name.toLowerCase().includes(searchDev.toLowerCase()))
    return filtered.sort((a, b) => {
      const wA = workers.find(w => w.name === a)
      const wB = workers.find(w => w.name === b)
      if (wA?.isTeamLead && !wB?.isTeamLead) return -1
      if (!wA?.isTeamLead && wB?.isTeamLead) return 1
      return a.localeCompare(b)
    })
  }, [workers, searchDev])

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 border-b border-border pb-4 gap-3">
          <div>
            <h1 className="page-heading-lg">Software Developer Management</h1>
            <p className="text-xs sm:text-sm text-muted mt-1">Select a developer to view their roadmap and projects</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md">
            <span className="text-primary font-medium text-sm sm:text-base">{developers.length}</span>
            <span className="text-muted text-[10px] sm:text-xs ml-2 tracking-wider">Active Developers</span>
          </div>
        </div>

        <div className="mb-6">
          <SearchBar value={searchDev} onChange={setSearchDev} placeholder="Search developers by name..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {developers.map(name => {
            const developerTasks = tasks.filter(t => t.workerName === name && t.workerRole === 'Software Developer')
            const stats = {
              total: developerTasks.length,
              pending: developerTasks.filter(t => t.status !== 'Done').length,
              done: developerTasks.filter(t => t.status === 'Done').length
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
                      <p className="text-[9px] sm:text-[10px] text-muted tracking-widest font-medium">Software Engineer</p>
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
                    <p className="text-[8px] text-muted font-medium mb-0.5">Projects</p>
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

        {developers.length === 0 && (
          <div className="text-center py-12 text-muted">
            No developers found matching your search
          </div>
        )}
      </div>
    </div>
  )
}

export default function SoftwareDeveloperPage() {
  const { tasks, addTask, updateTask, deleteTask, clients, setHideHeader, setDesktopCollapsed, desktopCollapsed } = useData()
  const [selectedDeveloper, setSelectedDeveloper] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeFilter, setActiveFilter] = useState('All')
  const [incentiveTask, setIncentiveTask] = useState(null) // 'All', 'WorkDone', 'Incentive'

  useEffect(() => {
    setHideHeader(!!selectedDeveloper)
    return () => setHideHeader(false)
  }, [selectedDeveloper, setHideHeader])

  const developerTasks = useMemo(() => tasks.filter(t => {
    const isOwner = (t.workerRole === 'Software Developer' || t.workerName === selectedDeveloper) && (!selectedDeveloper || t.workerName === selectedDeveloper)
    if (!isOwner) return false

    const matchesSearch = !search ||
      t.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      t.task?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter

    const matchesFilter = activeFilter === 'All' ||
      (activeFilter === 'WorkDone' && t.contentCheck)

    return matchesSearch && matchesStatus && matchesFilter
  }), [tasks, selectedDeveloper, search, statusFilter, activeFilter])

  const handleAddTask = (form) => {
    if (form.id) {
      updateTask(form.id, form)
    } else {
      addTask({
        ...form,
        workerRole: 'Software Developer',
        workerName: selectedDeveloper,
        clientName: form.clientName,
        clientApproval: 'Approval',
        updatedDate: new Date().toISOString().split('T')[0]
      })
    }
    setShowAddModal(false)
    setEditTask(null)
  }

  const handleExpandSidebar = () => {
    setDesktopCollapsed(false) // Expand the sidebar
  }

  if (!selectedDeveloper) {
    return <SoftwareDeveloperListView tasks={tasks} onSelect={setSelectedDeveloper} />
  }

  return (
    <div className={`w-full flex-1 flex flex-col p-0 m-0 overflow-hidden ${selectedDeveloper ? 'h-screen' : ''}`}>
      <div className="flex-none sticky top-0 z-40 bg-background shadow-2xl">
        <CoverHeader
          title={selectedDeveloper}
          onExpandSidebar={handleExpandSidebar}
          isSidebarCollapsed={desktopCollapsed}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="w-full flex flex-col px-0">
          <div className="flex flex-col mb-0 flex-none border-b border-border">
            <div className="w-full min-w-0 overflow-hidden">
              <TaskTable
                tasks={developerTasks}
                onAdd={(task) => { setEditTask(task); setShowAddModal(true); }}
                onUpdateTask={updateTask}
                deleteTask={deleteTask}
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>
          </div>
          <div className="min-h-[400px] sm:min-h-[500px] lg:h-[600px] border-b border-border flex flex-col">
            <CalendarView
              tasks={developerTasks.filter(t => {
                if (activeFilter === 'WorkDone') return t.contentCheck;
                return t.contentCheck || t.status === 'Done';
              })}
              deleteTask={deleteTask}
            />
          </div>

          <div className="p-6 sm:p-10 lg:p-20 flex justify-center bg-background">
            <button
              onClick={() => setSelectedDeveloper(null)}
              className="group flex items-center gap-2 sm:gap-4 pl-1.5 pr-4 sm:pr-8 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full transition-all active:scale-95"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-primary transition-colors">
                <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px] text-black" />
              </div>
              <span className="text-[11px] sm:text-[13px] font-medium text-white opacity-80 group-hover:opacity-100 transition-opacity">Return to Workspace</span>
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
        onSave={updateTask}
        task={incentiveTask}
      />

    </div>
  )
}

