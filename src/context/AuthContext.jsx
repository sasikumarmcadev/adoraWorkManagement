import { createContext, useContext, useState, useEffect } from 'react'
import { USERS } from '../lib/data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('adora_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password)
    if (found) {
      setUser(found)
      localStorage.setItem('adora_user', JSON.stringify(found))
      return { success: true }
    }
    return { success: false, error: 'Invalid username or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adora_user')
  }

  const isManager = user?.access === 'Manager'
  const isJeevan = user?.access === 'Jeevan'
  const isWorker = user?.access === 'Worker'
  const canDelete = isManager
  const canEdit = isManager || isJeevan

  const hasAccess = (route) => {
    if (!user) return false
    if (isManager || isJeevan) return true
    // Workers can only access their role page
    const workerAllowed = ['/team-board', `/team-board/${user.role?.toLowerCase().replace(/ /g, '-')}`]
    return workerAllowed.some(r => route.startsWith(r))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isManager, isJeevan, isWorker, canDelete, canEdit, hasAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
