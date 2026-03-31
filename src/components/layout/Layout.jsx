import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useData } from '../../context/DataContext'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { hideHeader, desktopCollapsed, setDesktopCollapsed } = useData()

  return (
    <div className="min-h-screen flex font-sans transition-colors duration-200">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={desktopCollapsed}
        setCollapsed={setDesktopCollapsed}
      />

      <div className={`
        flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300
        ${desktopCollapsed ? 'lg:pl-0' : 'lg:pl-64'}
      `}>
        {!hideHeader && <Header setMobileOpen={setMobileOpen} sidebarCollapsed={desktopCollapsed} setSidebarCollapsed={setDesktopCollapsed} />}
        <main className={`flex-1 w-full overflow-x-hidden animate-fade-in ${hideHeader ? 'h-screen' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
