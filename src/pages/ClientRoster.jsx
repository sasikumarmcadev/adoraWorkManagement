import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import {
  Modal, FormField, StatusSelect, CustomSelect
} from '../components/ui/index'
import { formatCurrency, formatDate, getStatusClass } from '../lib/utils'
import { Plus, Edit2, Trash2, Users, Search, Target } from 'lucide-react'

const CLIENT_STATUSES = ['Active', 'Inactive']
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Advance', 'Partial']

function DashboardOverview({ clients, payments }) {
  const activeClients = clients.filter(c => c.activeStatus === 'Active').length
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -mr-32 -mt-32 rounded-full pointer-events-none" />
      <div className="max-w-[1600px] mx-auto px-6 py-6 sm:py-10 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="page-heading truncate">
              Client Roster <span className="text-primary/50">Analytics</span>
            </h1>
            <p className="page-subheading mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Strategic portfolio monitoring in real-time
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center sm:items-end gap-1">
               <p className="text-[9px] sm:text-[11px] text-muted font-medium opacity-60 tracking-widest leading-none">Total Portfolio</p>
               <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter tabular-nums text-primary">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-1">
               <p className="text-[9px] sm:text-[11px] text-muted font-medium opacity-60 tracking-widest leading-none">Active Assets</p>
               <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter tabular-nums">{activeClients.toString().padStart(2, '0')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricSidebar({ clients, tasks, payments }) {
  const activeClients = clients.filter(c => c.activeStatus === 'Active').length
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 bg-[#0a0a0a] border-r border-border h-full">
      <div className="flex items-center gap-3">
        <Users size={20} className="text-primary" />
        <h3 className="font-medium text-white text-lg tracking-tight">Ops Intel</h3>
      </div>
      <div className="space-y-4">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 shadow-2xl">
          <h4 className="text-[10px] text-primary font-medium mb-2">Portfolio Volume</h4>
          <p className="text-3xl font-medium text-white">{formatCurrency(totalRevenue)}</p>
          <p className="text-[10px] text-muted mt-2 font-medium">Aggregate settlement flow</p>
        </div>
        <div className="bg-surface-800/20 p-6 rounded-2xl border border-border">
          <p className="text-[10px] text-muted font-medium mb-4">Roster pulse</p>
          <div className="space-y-4 font-medium">
            {[
              ['Active Partnerships', activeClients, 'text-white'],
              ['Pending Settlements', payments.filter(p => p.status === 'Pending').length, 'text-amber-400'],
              ['Production Units', tasks.length, 'text-white/60'],
            ].map(([lbl, val, cls]) => (
              <div key={lbl} className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-muted capitalize">{lbl}</span>
                <span className={`${cls} text-sm`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ClientDetailView({ client, tasks = [] }) {
  const clientTasks = tasks.filter(t => t.clientId === client.id)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ['Business Name', client.name], ['Primary Contact', client.contact], ['Email Address', client.email],
          ['Registered City', client.city], ['Engagement Status', client.activeStatus], ['Billing State', client.paymentStatus],
          ['Monthly Retainer', formatCurrency(client.budget || 0)], ['Partnership Date', formatDate(client.joinedDate)],
        ].map(([label, value]) => (
          <div key={label} className="p-4 rounded-xl bg-[#0a0a0a] border border-border">
            <p className="text-[10px] font-medium text-muted capitalize">{label}</p>
            <p className="text-sm font-medium text-white mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-border">
        <p className="text-xs font-medium text-muted mb-4">Production queue ({clientTasks.length})</p>
        <div className="space-y-2">
          {clientTasks.map(t => (
            <div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0a0a0a] border border-border hover:bg-sidebar transition-colors">
              <span className="text-sm text-white font-medium">{t.task}</span>
              <span className={`${getStatusClass(t.status)} text-[9px] font-medium capitalize px-2 py-1 rounded`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ClientRoster() {
  const { clients, addClient, updateClient, deleteClient, payments, tasks } = useData()
  const { isManager, isJeevan, canDelete } = useAuth()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [form, setForm] = useState({})

  const canEdit = isManager || isJeevan
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const filteredData = clients.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()))

  const openAdd = () => { setEditItem(null); setForm({ activeStatus: 'Active', paymentStatus: 'Paid', joinedDate: new Date().toISOString().split('T')[0] }); setShowModal(true) }
  const openEdit = (c) => { setEditItem(c); setForm({ ...c }); setShowModal(true) }

  const handleSave = () => {
    if (editItem) updateClient(editItem.id, form)
    else addClient(form)
    setShowModal(false)
  }

  return (
    <div className="w-full min-h-screen text-primary bg-background pb-32">
      <DashboardOverview clients={clients} payments={payments} />
      <div className="lg:grid lg:grid-cols-4">
        <div className="hidden lg:block lg:col-span-1 border-r border-border"><MetricSidebar clients={clients} payments={payments} tasks={tasks} /></div>
        <div className="w-full lg:col-span-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 lg:p-8 bg-[#0a0a0a] border-b border-border shadow-xl">
            <div>
              <h2 className="text-xl sm:text-2xl font-medium text-white tracking-tight">Core Partnership Database</h2>
              <div className="flex items-center gap-2 mt-1.5 opacity-60"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><p className="text-[10px] text-white font-medium">Database status: synchronized</p></div>
            </div>
            {canEdit && <button onClick={openAdd} className="group flex items-center gap-2 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full transition-all shadow-2xl"><div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform"><Plus size={20} /></div><span className="text-xs font-medium text-white">Initialize Record</span></button>}
          </div>
          <div className="p-4 sm:p-6 lg:p-8"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners..." className="input pl-10 h-[44px] bg-sidebar/50 border-white/5" /></div></div>
          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700 bg-background">
            {filteredData.map(c => (
              <div key={c.id} className="group flex flex-col p-6 bg-[#0a0a0a] border border-border hover:border-primary/50 transition-all rounded-3xl cursor-pointer relative overflow-hidden shadow-xl" onClick={() => setDetailItem(c)}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-border flex items-center justify-center text-primary font-medium text-2xl group-hover:scale-110 transition-transform">{c.name.charAt(0)}</div>
                  <div><h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors tracking-tight">{c.name}</h3><p className="text-[10px] text-muted font-medium flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-muted/40" />{c.city || 'Global Portfolio'}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111] p-4 rounded-2xl border border-white/5 transition-colors"><p className="text-[9px] text-muted font-medium mb-1 opacity-50">Retainer</p><p className="text-lg font-medium text-emerald-400">{formatCurrency(c.budget || 0)}</p></div>
                  <div className="bg-[#111] p-4 rounded-2xl border border-white/5 transition-colors"><p className="text-[9px] text-muted font-medium mb-1 opacity-50">Units</p><p className="text-lg font-medium text-white">{tasks.filter(t => t.clientId === c.id).length} Active</p></div>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className={`${getStatusClass(c.activeStatus)} text-[9px] font-medium capitalize px-2 py-1 rounded shadow-sm ring-1 ring-inset ring-white/10`}>{c.activeStatus}</span>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button className="p-2 text-muted hover:text-white bg-white/5 rounded-xl" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                    {canDelete && <button className="p-2 text-muted hover:text-red-500 bg-white/5 rounded-xl" onClick={() => deleteClient(c.id)}><Trash2 size={14} /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Update Client Profile' : 'Configure New Client'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <FormField label="Official Business Title"><input className="input" value={form.name || ''} onChange={e => f('name', e.target.value)} /></FormField>
          <FormField label="Relay Contact Identity"><input className="input" value={form.contact || ''} onChange={e => f('contact', e.target.value)} /></FormField>
          <FormField label="Digital Correspondence"><input className="input" type="email" value={form.email || ''} onChange={e => f('email', e.target.value)} /></FormField>
          <FormField label="Operations Base City"><input className="input" value={form.city || ''} onChange={e => f('city', e.target.value)} /></FormField>
          <FormField label="Allocation Budget (INR)"><input className="input" type="number" value={form.budget || ''} onChange={e => f('budget', parseInt(e.target.value))} /></FormField>
          <FormField label="Asset Status Classification">
            <StatusSelect 
              value={form.activeStatus || 'Active'} 
              options={CLIENT_STATUSES} 
              onChange={val => f('activeStatus', val)}
              isFilter
            />
          </FormField>
          <FormField label="Billing Settle State">
            <StatusSelect 
              value={form.paymentStatus || 'Paid'} 
              options={PAYMENT_STATUSES} 
              onChange={val => f('paymentStatus', val)}
              isFilter
            />
          </FormField>
          <FormField label="Commencement Context"><input className="input" type="date" value={form.joinedDate || ''} onChange={e => f('joinedDate', e.target.value)} /></FormField>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-12 border-t border-white/5 pt-8"><button className="btn-secondary px-8 h-[48px] font-medium text-xs" onClick={() => setShowModal(false)}>Discard</button><button className="btn-primary px-10 h-[48px] font-medium text-xs" onClick={handleSave}>{editItem ? 'Commit Update' : 'Initialize Partnership'}</button></div>
      </Modal>
      <Modal isOpen={!!detailItem} onClose={() => setDetailItem(null)} title="Client Partnership Diagnostics" size="lg">{detailItem && <ClientDetailView client={detailItem} tasks={tasks} />}</Modal>
    </div>
  )
}

