import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { formatDate, cn } from '../lib/utils'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2, Layout } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar() {
  const { tasks } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getTasksForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return (tasks || []).filter(t =>
      t.scheduleDate === dateStr ||
      t.declineDate === dateStr ||
      t.updatedDate === dateStr
    )
  }

  const selectedTasks = selectedDate ? getTasksForDay(selectedDate) : []

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const today = new Date()
  const isToday = (day) => day && new Date(year, month, day).toDateString() === today.toDateString()

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-white tracking-tighter truncate">
                Operational <span className="text-primary/50">Calendar</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-medium mt-1 opacity-60 leading-none">
                Timeline Audit • Tactical Milestone Tracking
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-medium opacity-60 tracking-widest ">Ongoing Tasks</p>
              <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter tabular-nums">
                {(tasks?.filter(t => t.status !== 'Done').length || 0).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        <div className="p-4 sm:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-[1600px] mx-auto w-full">
          
          {/* Calendar Section */}
          <div className="xl:col-span-2 space-y-6">
             <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl shadow-2xl">
                {/* Calendar Control Bar */}
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h2 className="text-xl font-medium text-white tracking-tight">{MONTHS[month]} <span className="text-primary/40">{year}</span></h2>
                      <p className="text-[10px] text-muted font-medium  tracking-widest opacity-40 mt-1">Monthly Schedule View</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={prevMonth} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all border border-white/5 active:scale-90"><ChevronLeft size={20} /></button>
                      <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-[10px] font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-95  tracking-wider">Today</button>
                      <button onClick={nextMonth} className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all border border-white/5 active:scale-90"><ChevronRight size={20} /></button>
                   </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-7 mb-4">
                   {DAYS.map(d => (
                     <div key={d} className="text-center text-[10px] font-medium text-muted/40  tracking-[0.2em] py-2">{d}</div>
                   ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {cells.map((day, idx) => {
                    const dayTasks = day ? getTasksForDay(day) : []
                    const hasDeadline = dayTasks.some(t => {
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      return t.declineDate === dateStr
                    })
                    const active = selectedDate === day

                    return (
                      <div
                        key={idx}
                        onClick={() => day && setSelectedDate(active ? null : day)}
                        className={cn(
                          "min-h-[80px] sm:min-h-[110px] p-2 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                          !day ? "border-transparent opacity-0 pointer-events-none" :
                          active ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/20 scale-[1.02] z-10" :
                          isToday(day) ? "bg-white/[0.04] border-white/20" :
                          "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                        )}
                      >
                         {day && (
                           <>
                              <div className={cn(
                                "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] sm:text-[13px] font-medium transition-all mb-2",
                                isToday(day) ? "bg-primary text-black" : "text-white/60 group-hover:text-white"
                              )}>
                                {day}
                              </div>
                              <div className="space-y-1 relative z-10">
                                 {dayTasks.slice(0, 2).map(t => (
                                   <div key={t.id} className={cn(
                                     "text-[9px] px-2 py-0.5 rounded-md truncate font-medium  tracking-tighter border",
                                     t.status === 'Done' ? "bg-green-500/10 text-green-400 border-green-500/10" :
                                     t.status === 'In Progress' ? "bg-primary/10 text-primary border-primary/10" :
                                     "bg-white/5 text-muted border-white/5"
                                   )}>
                                      {t.clientName?.split(' ')[0]}
                                   </div>
                                 ))}
                                 {dayTasks.length > 2 && (
                                   <div className="text-[8px] text-center font-medium text-muted/30 pt-1">+{dayTasks.length - 2} MORE</div>
                                 )}
                              </div>
                              {hasDeadline && (
                                <div className="absolute top-2 right-2 flex gap-0.5">
                                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                </div>
                              )}
                           </>
                         )}
                      </div>
                    )
                  })}
                </div>
             </div>

             {/* Legend */}
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <LegendItem icon={CheckCircle2} label="Fulfilled" color="text-green-400" bg="bg-green-400/10" />
                <LegendItem icon={Clock} label="Operational" color="text-primary" bg="bg-primary/10" />
                <LegendItem icon={Layout} label="Allocated" color="text-muted" bg="bg-white/5" />
                <LegendItem icon={AlertCircle} label="Deadline" color="text-red-400" bg="bg-red-400/10" glow />
             </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
             {/* Selected Day Panel */}
             <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl h-fit">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-sm font-medium text-white tracking-widest  opacity-60">Agenda View</h3>
                   {selectedDate && <div className="w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary" />}
                </div>
                
                <div className="mb-6">
                   <p className="text-2xl font-medium text-white tracking-tighter">
                      {selectedDate ? `${MONTHS[month]} ${selectedDate}` : 'No Selection'}
                   </p>
                   <p className="text-[11px] text-muted font-medium  tracking-widest opacity-40 mt-1">
                      {selectedDate ? `Schedule for Day ${selectedDate}` : 'Select a date from grid'}
                   </p>
                </div>

                <div className="space-y-3">
                   {selectedDate && selectedTasks.length === 0 && (
                     <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 opacity-20">
                           <CalendarIcon size={24} />
                        </div>
                        <p className="text-xs font-medium text-muted/40  tracking-widest">No Operational Tasks</p>
                     </div>
                   )}
                   
                   {selectedTasks.map(t => (
                     <div key={t.id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 p-4 rounded-2xl transition-all cursor-pointer">
                        <div className="flex items-start justify-between gap-3 mb-3">
                           <div className="min-w-0">
                              <p className="text-[13px] font-medium text-white tracking-tight line-clamp-1">{t.task}</p>
                              <p className="text-[10px] text-muted font-medium opacity-50 mt-1  tracking-wider">{t.clientName}</p>
                           </div>
                           <span className={cn(
                             "text-[9px] font-medium px-2 py-0.5 rounded border  shrink-0",
                             t.status === 'Done' ? "bg-green-500/10 text-green-400 border-green-500/10" :
                             t.status === 'In Progress' ? "bg-primary/10 text-primary border-primary/10" :
                             "bg-white/5 text-muted border-white/5"
                           )}>{t.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-muted/40 font-medium  tracking-widest">
                            <div className="flex items-center gap-1.5"><Clock size={12} /> <span>{(t.workerName || 'Staff').split(' ')[0]}</span></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Upcoming Block */}
             <div className="bg-sidebar/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl h-fit">
                <h3 className="text-sm font-medium text-white tracking-widest  opacity-60 mb-6">Upcoming Cutoffs</h3>
                <div className="space-y-4">
                  {(tasks || [])
                    .filter(t => t.status !== 'Done' && t.declineDate)
                    .sort((a, b) => new Date(a.declineDate) - new Date(b.declineDate))
                    .slice(0, 4)
                    .map(t => (
                      <div key={t.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-red-400/[0.02] border border-red-400/5 group hover:border-red-400/20 transition-all">
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium text-white tracking-tight truncate group-hover:text-red-400 transition-colors">{t.task}</p>
                          <p className="text-[9px] text-muted font-medium  tracking-widest opacity-40 mt-1">{t.clientName}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[12px] font-medium text-red-500 tabular-nums">{formatDate(t.declineDate)}</p>
                           <p className="text-[8px] text-red-400/30 font-medium  tracking-tighter">Deadline</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ icon: Icon, label, color, bg, glow }) {
   return (
      <div className={cn("flex items-center gap-3 p-3 rounded-2xl bg-sidebar/20 border border-white/5 transition-all hover:bg-sidebar/40")}>
         <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", bg, color, glow && "shadow-[0_0_12px_rgba(239,68,68,0.3)]")}>
            <Icon size={14} />
         </div>
         <span className="text-[10px] font-medium text-muted  tracking-widest leading-none">{label}</span>
      </div>
   )
}
