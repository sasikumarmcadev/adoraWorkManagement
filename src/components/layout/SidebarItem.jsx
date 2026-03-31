import { NavLink } from 'react-router-dom'

export default function SidebarItem({ label, path, isChild = false, onClick, collapsed, icon: Icon }) {
  if (!isChild) {
    return (
      <NavLink
        to={path}
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={({ isActive }) => `
          flex items-center gap-3 w-full px-5 py-3 text-sm font-medium transition-all
          ${isActive
            ? 'text-black bg-primary border-l-4 border-l-black/20'
            : 'text-gray-400 hover:bg-panel hover:text-white border-l-4 border-transparent'}
        `}
      >
        {Icon && <Icon size={18} className="flex-shrink-0" />}
        <span className={`
          transition-all duration-300 whitespace-nowrap overflow-hidden
          ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}
        `}>
          {label}
        </span>
      </NavLink>
    )
  }

  return (
    <NavLink
      to={path}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) => `
        flex items-center w-full px-5 py-2 text-[13px] font-medium transition-colors
        ${collapsed ? 'opacity-0' : 'pl-9'}
        ${isActive
          ? 'bg-primary text-black font-medium'
          : 'text-gray-400 hover:bg-panel hover:text-white'}
      `}
    >
      <span className={`
        transition-all duration-300 whitespace-nowrap overflow-hidden
        ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}
      `}>
        {label}
      </span>
    </NavLink>
  )
}
