import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { cn } from '../../lib/utils'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Header
        collapsed={collapsed}
        setMobileOpen={setMobileOpen}
      />
      <main className={cn(
        'transition-all duration-300 pt-14 min-h-screen',
        collapsed ? 'lg:pl-16' : 'lg:pl-60'
      )}>
        <div className="p-5 md:p-7 max-w-screen-2xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
