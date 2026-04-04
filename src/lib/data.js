// Mock data store — simulates a backend database
// In production, replace with API calls

export const ROLES = ['Content Specialist', 'Editor', 'Video Grapher', 'Meta Ads', 'Software Developer']

export const EVALUATION_CRITERIA = {
  'Video Grapher': [
    { id: 'speed',      label: 'Speed & Productivity', sub: 'Reels count',      max: 25 },
    { id: 'quality',    label: 'Quality of Capture',   sub: 'Static / Reels',   max: 25 },
    { id: 'creativity', label: 'Creativity & Trends',  sub: 'Trend selection',  max: 25 },
    { id: 'deadline',   label: 'Deadline Discipline',  sub: 'On-time delivery', max: 25 },
  ],
  'Editor': [
    { id: 'speed',      label: 'Editing Speed',         sub: 'Turnaround time',  max: 25 },
    { id: 'technical',  label: 'Technical Precision',   sub: 'Color/Audio',      max: 25 },
    { id: 'narrative',  label: 'Narrative Flow',        sub: 'Engagement',       max: 25 },
    { id: 'revisions',  label: 'Revision Count',        sub: 'Efficiency',       max: 25 },
  ],
  'Content Specialist': [
    { id: 'script',     label: 'Script Quality',        sub: 'Messaging',        max: 25 },
    { id: 'research',   label: 'Market Research',       sub: 'Accuracy',         max: 25 },
    { id: 'hooks',      label: 'Hooks & CTA',           sub: 'Performance',      max: 25 },
    { id: 'value',      label: 'Strategy Alignment',    sub: 'Value',            max: 25 },
  ],
  'Meta Ads': [
    { id: 'roas',       label: 'ROAS Optimization',     sub: 'Performance',      max: 25 },
    { id: 'copy',       label: 'Ad Copy Clarity',       sub: 'Conversion',       max: 25 },
    { id: 'creative',   label: 'Creative Testing',      sub: 'Iteration',        max: 25 },
    { id: 'budget',     label: 'Budget Management',     sub: 'Efficiency',       max: 25 },
  ],
  'Software Developer': [
    { id: 'code',       label: 'Code Quality',          sub: 'Maintainability',  max: 25 },
    { id: 'speed',      label: 'Feature Velocity',      sub: 'Delivery Speed',   max: 25 },
    { id: 'bugs',       label: 'Bug Frequency',         sub: 'Stability',        max: 25 },
    { id: 'docs',       label: 'Documentation',         sub: 'Clarity',          max: 25 },
  ]
}

