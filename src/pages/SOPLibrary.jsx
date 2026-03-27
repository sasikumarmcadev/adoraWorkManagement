import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { PageHeader, EmptyState, Modal, FormField, StatusSelect, CustomSelect } from '../components/ui/index'
import { Plus, BookOpen, Link, File, Edit2, Trash2, ExternalLink } from 'lucide-react'

const CATEGORIES = ['All', 'Content', 'Editing', 'Video', 'Operations', 'HR', 'Finance']

export default function SOPLibrary() {
  const { sopLibrary, addSop, updateSop, deleteSop } = useData()
  const { isManager, canDelete } = useAuth()
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({})
  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const filtered = sopLibrary.filter(s => category === 'All' || s.category === category)

  const openAdd = () => { setEditItem(null); setForm({ category: 'Content' }); setShowModal(true) }
  const openEdit = (s) => { setEditItem(s); setForm({ ...s }); setShowModal(true) }
  const save = () => {
    const data = { ...form, createdBy: 'Manager', createdAt: editItem?.createdAt || new Date().toISOString().split('T')[0] }
    if (editItem) updateSop(editItem.id, data)
    else addSop(data)
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="SOP Library"
        subtitle="Standard Operating Procedures and knowledge base"
        actions={
          isManager && (
            <button className="btn-primary" onClick={openAdd}>
              <Plus size={16} /> Add SOP
            </button>
          )
        }
      />

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-brand-500 text-white' : 'btn-secondary'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SOP Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No SOPs yet"
          description={isManager ? "Create your first SOP to build your knowledge base." : "No SOPs available in this category."}
          icon={BookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(sop => (
            <div key={sop.id} className="card-hover group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <BookOpen size={18} className="text-brand-500" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isManager && <button className="btn-ghost p-1.5" onClick={() => openEdit(sop)}><Edit2 size={14} /></button>}
                  {canDelete && <button className="btn-ghost p-1.5 hover:text-red-400" onClick={() => deleteSop(sop.id)}><Trash2 size={14} /></button>}
                </div>
              </div>

              <div className="mb-1">
                <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 text-xs">{sop.category}</span>
              </div>

              <h3 className="font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>{sop.title}</h3>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{sop.description}</p>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                {sop.link && (
                  <a
                    href={sop.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-400 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink size={13} /> Open Link
                  </a>
                )}
                {sop.file && (
                  <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <File size={13} /> File attached
                  </span>
                )}
                <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>By {sop.createdBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit SOP' : 'Create SOP Box'}>
        <div className="space-y-4">
          <FormField label="Title">
            <input className="input" value={form.title || ''} onChange={e => f('title', e.target.value)} placeholder="SOP title" />
          </FormField>
          <FormField label="Category">
            <StatusSelect 
              value={form.category || 'Content'} 
              options={CATEGORIES.filter(c => c !== 'All')} 
              onChange={val => f('category', val)}
              isFilter
            />
          </FormField>
          <FormField label="Description">
            <textarea className="input" rows={4} value={form.description || ''} onChange={e => f('description', e.target.value)} placeholder="Describe this SOP..." />
          </FormField>
          <FormField label="Link (optional)">
            <input className="input" value={form.link || ''} onChange={e => f('link', e.target.value)} placeholder="https://docs.google.com/..." />
          </FormField>
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>{editItem ? 'Update' : 'Create'}</button>
        </div>
      </Modal>
    </div>
  )
}
