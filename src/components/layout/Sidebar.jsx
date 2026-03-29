import { Link } from 'react-router-dom'
import SidebarGroup from './SidebarGroup'
import SidebarItem from './SidebarItem'
import {
  ChevronDown, X,
  Users, LayoutDashboard, Briefcase,
  UserRound, CreditCard, UserPlus,
  Sparkles, FileText, Settings
} from 'lucide-react'
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

const DashboardIcon = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
  >
    <path fill="currentColor" d="M32 5H4a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM4 29V7h28v22Z" />
    <path fill="currentColor" d="m15.62 15.222l-6.018 8.746l-4.052-3.584l1.06-1.198l2.698 2.386l6.326-9.192l6.75 10.015l6.754-8.925l1.276.966l-8.106 10.709z" />
  </svg>
)

const ClientsIcon = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
  >
    <path fill="currentColor" d="M17.9 17.3c2.7 0 4.8-2.2 4.8-4.9s-2.2-4.8-4.9-4.8S13 9.8 13 12.4c0 2.7 2.2 4.9 4.9 4.9zm-.1-7.7c.1 0 .1 0 0 0c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.8-2.9 2.8c-1.6 0-2.8-1.3-2.8-2.8c0-1.6 1.3-2.9 2.8-2.9z" />
    <path fill="currentColor" d="M32.7 16.7c-1.9-1.7-4.4-2.6-7-2.5h-.8c-.2.8-.5 1.5-.9 2.1c.6-.1 1.1-.1 1.7-.1c1.9-.1 3.8.5 5.3 1.6V25h2v-8 l-.3-.3z" />
    <path fill="currentColor" d="M23.4 7.8c.5-1.2 1.9-1.8 3.2-1.3c1.2.5 1.8 1.9 1.3 3.2c-.4.9-1.3 1.5-2.2 1.5c-.2 0-.5 0-.7-.1c.1.5.1 1 .1 1.4v.6c.2 0 .4.1.6.1c2.5 0 4.5-2 4.5-4.4c0-2.5-2-4.5-4.4-4.5c-1.6 0-3 .8-3.8 2.2c.5.3 1 .7 1.4 1.3z" />
    <path fill="currentColor" d="M12 16.4c-.4-.6-.7-1.3-.9-2.1h-.8c-2.6-.1-5.1.8-7 2.4L3 17v8h2v-7.2c1.6-1.1 3.4-1.7 5.3-1.6c.6 0 1.2.1 1.7.2z" />
    <path fill="currentColor" d="M10.3 13.1c.2 0 .4 0 .6-.1v-.6c0-.5 0-1 .1-1.4c-.2.1-.5.1-.7.1c-1.3 0-2.4-1.1-2.4-2.4c0-1.3 1.1-2.4 2.4-2.4c1 0 1.9.6 2.3 1.5c.4-.5 1-1 1.5-1.4c-1.3-2.1-4-2.8-61.5c-2.1 1.3-2.8 4-1.5 6.1c.8 1.3 2.2 2.1 3.8 2.1z" />
    <path fill="currentColor" d="m26.1 22.7l-.2-.3c-2-2.2-4.8-3.5-7.8-3.4c-3-.1-5.9 1.2-7.9 3.4l-.2.3v7.6c0 .9.7 1.7 1.7 1.7h12.8c.9 0 1.7-.8 1.7-1.7v-7.6zm-2 7.3H12v-6.6c1.6-1.6 3.8-2.4 6.1-2.4c2.2-.1 4.4.8 6 2.4V30z" />
  </svg>
)

