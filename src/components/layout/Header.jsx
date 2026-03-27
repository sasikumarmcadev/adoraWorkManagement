import { LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
} from '@radix-ui/react-dropdown-menu'

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

export default function Header({ setMobileOpen, sidebarCollapsed, setSidebarCollapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="h-16 flex items-center justify-between px-5 border-b border-border bg-black sticky top-0 z-30">

      <div className="flex items-center gap-4">
        {sidebarCollapsed ? (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="p-1 px-3 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center gap-3 shadow-2xl">
              <img
                src="https://res.cloudinary.com/dhw6yweku/image/upload/v1756276288/l3kbqtpkrsz2lqshmmmj.png"
                alt="Logo"
                className="h-6 w-auto"
              />
              <div className="w-px h-4 bg-white/10" />
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all group"
              >
                <SidebarIcon size={18} className="transition-colors duration-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <SidebarIcon size={20} />
            </button>
            <img
              src="https://res.cloudinary.com/dhw6yweku/image/upload/v1756276288/l3kbqtpkrsz2lqshmmmj.png"
              alt="Logo"
              className="h-5 w-auto lg:hidden"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors outline-none cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-950">
                {user?.avatar || 'AD'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user?.access || 'System'}</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 ml-1 hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-sidebar border border-border rounded-xl shadow-xl mt-2 p-1 z-50 animate-fade-in outline-none">
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{user?.username}</p>
            </div>
            <DropdownMenuItem
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg cursor-pointer outline-none"
            >
              <LogOut size={16} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
