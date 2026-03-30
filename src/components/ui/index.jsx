import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { getStatusClass, cn } from '../../lib/utils'
import { ChevronDown, Inbox } from 'lucide-react'

export function StatusBadge({ status }) {
  return (
    <span className={getStatusClass(status)}>
      {status}
    </span>
  )
}

export function StatCard({ title, value, icon: Icon, color = 'brand', subtitle, trend }) {
  const colorMap = {
    brand: 'text-brand-500 bg-brand-500/10',
    green: 'text-emerald-500 bg-emerald-500/10',
    red: 'text-red-500 bg-red-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
  }

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{title}</p>
          <p className="text-2xl font-bold mt-1.5 tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</p>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span className={trend > 0 ? 'text-emerald-500 text-xs font-semibold' : 'text-red-500 text-xs font-semibold'}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs last month</span>
        </div>
      )}
    </div>
  )
}

export function EmptyState({ title = 'No data yet', description = 'Data will appear here once added.', icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      {Icon ? (
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-brand-400" style={{ background: 'var(--bg-secondary)' }}>
          <Icon size={32} />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-muted/20" style={{ background: 'var(--bg-secondary)' }}>
          <Inbox size={32} />
        </div>
      )}
      <div>
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{description}</p>
      </div>
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null
  const sizeMap = { sm: 'max-w-sm', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content w-full ${sizeMap[size]}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-sidebar-light/20">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 text-muted hover:text-white transition-all duration-200"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-sidebar/50">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Table({ columns, data, onRowClick }) {
  if (!data || data.length === 0) {
    return <EmptyState title="No records found" description="Try adjusting your filters or add new data." />
  }
  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
            {columns.map(col => (
              <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              className="table-row-hover border-b last:border-0 cursor-pointer"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3.5" style={{ color: 'var(--text-primary)' }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl mb-6 w-full sm:w-fit overflow-x-auto scrollbar-thin scrollbar-thumb-white/10" style={{ background: 'var(--bg-secondary)' }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            active === tab.key
              ? 'bg-brand-500 text-white shadow-sm'
              : 'hover:bg-[var(--bg-card)]'
          }`}
          style={active !== tab.key ? { color: 'var(--text-secondary)' } : {}}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function FormField({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 text-sm"
      />
    </div>
  )
}

export function Slideover({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <div className="pointer-events-auto w-screen max-w-md bg-[#0a0a0a] border-l border-white/5 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out translate-x-0">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-sidebar-light/10">
            <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-muted hover:text-white transition-all duration-200"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CustomSelect({ value, options, onChange, getStatusColor, isFilter = false, placeholder = "Select option" }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 })

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      })
    }
  }

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords()
      window.addEventListener('scroll', updateCoords, true)
      window.addEventListener('resize', updateCoords)
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true)
      window.removeEventListener('resize', updateCoords)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClose = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) && !e.target.closest('.portal-menu')) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClose)
    return () => document.removeEventListener('mousedown', handleClose)
  }, [isOpen])

  const menuContent = isOpen && coords && (
    <div
      className="portal-menu fixed bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_45px_100px_-20px_rgba(0,0,0,1)] z-[1000000] p-1.5"
      style={{
        top: coords.top + coords.height + 8,
        left: coords.left,
        width: isFilter ? (coords.width > 220 ? coords.width : 220) : coords.width,
        minWidth: '160px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      <div className="flex flex-col gap-0.5">
        {options.map(opt => {
          const optValue = typeof opt === 'object' ? opt.value : opt
          const optLabel = typeof opt === 'object' ? opt.label : opt
          return (
            <button
              key={optValue}
              onClick={() => {
                onChange(optValue)
                setIsOpen(false)
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-xs font-bold",
                value === optValue 
                  ? "bg-blue-600 text-white" 
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              )}
            >
              {optLabel}
            </button>
          )
        })}
      </div>
    </div>
  )

  const displayLabel = (() => {
    if (!value) return placeholder
    const found = options.find(o => (typeof o === 'object' ? o.value === value : o === value))
    return found ? (typeof found === 'object' ? found.label : found) : value
  })()

  return (
    <div className={cn("relative inline-block", isFilter ? "w-full" : "w-full min-w-[100px]")}>
      <div ref={containerRef} className="w-full">
        <button
          onClick={() => {
            updateCoords()
            setIsOpen(!isOpen)
          }}
          className={cn(
            "w-full font-bold rounded-lg text-center border flex items-center justify-center gap-2",
            isFilter ? "min-h-[44px] bg-sidebar/40 border-white/5 px-4 text-xs text-white justify-between" : "px-3 py-2 text-[10px] shadow-2xl tracking-normal",
            !isFilter && getStatusColor ? getStatusColor(value) : (isFilter ? "" : "bg-[#111] text-white border-white/10")
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown size={isFilter ? 16 : 12} className={cn("opacity-40", isOpen && "rotate-180")} />
        </button>
      </div>
      {isOpen && createPortal(menuContent, document.body)}
    </div>
  )
}


export { CustomSelect as StatusSelect }