const ExpenditureIcon = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
  >
    <path fill="currentColor" d="M21.6 29a1 1 0 0 0-1-1h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 1-1Z" />
    <path fill="currentColor" d="M22.54 24h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Z" />
    <path fill="currentColor" d="M22 32h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Z" />
    <path fill="currentColor" d="M32.7 32h-7a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2Z" />
    <path fill="currentColor" d="M33.7 28h-7a1 1 0 0 0 0 2h7a1 1 0 0 0 0-2Z" />
    <path fill="currentColor" d="M33.74 26a28 28 0 0 0-2.82-10.12a20.24 20.24 0 0 0-6.32-7.17L27 3.42a1 1 0 0 0-.07-1a1 1 0 0 0-.8-.42H9.8a1 1 0 0 0-.91 1.42l2.45 5.31a20.33 20.33 0 0 0-6.28 7.15c-2.15 4-2.82 8.89-3 12.28a3.6 3.6 0 0 0 1 2.71a3.79 3.79 0 0 0 2.74 1.07H12V30H5.72a1.68 1.68 0 0 1-1.21-.52a1.62 1.62 0 0 1-.45-1.23c.14-2.61.69-7.58 2.76-11.45a18 18 0 0 1 6.26-6.8h1a30.81 30.81 0 0 0-1.87 2.92a22.78 22.78 0 0 0-1.47 3.34l1.37.92a24 24 0 0 1 1.49-3.47A29.1 29.1 0 0 1 16.05 10h1a21.45 21.45 0 0 1 1.41 5a22.54 22.54 0 0 1 .32 3.86l1.58-1.11a24.15 24.15 0 0 0-.32-3A24.82 24.82 0 0 0 18.76 10h.78l.91-2h-7.24l-1.85-4h13.21l-2.5 5.47a9.93 9.93 0 0 1 1.23.78a18.63 18.63 0 0 1 5.86 6.57A26.59 26.59 0 0 1 31.73 26Z" />
  </svg>
)

const IncentivesIcon = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path fill="currentColor" d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z" />
  </svg>
)

const SOPIcon = ({ size = 18, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <g fill="currentColor">
      <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
      <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z" />
    </g>
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

          <SidebarGroup title="Team Board" icon={Users} isOpen={openGroups['Team Board']} onToggle={() => toggleGroup('Team Board')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/team-board/content-specialist" label="Content Specialist" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/editor" label="Editor" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/video-grapher" label="Video Grapher" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/meta-ads" label="Meta Ads" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/team-board/software-developer" label="Software Developer" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Dashboard" icon={DashboardIcon} isOpen={openGroups['Dashboard']} onToggle={() => toggleGroup('Dashboard')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/dashboard/workers" label="Employees" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/dashboard/revenue" label="Revenue" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/dashboard/work-progress" label="Work Progress" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Clients" icon={ClientsIcon} isOpen={openGroups['Clients']} onToggle={() => toggleGroup('Clients')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/clients/details" label="Clients Details" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/clients/works" label="Works" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/clients/enquiries" label="Enquiries" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/clients/payment" label="Payment" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Employee Info" icon={UserRound} isOpen={openGroups['Employees']} onToggle={() => toggleGroup('Employees')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/employee-info/content-specialist" label="Content Specialist" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/editor" label="Editor" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/videographer" label="Video Grapher" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/meta-ads" label="Meta Ads" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/employee-info/software-developer" label="Software Developer" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Expenditure" icon={ExpenditureIcon} isOpen={openGroups['Expenditure']} onToggle={() => toggleGroup('Expenditure')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/expenditure/salary" label="Salary" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/expenditure/expenses" label="Expenses" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          <SidebarGroup title="Hiring" icon={UserPlus} isOpen={openGroups['Hiring']} onToggle={() => toggleGroup('Hiring')} collapsed={collapsed && !mobileOpen}>
            <SidebarItem path="/hiring/interview-process" label="Interview Process" isChild onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </SidebarGroup>

          {/* Standalone items */}
          <div className="mb-6 space-y-1">
            <SidebarItem path="/incentives" icon={IncentivesIcon} label="Incentives" onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/sop" icon={SOPIcon} label="SOP Library" onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
            <SidebarItem path="/settings" icon={Settings} label="Settings" onClick={() => setMobileOpen(false)} collapsed={collapsed && !mobileOpen} />
          </div>

        </nav>
      </aside>
    </>
  )
}
