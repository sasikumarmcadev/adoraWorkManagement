import { useState } from 'react'
import { Layout, Sparkles, FileText, Gift, Award, Target, TrendingUp } from 'lucide-react'
import { Modal } from '../components/ui/index'
import { cn } from '../lib/utils'

const ROLES = ['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads', 'Software Developer']

const ROLE_INCENTIVES = {
  'Editor': {
    title: 'Editor Incentives',
    subtitle: 'Consistency pays off!',
    description: 'The more you create, the more you earn.',
    structure: [
      { label: 'Weekly 1', tasks: 4, amount: 1200 },
      { label: 'Weekly 2', tasks: 4, amount: 2400 },
      { label: 'Weekly 3', tasks: 4, amount: 3600 },
      { label: 'Weekly 4', tasks: 4, amount: 5000 },
    ],
    motivation: ['Keep pushing', 'Keep growing', 'Keep earning']
  },
  'Content Specialist': {
    title: 'Content Specialist Incentives',
    subtitle: 'High quality content rewards!',
    description: 'Engage more, earn more. Quality over quantity.',
    structure: [
      { label: 'Phase 1', tasks: 5, amount: 1500 },
      { label: 'Phase 2', tasks: 5, amount: 3000 },
      { label: 'Phase 3', tasks: 5, amount: 4500 },
      { label: 'Phase 4', tasks: 5, amount: 6500 },
    ],
    motivation: ['Create magic', 'Drive impact', 'Refine beauty']
  },
  'Video Grapher': {
    title: 'Video Grapher Incentives',
    subtitle: 'Visual storytelling paid well!',
    description: 'Capturing moments that matter.',
    structure: [
      { label: 'Batch 1', tasks: 3, amount: 2000 },
      { label: 'Batch 2', tasks: 3, amount: 4000 },
      { label: 'Batch 3', tasks: 3, amount: 6000 },
      { label: 'Batch 4', tasks: 3, amount: 8000 },
    ],
    motivation: ['Film boldly', 'Edit sharply', 'Scale high']
  },
  'Meta Ads': {
    title: 'Meta Ads Incentives',
    subtitle: 'Performance driving rewards!',
    description: 'Optimize better, yield higher.',
    structure: [
      { label: 'Tier 1', tasks: 2, amount: 2500 },
      { label: 'Tier 2', tasks: 2, amount: 5000 },
      { label: 'Tier 3', tasks: 2, amount: 7500 },
      { label: 'Tier 4', tasks: 2, amount: 10000 },
    ],
    motivation: ['Target deep', 'Convert fast', 'Max ROI']
  },
  'Software Developer': {
    title: 'Software Developer Incentives',
    subtitle: 'Code quality brings value!',
    description: 'Shipping features with precision.',
    structure: [
      { label: 'Sprint 1', tasks: 5, amount: 3000 },
      { label: 'Sprint 2', tasks: 5, amount: 6000 },
      { label: 'Sprint 3', tasks: 5, amount: 9000 },
      { label: 'Sprint 4', tasks: 5, amount: 12000 },
    ],
    motivation: ['Ship clean', 'Resolve fast', 'Build scale']
  }
}

/**
 * RoleIncentiveCard Component
 */
const RoleIncentiveCard = ({ roleName, data, onClick }) => {
  return (
    <div
      onClick={() => onClick({ roleName, ...data })}
      className="group relative bg-[#0a0a0a] border border-[#27272a] p-6 rounded-2xl hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-white line-clamp-1 tracking-tight">{roleName}</h3>
        <div className="p-2 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
           <Gift size={20} />
        </div>
      </div>
      
      <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
        {data.subtitle}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted tracking-widest opacity-60">
           <Award size={12} className="text-primary" />
           <span>Growth Structure</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.structure.slice(0, 2).map((s, i) => (
            <div key={i} className="bg-white/5 px-3 py-2 rounded-lg border border-white/5">
              <p className="text-[10px] font-bold text-white">₹{s.amount.toLocaleString()}</p>
              <p className="text-[8px] text-muted font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center text-white text-xs font-bold opacity-40 group-hover:opacity-100 transition-opacity">
        View Protocol Details →
      </div>
    </div>
  );
};

/**
 * DetailViewModal Component
 */
const DetailViewModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <Modal isOpen={!!data} onClose={onClose} title={`${data.roleName} Protocols`} size="lg">
      <div className="space-y-8 py-2">
        <div>
          <h4 className="text-sm font-bold text-muted tracking-[0.2em] mb-4 opacity-40">Tiered Earnings Structure</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.structure.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 group hover:border-primary/40 transition-all duration-300">
                <p className="text-[10px] font-bold text-muted tracking-widest mb-1">{item.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary/60 mt-2">
                  <Target size={12} />
                  <span>Requirement: {item.tasks} Completed Tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
             <Sparkles size={18} className="text-primary" />
             <h4 className="text-xs font-bold text-primary tracking-widest">Growth Motivation</h4>
          </div>
          <div className="flex flex-wrap gap-4">
             {data.motivation.map((m, i) => (
               <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-bold text-white tracking-tight">{m}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="flex justify-end pr-2 font-bold text-[10px] text-muted opacity-20 tracking-[0.3em]">
           Operational Standards v1.0
        </div>
      </div>
    </Modal>
  );
};

/**
 * Main IncentivesPage
 */
export default function Incentives() {
  const [selectedRoleData, setSelectedRoleData] = useState(null)

  return (
    <div className="w-full flex-1 min-h-screen bg-background flex flex-col">
      {/* Header Area */}
      <div className="bg-background border-b border-border shadow-2xl relative overflow-hidden py-6 sm:py-10">
        <div className="w-full relative z-20 px-4 sm:px-8 lg:px-12 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tighter truncate">
                Incentive <span className="text-primary/50 text-base sm:text-lg">Protocols</span>
              </h1>
              <p className="text-[10px] sm:text-[12px] text-muted font-bold mt-1 opacity-60 leading-none">
                Structural Library • Performance Reward Systems
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-white/[0.02] sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-white/5 sm:border-0">
               <p className="text-[9px] sm:text-[11px] text-muted font-bold opacity-60 tracking-widest leading-none">Defined Roles</p>
               <p className="text-2xl sm:text-4xl font-bold text-white tracking-tighter tabular-nums leading-none">
                 {ROLES.length.toString().padStart(2, '0')}
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
              <h2 className="text-sm font-bold text-white tracking-[0.2em] opacity-40">Incentive Architecture Registry</h2>
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Object.entries(ROLE_INCENTIVES).map(([role, data]) => (
              <RoleIncentiveCard
                key={role}
                roleName={role}
                data={data}
                onClick={setSelectedRoleData}
              />
            ))}
          </div>
        </div>
      </div>

      <DetailViewModal
        data={selectedRoleData}
        onClose={() => setSelectedRoleData(null)}
      />
    </div>
  );
}
