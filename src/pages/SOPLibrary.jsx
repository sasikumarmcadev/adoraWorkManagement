import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Modal, FormField } from '../components/ui/index';

/**
 * SOPCard Component
 * Displays individual SOP items in a grid
 */
const SOPCard = ({ sop, onClick, onEdit, onDelete }) => {
  return (
    <div
      onClick={() => onClick(sop)}
      className="group relative bg-[#0a0a0a] border border-[#27272a] p-6 rounded-2xl hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-2xl"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg text-white line-clamp-1">{sop.title}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(sop); }}
            className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(sop.id); }}
            className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-muted text-sm leading-relaxed line-clamp-3 opacity-60">
        {sop.description}
      </p>
      <div className="mt-auto pt-4 flex items-center text-white text-xs opacity-40 group-hover:opacity-100 transition-opacity gap-2">
        View Details <span className="text-primary">→</span>
      </div>
    </div>
  );
};

/**
 * AddSOPModal Component
 * Popup for adding or editing SOPs
 */
const AddSOPModal = ({ isOpen, onClose, onSave, editData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Update form when editing
  React.useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setDescription(editData.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit SOP' : 'Add New SOP'} size="md">
      <div className="space-y-6 mt-2">
        <FormField label="Protocol Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Content Creation Standards"
            className="input"
          />
        </FormField>

        <FormField label="Operational Description">
          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed instructions and workflow protocols..."
            className="input resize-none py-3"
          />
        </FormField>

        <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-4 border-t border-white/5">
          <button className="flex-1 h-14 rounded-2xl text-[12px] text-muted hover:text-white hover:bg-white/5 transition-all" onClick={onClose}>Discard</button>
          <button className="flex-1 h-14 rounded-2xl text-[12px] font-medium bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20" onClick={handleSave}>
            {editData ? 'Update Protocol' : 'Deploy Protocol'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * DetailViewModal Component
 * Simple view for full description
 */
const DetailViewModal = ({ sop, onClose }) => {
  if (!sop) return null;

  return (
    <Modal isOpen={!!sop} onClose={onClose} title={sop.title} size="lg">
      <div className="space-y-6">
        <div className="min-h-[40vh] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          <p className="text-muted leading-relaxed whitespace-pre-wrap text-sm sm:text-base opacity-80">
            {sop.description}
          </p>
        </div>
        <div className="flex justify-end pt-6 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-10 h-14 bg-primary text-black rounded-2xl text-[12px] font-medium transition-all hover:scale-[1.02] shadow-xl shadow-primary/20"
          >
            Acknowledge Protocols
          </button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Main SOPLibraryPage
 */
export default function SOPLibrary() {
  const { sopLibrary, addSop, updateSop, deleteSop } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSop, setSelectedSop] = useState(null);
  const [editingSop, setEditingSop] = useState(null);

  const handleSave = (data) => {
    if (editingSop) {
      updateSop(editingSop.id, data);
    } else {
      addSop(data);
    }
    setIsAddModalOpen(false);
    setEditingSop(null);
  };

  const openEdit = (sop) => {
    setEditingSop(sop);
    setIsAddModalOpen(true);
  };

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="page-heading truncate leading-none">
                SOP <span className="text-primary/50">Library</span>
              </h1>
              <p className="page-subheading">
                Workflow Protocols • Professional Operational Logic
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
              <p className="text-[9px] sm:text-[11px] text-muted font-medium opacity-60 tracking-widest leading-none">Registered Protocols</p>
              <p className="text-2xl sm:text-4xl font-medium text-white tracking-tighter tabular-nums leading-none">
                {sopLibrary.length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-panel">
        <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          {/* Functional Bar Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-[11px] text-white tracking-[0.3em] opacity-40">System Protocol Registry</h2>
            </div>
            <button
              onClick={() => { setEditingSop(null); setIsAddModalOpen(true); }}
              className="group flex items-center justify-center gap-3 pl-1.5 pr-6 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <Plus size={18} />
              </div>
              <span className="text-[12px] font-medium text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Add SOP Protocol</span>
            </button>
          </div>

          {/* content Section */}
          {sopLibrary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center mb-6">
                <Plus size={40} className="text-white/10" />
              </div>
              <h2 className="text-2xl text-white mb-2">No SOP Added</h2>
              <p className="text-muted mb-8 max-w-xs mx-auto">Build your library by adding your first standard operating procedure.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-12 h-14 bg-primary text-black rounded-2xl font-medium transition-all hover:scale-[1.05] shadow-2xl shadow-primary/30"
              >
                Create First SOP
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sopLibrary.map((sop) => (
                <SOPCard
                  key={sop.id}
                  sop={sop}
                  onClick={setSelectedSop}
                  onEdit={openEdit}
                  onDelete={deleteSop}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddSOPModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingSop(null); }}
        onSave={handleSave}
        editData={editingSop}
      />

      <DetailViewModal
        sop={selectedSop}
        onClose={() => setSelectedSop(null)}
      />
    </div>
  );
}

