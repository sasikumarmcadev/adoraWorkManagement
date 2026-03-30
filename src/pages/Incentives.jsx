import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Gift, FileText, Target, Sparkles, X } from 'lucide-react';
import { Modal, FormField } from '../components/ui/index';
import { cn } from '../lib/utils';

/**
 * RoleIncentiveCard Component
 * Displays individual incentive protocols matching the SOP style exactly
 */
const RoleIncentiveCard = ({ protocol, onClick, onEdit, onDelete, canManage }) => {
  return (
    <div
      onClick={() => onClick(protocol)}
      className="group relative bg-[#0a0a0a] border border-[#27272a] p-6 rounded-2xl hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-2xl"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-lg text-white tracking-tight truncate pr-16">{protocol.roleName}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 absolute top-0 right-0">
          {canManage && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(protocol); }}
                className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(protocol.id); }}
                className="p-2 text-muted hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <p className="text-muted text-[13px] leading-relaxed mb-6 line-clamp-3 opacity-60">
        {protocol.description}
      </p>

      <div className="mt-auto pt-4 flex items-center text-white text-xs opacity-40 group-hover:opacity-100 transition-opacity gap-2">
        View Details <span className="text-primary">→</span>
      </div>
    </div>
  );
};

/**
 * AddIncentiveModal Component
 * Simplified to just Role and Description text area
 */
const AddIncentiveModal = ({ isOpen, onClose, onSave, editData }) => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    if (editData) {
      setRoleName(editData.roleName || '');
      setDescription(editData.description || '');
    } else {
      setRoleName('');
      setDescription('');
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!roleName.trim() || !description.trim()) return;
    onSave({ 
      roleName, 
      description
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Modify Incentive Protocol' : 'Engineer New Protocol'} size="md">
      <div className="space-y-6 mt-2">
        <FormField label="Target Department / Role">
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. Editor, Meta Ads..."
            className="bg-sidebar border border-white/10 h-14 w-full px-5 rounded-2xl text-[13px] text-white outline-none focus:border-primary/40 transition-all shadow-inner"
          />
        </FormField>

        <FormField label="Incentive Protocol Details">
          <textarea
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Define tiered reward structure, special bonuses, and motivational hooks here..."
            className="bg-sidebar border border-white/10 w-full p-5 rounded-2xl text-[13px] text-white outline-none focus:border-primary/40 transition-all shadow-inner resize-none"
          />
        </FormField>

        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-10 border-t border-white/5 pt-8">
          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl text-[12px] text-muted hover:text-white hover:bg-white/5 transition-all outline-none order-1 sm:order-none"
          >
            Abort
          </button>
          <button
            onClick={handleSave}
            className="h-14 px-10 rounded-2xl text-[12px] bg-primary text-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 outline-none active:scale-95"
          >
            {editData ? 'Update Protocol' : 'Deploy Protocol'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * DetailViewModal Component
 */
const DetailViewModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <Modal isOpen={!!data} onClose={onClose} title={`${data.roleName} Protocols`} size="lg">
      <div className="space-y-6 py-4">
        <div className="min-h-[40vh] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          <p className="text-muted leading-relaxed whitespace-pre-wrap text-sm sm:text-base opacity-80">
            {data.description}
          </p>
        </div>
        <div className="flex items-center justify-end border-t border-white/5 pt-6">
          <button
            onClick={onClose}
            className="px-10 h-14 bg-white text-black rounded-2xl text-[12px] transition-all active:scale-95 shadow-xl shadow-primary/20"
          >
            Acknowledge Standards
          </button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Main IncentivesPage
 */
export default function Incentives() {
  const { incentiveProtocols, addIncentiveProtocol, updateIncentiveProtocol, deleteIncentiveProtocol } = useData();
  const { isManager, isJeevan } = useAuth();
  const canManage = isManager || isJeevan;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [editingProtocol, setEditingProtocol] = useState(null);

  const handleSave = (data) => {
    if (editingProtocol) {
      updateIncentiveProtocol(editingProtocol.id, data);
    } else {
      addIncentiveProtocol(data);
    }
    setIsAddModalOpen(false);
    setEditingProtocol(null);
  };

  const openEdit = (protocol) => {
    setEditingProtocol(protocol);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Decommission this incentive protocol? This action is irreversible.')) {
      deleteIncentiveProtocol(id);
    }
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl text-white tracking-tighter truncate">
                Incentive <span className="text-muted/40 text-base sm:text-lg">Library</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted mt-1 opacity-60 leading-none tracking-widest">
                Structural Efficiency Library • Dynamic Yield Systems
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
               <p className="text-[9px] sm:text-[11px] text-muted opacity-60 tracking-widest leading-none">Defined Protocols</p>
               <p className="text-2xl sm:text-4xl text-white tracking-tighter tabular-nums leading-none">
                 {(incentiveProtocols?.length || 0).toString().padStart(2, '0')}
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
              <h2 className="text-[11px] text-white tracking-[0.3em] opacity-40">Operational Architecture Registry</h2>
            </div>
            {canManage && (
              <button
                onClick={() => { setEditingProtocol(null); setIsAddModalOpen(true); }}
                className="flex items-center justify-center gap-2 px-10 h-14 bg-white text-black rounded-2xl shadow-xl transition-all hover:translate-y-[-2px] active:translate-y-0 active:scale-95"
              >
                <Plus size={20} />
                <span className="text-[13px]">Add Protocol</span>
              </button>
            )}
          </div>

          {/* Grid Section */}
          {!incentiveProtocols || incentiveProtocols.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center mb-6">
                <Gift size={40} className="text-white/10" />
              </div>
              <h2 className="text-2xl text-white mb-2">No Protocols Defined</h2>
              <p className="text-muted mb-8 max-w-xs mx-auto">Engineer your first incentive structure to empower your workforce.</p>
              {canManage && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-10 h-14 bg-white text-black rounded-2xl transition-all active:scale-95"
                >
                  + Add Protocol
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {incentiveProtocols.map((ip) => (
                <RoleIncentiveCard
                  key={ip.id}
                  protocol={ip}
                  onClick={setSelectedProtocol}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  canManage={canManage}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddIncentiveModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingProtocol(null); }}
        onSave={handleSave}
        editData={editingProtocol}
      />

      <DetailViewModal
        data={selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
      />
    </div>
  );
}
