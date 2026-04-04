import { ChevronDown } from 'lucide-react'

export default function SidebarGroup({ title, children, isOpen, onToggle, collapsed, icon: Icon }) {
  if (!title) return <div className="mb-6 space-y-1">{children}</div>

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center px-4 py-2 group hover:bg-white/5 transition-colors justify-between`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {Icon && <Icon size={16} className="text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" />}
          <div className={`transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <span className="text-[13px] font-medium text-gray-400 tracking-widest group-hover:text-gray-200 transition-colors whitespace-nowrap">
              {title}
            </span>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-500 transition-all duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'} ${collapsed ? 'w-0 h-0 opacity-0 overflow-hidden' : 'block opacity-100'}`}
        />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!collapsed && isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col space-y-0.5">
          {children}
        </div>
      </div>
    </div>
  )
}
