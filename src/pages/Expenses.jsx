import { useState, useMemo, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useSearchParams } from 'react-router-dom'
import { cn, formatDate } from '../lib/utils'
import {
  Plus, Edit2, Trash2,
  IndianRupee, ShoppingBag
} from 'lucide-react'
import { Modal, FormField, SearchBar } from '../components/ui/index'

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData()
  const { isManager, isJeevan } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const canManage = isManager || isJeevan

  // Sync state with Search Params
  const search = searchParams.get('q') || ''

  const updateFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) nextParams.delete(key)
      else nextParams.set(key, value)
    })
    setSearchParams(nextParams, { replace: true })
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [form, setForm] = useState({})
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1200 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredExpenses = useMemo(() => {
    return (expenses || []).filter(e => {
      return !search || e.title?.toLowerCase().includes(search.toLowerCase())
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, search])

  const openAdd = () => {
    setSelectedExpense(null)
    setForm({ 
      date: new Date().toISOString().split('T')[0], 
      title: '', 
      amount: ''
    })
    setIsModalOpen(true)
  }

  const openEdit = (exp) => {
    setSelectedExpense(exp)
    setForm({ ...exp })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!form.title || !form.amount) return
    const payload = {
      ...form,
      amount: Number(form.amount || 0)
    }
    if (selectedExpense) updateExpense(selectedExpense.id, payload)
    else addExpense(payload)
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to remove this expense entry?')) deleteExpense(id)
  }

  const totalSpend = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">

      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-8 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tighter truncate">
                Expenses <span className="text-primary/50">Audit</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-bold mt-1 opacity-60 leading-none">
                Operational Capital Ledger • Track daily agency spend
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center sm:items-end gap-1">
                <p className="text-[9px] sm:text-[11px] text-muted opacity-60 tracking-widest font-bold leading-none">Total Expenditure</p>
                <p className="text-2xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums text-primary">₹{totalSpend.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">

        {/* Functional Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-5 bg-sidebar/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="w-full sm:max-w-xs transition-all duration-500">
            <SearchBar value={search} onChange={val => updateFilters({ q: val })} placeholder="Search ledger..." />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {canManage && (
              <button
                onClick={openAdd}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Plus size={18} />
                </div>
                <span className="text-[12px] font-bold text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Expense</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {(!isMobile && filteredExpenses.length > 0) ? (
            <div className="max-w-[1400px] mx-auto w-full">
              <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
              <thead className="text-[11px] text-muted bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                <tr>
                  <th className="w-[180px] px-8 py-4 border-r border-border leading-none">Entry Date</th>
                  <th className="px-8 py-4 border-r border-border min-w-[300px] leading-none">Journal Entry</th>
                  <th className="w-[200px] px-8 py-4 border-r border-border leading-none">Stake Amount</th>
                  <th className="w-[120px] px-8 py-4 text-right leading-none">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-sidebar transition-all group">
                    <td className="px-8 py-4 border-r border-border text-white/50 text-[12px] tabular-nums tracking-tight">
                      {formatDate(e.date)}
                    </td>
                    <td className="px-8 py-4 border-r border-border">
                      <span className="text-white text-[13px] tracking-tight truncate block" title={e.title}>{e.title}</span>
                    </td>
                    <td className="px-8 py-4 border-r border-border">
                      <div className="flex items-center gap-2 text-white/80 text-[13px] tabular-nums tracking-tight">
                        <IndianRupee size={12} className="text-primary/40 shrink-0" />
                        <span>{Number(e.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(e)} className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"><Edit2 size={16} /></button>
                        {canManage && <button onClick={() => handleDelete(e.id)} className="p-2.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <div className="p-4 sm:p-6 grid grid-cols-1 gap-4 sm:gap-6">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((e) => (
                  <div key={e.id} className="group bg-sidebar/30 border border-white/5 rounded-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden transition-all duration-500 ring-1 ring-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg bg-surface-800 border border-white/10 flex items-center justify-center text-primary">
                          <ShoppingBag size={20} />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-white text-base tracking-tight leading-tight line-clamp-1">{e.title}</p>
                           <p className="text-[10px] text-muted opacity-60 tracking-tight">{formatDate(e.date)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(e)} className="w-10 h-10 flex items-center justify-center text-muted hover:text-white bg-white/5 rounded-xl transition-all border border-white/5"><Edit2 size={16} /></button>
                        {canManage && <button onClick={() => handleDelete(e.id)} className="w-10 h-10 flex items-center justify-center text-muted hover:text-red-500 bg-red-500/5 rounded-xl transition-all border border-white/5"><Trash2 size={16} /></button>}
                      </div>
                    </div>
                    
                    <div className="bg-background/20 border border-white/5 rounded-xl p-4 space-y-1.5">
                        <p className="text-[9px] text-muted opacity-40 tracking-widest leading-none">Journal Value</p>
                        <div className="flex items-center gap-2 text-white text-xl tabular-nums tracking-tight">
                          <IndianRupee size={16} className="text-primary/40 shrink-0" />
                          <span>{Number(e.amount || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                   <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 shadow-2xl">
                      <ShoppingBag size={32} className="text-muted opacity-20" />
                   </div>
                   <h3 className="text-white text-lg tracking-tighter">Database Clear</h3>
                   <p className="text-[12px] text-muted mt-2 opacity-50 max-w-[260px] leading-relaxed">No operational expenditure records found in the current intelligence feed.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedExpense ? "Revise Expenditure" : "Record New Expense"} size="md">
        <div className="space-y-6 my-6 px-1">
          <div className="grid grid-cols-1 gap-6">
            <FormField label="Journal Entry Details">
              <input 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-xs text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                type="text" 
                placeholder="e.g. Adobe Creative Cloud" 
                value={form.title || ''} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
              />
            </FormField>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Stake Amount (₹)">
                <div className="flex items-center gap-2 bg-sidebar border border-white/10 h-14 px-5 rounded-xl outline-none focus-within:border-primary/40 transition-all shadow-inner">
                  <IndianRupee size={16} className="text-muted opacity-40 shrink-0" />
                  <input 
                    className="bg-transparent w-full tabular-nums text-sm text-white outline-none" 
                    type="number" 
                    placeholder="0.00" 
                    value={form.amount || ''} 
                    onChange={e => setForm({ ...form, amount: e.target.value })} 
                  />
                </div>
              </FormField>

              <FormField label="Entry Date Context">
                <input
                  className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-xl text-[11px] text-white outline-none focus:border-primary/40 transition-all shadow-inner"
                  type="date"
                  value={form.date || ''}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </FormField>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-white/5">
            <button className="flex-1 h-14 rounded-xl text-[12px] text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setIsModalOpen(false)}>Discard</button>
            <button className="flex-1 h-14 rounded-xl text-[12px] font-bold bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none" onClick={handleSave}>Confirm Registration</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