export const USERS = [
  { id: 'u1', name: 'Adora Manager', role: 'Manager', username: 'manager', password: 'manager123', access: 'Manager', avatar: 'AM' },
  { id: 'u2', name: 'Jeevan', role: 'Jeevan', username: 'jeevan', password: 'jeevan123', access: 'Jeevan', avatar: 'JV' },
  { id: 'w1', name: 'Priya Sharma', role: 'Content Specialist', username: 'priya', password: 'priya123', access: 'Worker', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', isTeamLead: true, level: 'Team Lead' },
  { id: 'w2', name: 'Arjun Nair', role: 'Editor', username: 'arjun', password: 'arjun123', access: 'Worker', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isTeamLead: true, level: 'Team Lead' },
  { id: 'w3', name: 'Kavya Reddy', role: 'Video Grapher', username: 'kavya', password: 'kavya123', access: 'Worker', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', isTeamLead: true, level: 'Team Lead' },
  { id: 'w4', name: 'Rohit Kumar', role: 'Editor', username: 'rohit', password: 'rohit123', access: 'Worker', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { id: 'w5', name: 'Sneha Patel', role: 'Content Specialist', username: 'sneha', password: 'sneha123', access: 'Worker', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
  { id: 'w6', name: 'Kiran Rao', role: 'Meta Ads', username: 'kiran', password: 'kiran123', access: 'Worker', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', isTeamLead: true, level: 'Team Lead' },
  { id: 'w7', name: 'Rahul Das', role: 'Software Developer', username: 'rahul', password: 'rahul123', access: 'Worker', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', isTeamLead: true, level: 'Team Lead' },
]

export const CLIENTS = [
  { id: 'c1', name: 'TechNova Solutions', contact: '9876543210', activeStatus: 'Active', paymentStatus: 'Paid', joinedDate: '2024-01-15', email: 'info@technova.com', city: 'Bangalore', budget: 45000, status: 'Onboard' },
  { id: 'c2', name: 'GreenLeaf Organic', contact: '9123456789', activeStatus: 'Active', paymentStatus: 'Partial', joinedDate: '2024-02-10', email: 'hello@greenleaf.com', city: 'Chennai', budget: 30000, status: 'Onboard' },
  { id: 'c3', name: 'Urban Fashion Hub', contact: '9988776655', activeStatus: 'Active', paymentStatus: 'Advance', joinedDate: '2024-03-01', email: 'contact@urbanfashion.com', city: 'Mumbai', budget: 55000, status: 'Onboard' },
  { id: 'c4', name: 'FitLife Gym', contact: '9012345678', activeStatus: 'Inactive', paymentStatus: 'Pending', joinedDate: '2024-01-20', email: 'gym@fitlife.com', city: 'Hyderabad', budget: 20000, status: 'Onboard' },
  { id: 'c5', name: 'SpiceRoute Restaurant', contact: '9765432109', activeStatus: 'Active', paymentStatus: 'Paid', joinedDate: '2024-04-05', email: 'info@spiceroute.com', city: 'Pune', budget: 25000, status: 'Onboard' },
  { id: 'c6', name: 'BrightMinds Academy', contact: '9654321098', activeStatus: 'Active', paymentStatus: 'Paid', joinedDate: '2024-04-18', email: 'academy@brightminds.com', city: 'Delhi', budget: 40000, status: 'Onboard' },
]

export const ENQUIRIES = [
  { id: 'e1', date: '2025-03-01', phone: '9811223344', clientName: 'SolarTech India', status: 'Done', notes: 'Interested in full package' },
  { id: 'e2', date: '2025-03-05', phone: '9700112233', clientName: 'HomeDecor Studio', status: 'Not Started', notes: 'Wants social media only' },
  { id: 'e3', date: '2025-03-10', phone: '9600223344', clientName: 'PureWater Co', status: 'In Progress', notes: 'Reviewing our portfolio' },
  { id: 'e4', date: '2025-03-15', phone: '9500334455', clientName: 'BakeFresh Patisserie', status: 'In Progress', notes: 'Awaiting decision' },
  { id: 'e5', date: '2025-03-18', phone: '9400445566', clientName: 'AutoGarage Pro', status: 'Not Started', notes: 'Budget mismatch' },
  { id: 'e6', date: '2025-03-20', phone: '9300556677', clientName: 'StyleCuts Salon', status: 'Not Started', notes: 'Initial contact' },
]

export const TASKS = [
  { id: 't1', clientId: 'c1', clientName: 'TechNova Solutions', task: 'Brand Identity Content Pack', category: 'Branding', workerRole: 'Content Specialist', workerId: 'w1', workerName: 'Priya Sharma', status: 'Done', declineDate: '2026-03-25', editDate: '2026-03-20', scheduleDate: '2026-03-22', takenDate: '2026-03-01', updatedDate: '2026-03-25', clientApproval: 'Approval', taskCount: 12, contentCheck: true },
  { id: 't2', clientId: 'c2', clientName: 'GreenLeaf Organic', task: 'Monthly Blog Series', category: 'Social Media', workerRole: 'Content Specialist', workerId: 'w5', workerName: 'Sneha Patel', status: 'In Progress', declineDate: '2026-03-28', editDate: '2026-03-22', scheduleDate: '2026-03-18', takenDate: '2026-03-05', updatedDate: '2026-03-25', clientApproval: 'Approval', taskCount: 8, contentCheck: true },
  { id: 't3', clientId: 'c3', clientName: 'Urban Fashion Hub', task: 'Reels Editing — March Batch', category: 'Video Ads', workerRole: 'Editor', workerId: 'w2', workerName: 'Arjun Nair', status: 'In Progress', declineDate: '2025-03-30', editDate: '2025-03-21', scheduleDate: '2025-03-20', takenDate: '2025-03-10', updatedDate: '2025-03-21', clientApproval: 'Changes', taskCount: 15, contentCheck: false },
  { id: 't4', clientId: 'c1', clientName: 'TechNova Solutions', task: 'Product Video Shoot', category: 'Video Ads', workerRole: 'Video Grapher', workerId: 'w3', workerName: 'Kavya Reddy', status: 'Done', declineDate: '2025-03-20', editDate: '2025-03-18', scheduleDate: '2025-03-12', takenDate: '2025-03-04', updatedDate: '2025-03-18', clientApproval: 'Approval', taskCount: 5, contentCheck: true },
  { id: 't5', clientId: 'c4', clientName: 'FitLife Gym', task: 'Social Media Content Calendar', category: 'Social Media', workerRole: 'Content Specialist', workerId: 'w1', workerName: 'Priya Sharma', status: 'Not Started', declineDate: '2025-04-05', editDate: null, scheduleDate: '2025-04-01', takenDate: '2025-03-20', updatedDate: '2025-03-20', clientApproval: 'Approval', taskCount: 10, contentCheck: false },
  { id: 't6', clientId: 'c5', clientName: 'SpiceRoute Restaurant', task: 'Brand Short Film', category: 'Branding', workerRole: 'Video Grapher', workerId: 'w3', workerName: 'Kavya Reddy', status: 'In Progress', declineDate: '2025-04-02', editDate: '2025-03-23', scheduleDate: '2025-03-28', takenDate: '2025-03-15', updatedDate: '2025-03-23', clientApproval: 'Approval', taskCount: 3, contentCheck: false },
  { id: 't7', clientId: 'c6', clientName: 'BrightMinds Academy', task: 'Course Promo Edits', category: 'Video Ads', workerRole: 'Editor', workerId: 'w4', workerName: 'Rohit Kumar', status: 'Done', declineDate: '2025-03-22', editDate: '2025-03-19', scheduleDate: '2025-03-17', takenDate: '2025-03-08', updatedDate: '2025-03-19', clientApproval: 'Approval', taskCount: 7, contentCheck: true },
  { id: 't8', clientId: 'c2', clientName: 'GreenLeaf Organic', task: 'Testimonial Video Edit', category: 'Video Ads', workerRole: 'Editor', workerId: 'w2', workerName: 'Arjun Nair', status: 'Not Started', declineDate: '2025-04-10', editDate: null, scheduleDate: '2025-04-05', takenDate: '2025-03-22', updatedDate: '2025-03-22', clientApproval: 'Approval', taskCount: 4, contentCheck: false },
  { id: 't9', clientId: 'c3', clientName: 'Urban Fashion Hub', task: 'Spring Collection Lead Gen', category: 'Social Media', workerRole: 'Meta Ads', workerId: 'w6', workerName: 'Kiran Rao', status: 'In Progress', declineDate: '2026-04-15', editDate: '2026-03-28', scheduleDate: '2026-03-25', takenDate: '2026-03-10', updatedDate: '2026-03-25', clientApproval: 'Approval', taskCount: 1, contentCheck: true },
  { id: 't10', clientId: 'c1', clientName: 'TechNova Solutions', task: 'B2B Traffic Scale Campaign', category: 'Social Media', workerRole: 'Meta Ads', workerId: 'w6', workerName: 'Kiran Rao', status: 'Not Started', declineDate: '2026-04-20', editDate: null, scheduleDate: '2026-04-05', takenDate: '2026-03-22', updatedDate: '2026-03-22', clientApproval: 'Approval', taskCount: 1, contentCheck: false },
  { id: 't11', clientId: 'c1', clientName: 'TechNova Solutions', task: 'Admin Dashboard API Integration', category: 'Software', workerRole: 'Software Developer', workerId: 'w7', workerName: 'Rahul Das', status: 'Done', declineDate: '2026-03-25', editDate: '2026-03-15', scheduleDate: '2026-03-12', takenDate: '2026-03-01', updatedDate: '2026-03-15', clientApproval: 'Approval', taskCount: 1, contentCheck: true },
  { id: 't12', clientId: 'c2', clientName: 'GreenLeaf Organic', task: 'E-commerce Checkout Optimization', category: 'Software', workerRole: 'Software Developer', workerId: 'w7', workerName: 'Rahul Das', status: 'In Progress', declineDate: null, editDate: '2026-03-20', scheduleDate: '2026-03-18', takenDate: '2026-03-10', updatedDate: '2026-03-20', clientApproval: 'Approval', taskCount: 1, contentCheck: false },
  { id: 't13', clientId: 'c3', clientName: 'Urban Fashion Hub', task: 'Mobile App Notification Engine', category: 'Software', workerRole: 'Software Developer', workerId: 'w7', workerName: 'Rahul Das', status: 'Not Started', declineDate: null, editDate: null, scheduleDate: '2026-04-05', takenDate: '2026-03-22', updatedDate: '2026-03-22', clientApproval: 'Approval', taskCount: 1, contentCheck: false },
]

export const PAYMENTS = [
  { id: 'p1', clientId: 'c1', clientName: 'TechNova Solutions', amount: 45000, date: '2025-03-01', forMonth: '2025-03', status: 'Completed', note: 'Monthly retainer' },
  { id: 'p2', clientId: 'c2', clientName: 'GreenLeaf Organic', amount: 15000, date: '2025-03-05', forMonth: '2025-03', status: 'Partial', note: 'Advance for March' },
  { id: 'p3', clientId: 'c3', clientName: 'Urban Fashion Hub', amount: 27500, date: '2025-03-10', forMonth: '2025-03', status: 'Advance', note: '50% advance paid' },
  { id: 'p4', clientId: 'c4', clientName: 'FitLife Gym', amount: 20000, date: '2025-03-15', forMonth: '2025-03', status: 'Pending', note: 'Invoice sent, awaiting payment' },
  { id: 'p5', clientId: 'c5', clientName: 'SpiceRoute Restaurant', amount: 25000, date: '2025-03-18', forMonth: '2025-03', status: 'Completed', note: 'Full payment received' },
  { id: 'p6', clientId: 'c6', clientName: 'BrightMinds Academy', amount: 40000, date: '2025-03-20', forMonth: '2025-03', status: 'Completed', note: 'Monthly payment' },
]

export const SALARIES = [
  { id: 's1', workerId: 'w1', workerName: 'Priya Sharma', role: 'Content Specialist', amount: 22000, incentive: 3000, month: '2025-03', status: 'Paid' },
  { id: 's2', workerId: 'w2', workerName: 'Arjun Nair', role: 'Editor', amount: 25000, incentive: 2500, month: '2025-03', status: 'Paid' },
  { id: 's3', workerId: 'w3', workerName: 'Kavya Reddy', role: 'Video Grapher', amount: 28000, incentive: 4000, month: '2025-03', status: 'Paid' },
  { id: 's4', workerId: 'w4', workerName: 'Rohit Kumar', role: 'Editor', amount: 24000, incentive: 2000, month: '2025-03', status: 'Pending' },
  { id: 's5', workerId: 'w5', workerName: 'Sneha Patel', role: 'Content Specialist', amount: 21000, incentive: 0, month: '2025-03', status: 'Paid' },
]

export const EXPENSES = [
  { id: 'ex1', date: '2025-03-02', item: 'Adobe Creative Suite', amount: 5500, note: 'Monthly subscription', category: 'Software' },
  { id: 'ex2', date: '2025-03-05', item: 'Office Supplies', amount: 1200, note: 'Paper, pens etc', category: 'Office' },
  { id: 'ex3', date: '2025-03-10', item: 'Camera Rental - DJI Drone', amount: 8000, note: 'For SpiceRoute shoot', category: 'Equipment' },
  { id: 'ex4', date: '2025-03-15', item: 'Team Lunch', amount: 2500, note: 'Monthly celebration', category: 'Team' },
  { id: 'ex5', date: '2025-03-20', item: 'Internet Bill', amount: 2000, note: 'Office broadband', category: 'Utilities' },
  { id: 'ex6', date: '2025-03-22', item: 'Canva Pro', amount: 3000, note: 'Annual plan monthly split', category: 'Software' },
]

export const HIRING = [
  { id: 'h1', date: '2025-03-01', candidateName: 'Amit Verma', phone: '9811001122', state: 'Karnataka', city: 'Bangalore', role: 'Content Specialist', status: 'Selected', notes: 'Strong portfolio', rounds: 2, result: 'Hired' },
  { id: 'h2', date: '2025-03-08', candidateName: 'Divya Singh', phone: '9722334455', state: 'Maharashtra', city: 'Pune', role: 'Editor', status: 'Interview', notes: 'Good at motion graphics', rounds: 1, result: 'Pending' },
  { id: 'h3', date: '2025-03-12', candidateName: 'Suresh Babu', phone: '9633445566', state: 'Tamil Nadu', city: 'Chennai', role: 'Video Grapher', status: 'Applied', notes: 'Entry level experience', rounds: 0, result: 'Pending' },
  { id: 'h4', date: '2025-03-15', candidateName: 'Meera Iyer', phone: '9544556677', state: 'Kerala', city: 'Kochi', role: 'Content Specialist', status: 'Rejected', notes: 'Skill mismatch', rounds: 2, result: 'Not Selected' },
  { id: 'h5', date: '2025-03-19', candidateName: 'Kiran Rao', phone: '9400667788', state: 'Andhra Pradesh', city: 'Hyderabad', role: 'Meta Ads', status: 'Interview', notes: 'Good FB Ads experience', rounds: 1, result: 'Pending' },
]

export const INCENTIVE_PROTOCOLS = [
  {
    id: 'ip1',
    roleName: 'Editor',
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
  {
    id: 'ip2',
    roleName: 'Content Specialist',
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
  {
    id: 'ip3',
    roleName: 'Video Grapher',
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
  {
    id: 'ip4',
    roleName: 'Meta Ads',
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
  {
    id: 'ip5',
    roleName: 'Software Developer',
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
]

export const INCENTIVES = [
  { id: 'i1', workerId: 'w1', workerName: 'Priya Sharma', role: 'Content Specialist', month: '2025-03', amount: 3000, reason: 'Completed 12 tasks ahead of deadline' },
  { id: 'i2', workerId: 'w3', workerName: 'Kavya Reddy', role: 'Video Grapher', month: '2025-03', amount: 4000, reason: 'Excellent client feedback on SpiceRoute video' },
  { id: 'i3', workerId: 'w2', workerName: 'Arjun Nair', role: 'Editor', month: '2025-02', amount: 2500, reason: 'Extra reels batch completed' },
  { id: 'i4', workerId: 'w4', workerName: 'Rohit Kumar', role: 'Editor', month: '2025-03', amount: 2000, reason: 'Zero revision policy maintained' },
]

export const SOP_LIBRARY = [
  { id: 'sop1', title: 'Content Creation SOP', description: 'Step-by-step guide for creating branded social media content for clients.', file: null, link: 'https://docs.google.com/...', category: 'Content', createdBy: 'Manager', createdAt: '2025-02-01' },
  { id: 'sop2', title: 'Client Onboarding Checklist', description: 'Complete checklist to follow when onboarding a new client to the agency.', file: null, link: null, category: 'Operations', createdBy: 'Manager', createdAt: '2025-02-15' },
  { id: 'sop3', title: 'Video Production Workflow', description: 'End-to-end workflow from pre-production planning to final delivery.', file: null, link: 'https://notion.so/...', category: 'Video', createdBy: 'Manager', createdAt: '2025-03-01' },
  { id: 'sop4', title: 'Editing Standards Guide', description: 'Color grading standards, export settings, and delivery format specifications.', file: null, link: null, category: 'Editing', createdBy: 'Manager', createdAt: '2025-03-10' },
]

export const ACTIVITY_LOG = [
  { id: 'a1', user: 'Priya Sharma', action: 'Completed task "Brand Identity Content Pack" for TechNova Solutions', time: '2025-03-20T14:30:00' },
  { id: 'a2', user: 'Adora Manager', action: 'Added new client: BrightMinds Academy', time: '2025-03-20T11:00:00' },
  { id: 'a3', user: 'Arjun Nair', action: 'Updated status of "Reels Editing" to In Progress', time: '2025-03-21T10:15:00' },
  { id: 'a4', user: 'Adora Manager', action: 'Added expense: Camera Rental ₹8,000', time: '2025-03-21T16:00:00' },
  { id: 'a5', user: 'Kavya Reddy', action: 'Uploaded deliverable for "Product Video Shoot"', time: '2025-03-18T09:30:00' },
  { id: 'a6', user: 'Adora Manager', action: 'Approved incentive for Priya Sharma — ₹3,000', time: '2025-03-22T12:00:00' },
]

// Revenue chart data (last 6 months)
export const REVENUE_CHART_DATA = [
  { month: 'Oct', revenue: 112000, expenses: 65000, profit: 47000 },
  { month: 'Nov', revenue: 128000, expenses: 70000, profit: 58000 },
  { month: 'Dec', revenue: 145000, expenses: 78000, profit: 67000 },
  { month: 'Jan', revenue: 138000, expenses: 72000, profit: 66000 },
  { month: 'Feb', revenue: 158000, expenses: 80000, profit: 78000 },
  { month: 'Mar', revenue: 152000, expenses: 75000, profit: 77000 },
]

export const WORKER_PERFORMANCE_DATA = [
  { name: 'Priya', tasks: 12, completed: 10, pending: 2 },
  { name: 'Arjun', tasks: 15, completed: 7, pending: 8 },
  { name: 'Kavya', tasks: 8, completed: 6, pending: 2 },
  { name: 'Rohit', tasks: 11, completed: 7, pending: 4 },
  { name: 'Sneha', tasks: 9, completed: 4, pending: 5 },
  { name: 'Rahul', tasks: 3, completed: 1, pending: 2 },
]

export const CLIENT_GROWTH_DATA = [
  { month: 'Oct', clients: 3 },
  { month: 'Nov', clients: 4 },
  { month: 'Dec', clients: 4 },
  { month: 'Jan', clients: 5 },
  { month: 'Feb', clients: 5 },
  { month: 'Mar', clients: 6 },
]
