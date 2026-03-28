import { createContext, useContext, useState, useCallback } from 'react'
import {
  CLIENTS, ENQUIRIES, TASKS, PAYMENTS, SALARIES,
  EXPENSES, HIRING, INCENTIVES, SOP_LIBRARY, USERS, ACTIVITY_LOG
} from '../lib/data'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const generateClientID = (currentClients) => {
    const existing = (currentClients || clients || []).filter(c => c.clientID?.startsWith('ADMC'))
    const nums = existing.map(c => parseInt(c.clientID.replace('ADMC', ''))).filter(n => !isNaN(n))
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
    return `ADMC${String(next).padStart(3, '0')}`
  }

  const generateEmployeeID = (email, password) => {
    if (!email || !password) return `ADM-TEMP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4)
    const suffix = password.toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-4)
    return `ADM-${prefix}${suffix}`
  }

  const [clients, setClients] = useState(CLIENTS)
  const [enquiries, setEnquiries] = useState(ENQUIRIES)
  const [tasks, setTasks] = useState(TASKS)
  const [payments, setPayments] = useState(PAYMENTS)
  const [salaries, setSalaries] = useState(SALARIES)
  const [expenses, setExpenses] = useState(EXPENSES)
  const [hiring, setHiring] = useState(HIRING)
  const [incentives, setIncentives] = useState(INCENTIVES)
  const [sopLibrary, setSopLibrary] = useState(SOP_LIBRARY)
  const [workers, setWorkers] = useState(USERS.filter(u => u.access === 'Worker').map((w) => {
    return { ...w, employeeID: w.employeeID || generateEmployeeID(w.username, w.password) }
  }))
  const [activityLog, setActivityLog] = useState(ACTIVITY_LOG)
  const [hideHeader, setHideHeader] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'TechNova payment received ₹45,000', time: '2h ago', read: false },
    { id: 'n2', text: 'Arjun updated task status to In Progress', time: '4h ago', read: false },
    { id: 'n3', text: 'New enquiry: StyleCuts Salon', time: '1d ago', read: true },
  ])

  const addActivity = useCallback((user, action) => {
    const entry = { id: `a${Date.now()}`, user, action, time: new Date().toISOString() }
    setActivityLog(prev => [entry, ...prev])
  }, [])

  // CLIENTS
  const addClient = (client) => {
    const newClient = { ...client, id: `c${Date.now()}`, clientID: client.clientID || generateClientID() }
    setClients(prev => [...prev, newClient])
  }
  const updateClient = (id, data) => setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  const deleteClient = (id) => setClients(prev => prev.filter(c => c.id !== id))

  // ENQUIRIES
  const addEnquiry = (enq) => setEnquiries(prev => [...prev, { ...enq, id: `e${Date.now()}` }])
  const updateEnquiry = (id, data) => {
    setEnquiries(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...data } : e)
      const current = updated.find(e => e.id === id)

      // Auto-Onboard: Move to clients if status is 'Onboard'
      if (current && current.status === 'Onboard') {
        setClients(prevClients => {
          const exists = prevClients.find(c => c.name === current.clientName)
          if (!exists) {
            return [...prevClients, {
              id: `c${Date.now()}`,
              clientID: generateClientID(prevClients),
              name: current.clientName,
              contact: current.phone,
              activeStatus: 'Active',
              paymentStatus: 'Pending',
              joiningDate: new Date().toISOString().split('T')[0],
              status: 'Onboard',
              info: current.notes || 'Onboarded from Enquiry feed.'
            }]
          }
          return prevClients
        })
      }
      return updated
    })
  }
  const deleteEnquiry = (id) => setEnquiries(prev => prev.filter(e => e.id !== id))

  // TASKS
  const addTask = (task) => setTasks(prev => [...prev, { ...task, id: `t${Date.now()}` }])
  const updateTask = (id, data) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  // PAYMENTS
  const addPayment = (p) => setPayments(prev => [...prev, { ...p, id: `p${Date.now()}` }])
  const updatePayment = (id, data) => setPayments(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  const deletePayment = (id) => setPayments(prev => prev.filter(p => p.id !== id))

  // EXPENSES
  const addExpense = (e) => setExpenses(prev => [...prev, { ...e, id: `ex${Date.now()}` }])
  const updateExpense = (id, data) => setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id))

  // HIRING
  const addHiring = (h) => setHiring(prev => [...prev, { ...h, id: `h${Date.now()}` }])
  const updateHiring = (id, data) => setHiring(prev => prev.map(h => h.id === id ? { ...h, ...data } : h))
  const deleteHiring = (id) => setHiring(prev => prev.filter(h => h.id !== id))

  // INCENTIVES
  const addIncentive = (i) => setIncentives(prev => [...prev, { ...i, id: `i${Date.now()}` }])
  const deleteIncentive = (id) => setIncentives(prev => prev.filter(i => i.id !== id))

  // SALARIES
  const addSalary = (s) => setSalaries(prev => [...prev, { ...s, id: `s${Date.now()}` }])
  const updateSalary = (id, data) => setSalaries(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  const deleteSalary = (id) => setSalaries(prev => prev.filter(s => s.id !== id))

  // SOP
  const addSop = (sop) => setSopLibrary(prev => [...prev, { ...sop, id: `sop${Date.now()}` }])
  const updateSop = (id, data) => setSopLibrary(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  const deleteSop = (id) => setSopLibrary(prev => prev.filter(s => s.id !== id))

  // WORKERS (user accounts)
  const addWorker = (w) => setWorkers(prev => {
    const empID = generateEmployeeID(w.username, w.password)
    return [...prev, { ...w, id: `w${Date.now()}`, employeeID: empID }]
  })
  const updateWorker = (id, data) => setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...data } : w))
  const deleteWorker = (id) => setWorkers(prev => prev.filter(w => w.id !== id))

  // NOTIFICATIONS
  const markNotifRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  // Computed stats
  const stats = {
    totalClients: clients.length,
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    totalExpenses: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    totalSalaries: salaries.reduce((sum, s) => sum + (Number(s.amount) || 0) + (Number(s.incentive) || 0), 0),
    totalIncentives: incentives.reduce((sum, i) => sum + (i.amount || 0), 0),
    pendingTasks: tasks.filter(t => t.status !== 'Done').length,
    completedTasks: tasks.filter(t => t.status === 'Done').length,
    totalTasks: tasks.length,
    activeWorkers: workers.length,
    totalEnquiries: enquiries.length,
    todayTasks: tasks.filter(t => new Date(t.updatedDate).toDateString() === new Date().toDateString()).length,
  }
  stats.profit = stats.totalRevenue - stats.totalExpenses - stats.totalSalaries

  return (
    <DataContext.Provider value={{
      clients, addClient, updateClient, deleteClient,
      enquiries, addEnquiry, updateEnquiry, deleteEnquiry,
      tasks, addTask, updateTask, deleteTask,
      payments, addPayment, updatePayment, deletePayment,
      salaries, addSalary, updateSalary, deleteSalary,
      expenses, addExpense, updateExpense, deleteExpense,
      hiring, addHiring, updateHiring, deleteHiring,
      incentives, addIncentive, deleteIncentive,
      sopLibrary, addSop, updateSop, deleteSop,
      workers, addWorker, updateWorker, deleteWorker,
      activityLog, addActivity,
      notifications, markNotifRead, markAllRead,
      hideHeader, setHideHeader,
      desktopCollapsed, setDesktopCollapsed,
      stats,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
