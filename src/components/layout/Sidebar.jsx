import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import SidebarGroup from './SidebarGroup'
import SidebarItem from './SidebarItem'
import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'

const SidebarIcon = ({ className, size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="-0.5 -0.5 16 16"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="currentColor"
    height={size}
    width={size}
    className={className}
  >
    <path d="M5.625 2.1875v10.625M1.875 5.875c0 -1.4000000000000001 0 -2.1 0.2725 -2.6350000000000002a2.5 2.5 0 0 1 1.0925 -1.0925C3.775 1.875 4.475 1.875 5.875 1.875h3.25c1.4000000000000001 0 2.1 0 2.6350000000000002 0.2725a2.5 2.5 0 0 1 1.0925 1.0925C13.125 3.775 13.125 4.475 13.125 5.875v3.25c0 1.4000000000000001 0 2.1 -0.2725 2.6350000000000002a2.5 2.5 0 0 1 -1.0925 1.0925C11.225000000000001 13.125 10.525 13.125 9.125 13.125H5.875c-1.4000000000000001 0 -2.1 0 -2.6350000000000002 -0.2725a2.5 2.5 0 0 1 -1.0925 -1.0925C1.875 11.225000000000001 1.875 10.525 1.875 9.125z" strokeWidth="1" />
  </svg>
)

export default function Sidebar({ mobileOpen, setMobileOpen, collapsed, setCollapsed }) {
  const [openGroups, setOpenGroups] = useState({
    'Team Board': true,
    'Dashboard': false,
    'Clients': false,
    'Expenditure': false,
    'Hiring': false
  })

  const toggleGroup = (title) => {
    if (collapsed) {
      setCollapsed(false)
      setOpenGroups(prev => ({ ...prev, [title]: true }))
    } else {
      setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }))
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-border
        transition-all duration-300 flex flex-col
        ${mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        ${!mobileOpen && collapsed ? 'lg:w-0 lg:border-none opacity-0 pointer-events-none' : 'lg:w-64 opacity-100'}
      `}>
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 overflow-hidden" onClick={() => setMobileOpen(false)}>
            <img
              src="https://res.cloudinary.com/dhw6yweku/image/upload/v1756276288/l3kbqtpkrsz2lqshmmmj.png"
              alt="Adora Agency Logo"
              className="h-8 min-w-[32px] w-auto object-contain"
            />
          </Link>

          <button
            onClick={() => mobileOpen ? setMobileOpen(false) : setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors lg:flex items-center justify-center hidden"
          >
            <SidebarIcon size={18} />
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar space-y-2">

          <SidebarGroup title="Team Board" isOpen={openGroups['Team Board']} onToggle={() => toggleGroup('Team Board')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/team-board/content-specialist" label="Content Specialist" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/editor" label="Editor" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/video-grapher" label="Video Grapher" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/meta-ads" label="Meta Ads" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/software-developer" label="Software Developer" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Dashboard" isOpen={openGroups['Dashboard']} onToggle={() => toggleGroup('Dashboard')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/dashboard/workers" label="Employees" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/dashboard/revenue" label="Revenue" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/dashboard/work-progress" label="Work Progress" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Clients" isOpen={openGroups['Clients']} onToggle={() => toggleGroup('Clients')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/clients/details" label="Clients Details" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/clients/works" label="Works" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/clients/enquiries" label="Enquiries" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/clients/payment" label="Payment" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Employee Info" isOpen={openGroups['Employees']} onToggle={() => toggleGroup('Employees')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/employee-info/content-specialist" label="Content Specialist" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/editor" label="Editor" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/videographer" label="Video Grapher" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/meta-ads" label="Meta Ads" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/software-developer" label="Software Developer" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Expenditure" isOpen={openGroups['Expenditure']} onToggle={() => toggleGroup('Expenditure')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/expenditure/salary" label="Salary" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/expenditure/expenses" label="Expenses" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Hiring" isOpen={openGroups['Hiring']} onToggle={() => toggleGroup('Hiring')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/hiring/interview-process" label="Interview Process" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          {/* Standalone items */}
          <div className="mb-6 space-y-1">
            <SidebarItem path="/incentives" label="Incentives" onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/sop" label="SOP Library" onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/settings" label="Settings" onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </div>

        </nav>
      </aside>
    </>
  )
}
