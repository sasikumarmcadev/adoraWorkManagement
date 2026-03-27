import { useState, useMemo, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { cn, formatDate } from '../lib/utils'
import {
  Plus, Search, Edit2, Trash2,
  IndianRupee, ShoppingBag, ArrowLeft
} from 'lucide-react'
import { Modal, FormField, SearchBar } from '../components/ui/index'

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData()
  const { isManager, isJeevan } = useAuth()
  const canManage = isManager || isJeevan

  const [search, setSearch] = useState('')
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
            <div className="text-center md:text-left transition-all">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tighter truncate">
                Expenses
              </h1>
              <p className="text-[11px] sm:text-[12px] text-muted font-bold mt-2 opacity-60 leading-none">
                Operational Capital Ledger • Track daily agency spend
              </p>
            </div>
            <div className="flex flex-col items-center md:items-end">
               <p className="text-[10px] sm:text-[11px] text-muted font-bold mb-1 opacity-60 tracking-widest transition-colors">Total Expenditure</p>
               <p className="text-3xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums">
                 ₹{totalSpend.toLocaleString('en-IN')}
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">

        {/* Functional Bar */}
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-5 bg-sidebar/50 backdrop-blur-3xl sticky top-0 z-20">
          <div className="w-full sm:max-w-xs transition-all focus-within:max-w-md">
            <SearchBar value={search} onChange={setSearch} placeholder="Search ledger..." />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {canManage && (
              <button
                onClick={openAdd}
                className="group flex-1 sm:flex-none flex items-center justify-center gap-3 pl-2 pr-7 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all active:scale-95 shadow-xl"
              >
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Plus size={20} />
                </div>
                <span className="text-[13px] font-bold text-white opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add Expenses</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5 bg-panel/30">
          {(!isMobile && filteredExpenses.length > 0) ? (
            <div className="max-w-[1400px] mx-auto w-full">
              <table className="w-full min-w-[1000px] text-sm text-left border-separate border-spacing-0 table-fixed overflow-visible">
              <thead className="text-[11px] text-muted font-bold bg-sidebar/80 backdrop-blur-md border-b border-border sticky top-0 z-10 transition-colors">
                <tr>
                  <th className="w-[200px] px-6 py-4 border-r border-border leading-none">Date</th>
                  <th className="w-[450px] px-6 py-4 border-r border-border leading-none">Details</th>
                  <th className="w-[220px] px-6 py-4 border-r border-border leading-none">Amount</th>
                  <th className="w-[130px] px-6 py-4 text-right leading-none">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-sidebar transition-colors group">
                    <td className="px-6 py-4 text-secondary font-bold text-[13px] tabular-nums border-r border-border opacity-90">
                      {formatDate(e.date)}
                    </td>
                    <td className="px-6 py-4 border-r border-border">
                      <span className="text-white font-bold text-sm tracking-tight block truncate" title={e.title}>{e.title}</span>
                    </td>
                    <td className="px-6 py-4 border-r border-border">
                      <div className="flex items-center gap-2 font-bold text-white text-[16px] tabular-nums">
                        <IndianRupee size={14} className="opacity-40" />
                        <span>{Number(e.amount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(e)} className="p-2.5 text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all shadow-inner"><Edit2 size={16} /></button>
                        {canManage && <button onClick={() => handleDelete(e.id)} className="p-2.5 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all shadow-inner"><Trash2 size={16} /></button>}
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
                  <div key={e.id} className="group bg-sidebar/40 hover:bg-sidebar/60 border border-white/5 rounded-[2rem] p-6 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-surface-800 border border-white/10 flex items-center justify-center text-primary shadow-2xl transition-transform group-hover:scale-105">
                          <ShoppingBag size={24} />
                        </div>
                        <div>
                           <p className="text-white font-bold text-lg sm:text-xl tracking-tighter leading-none mb-2">{e.title}</p>
                           <p className="text-[12px] text-muted font-bold opacity-60 tracking-widest">{formatDate(e.date)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(e)} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-muted hover:text-white bg-white/5 rounded-2xl transition-all active:scale-95 shadow-lg"><Edit2 size={18} /></button>
                        {canManage && <button onClick={() => handleDelete(e.id)} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-muted hover:text-red-500 bg-red-500/5 rounded-2xl transition-all active:scale-95 shadow-lg"><Trash2 size={18} /></button>}
                      </div>
                    </div>
                    
                    <div className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-3xl p-5 sm:p-6 group-hover:border-primary/20 transition-colors">
                        <p className="text-[11px] text-muted font-bold mb-3 opacity-60 uppercase tracking-widest leading-none">Ledger Disbursement</p>
                        <div className="flex items-baseline gap-2 text-white font-bold text-2xl sm:text-3xl tracking-tighter tabular-nums drop-shadow-2xl">
                          <IndianRupee size={20} className="text-primary opacity-60" />
                          <span>{Number(e.amount || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 shadow-2xl group transition-all">
                      <ShoppingBag size={40} className="text-muted opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" />
                   </div>
                   <h3 className="text-white font-bold text-xl tracking-tighter">No expenses identified</h3>
                   <p className="text-[13px] text-muted font-bold mt-3 opacity-50 max-w-[260px] leading-relaxed">Record a new operating expenditure to begin tracking agency capital.</p>
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
            <FormField label="Expense Details">
              <input 
                className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-2xl text-xs font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner" 
                type="text" 
                placeholder="e.g. Adobe Creative Cloud" 
                value={form.title || ''} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
              />
            </FormField>
            
            <div className="grid grid-cols-2 gap-5">
              <FormField label="Amount (₹)">
                <div className="flex items-center gap-2 bg-sidebar border border-white/10 h-14 px-5 rounded-2xl outline-none focus-within:border-primary/40 transition-all shadow-inner">
                  <IndianRupee size={16} className="text-muted opacity-40" />
                  <input 
                    className="bg-transparent w-full tabular-nums font-bold text-sm text-white outline-none placeholder:text-white/5" 
                    type="number" 
                    placeholder="0.00" 
                    value={form.amount || ''} 
                    onChange={e => setForm({ ...form, amount: e.target.value })} 
                  />
                </div>
              </FormField>

              <FormField label="Date">
                <input
                  className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-2xl text-[11px] font-bold text-white outline-none focus:border-primary/40 transition-all shadow-inner"
                  type="date"
                  value={form.date || ''}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </FormField>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-6 border-t border-white/5">
            <button className="flex-1 h-14 rounded-2xl text-[12px] font-bold text-muted hover:text-white hover:bg-white/5 transition-all outline-none" onClick={() => setIsModalOpen(false)}>Discard</button>
            <button className="flex-1 h-14 rounded-2xl text-[12px] font-bold bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none" onClick={handleSave}>Confirm Expense</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
