import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import { Lock } from 'lucide-react'

// Layout & Core
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import EmptyStateDashboard from './pages/EmptyStateDashboard'

// Actual Pages available for connecting to sidebar
import TeamBoard from './pages/TeamBoard'
import EditorPage from './pages/EditorPage'
import VideoGrapherPage from './pages/VideoGrapherPage'
import MetaAdsPage from './pages/MetaAdsPage'
import ContentSpecialistPage from './pages/ContentSpecialistPage'
import SoftwareDeveloperPage from './pages/SoftwareDeveloperPage'
import Workers from './pages/Workers'
import ClientsDetails from './pages/ClientsDetails'
import EnquiriesDashboard from './pages/EnquiriesDashboard'
import ClientWorks from './pages/ClientWorks'
import Revenue from './pages/Revenue'
import Salary from './pages/Salary'
import Expenses from './pages/Expenses'
import WorkersInfo from './pages/WorkersInfo'
import ContentSpecialistInfo from './pages/ContentSpecialistInfo'
import EditorInfo from './pages/EditorInfo'
import VideoGrapherInfo from './pages/VideoGrapherInfo'
import SoftwareDeveloperInfo from './pages/SoftwareDeveloperInfo'
import MetaAdsInfo from './pages/MetaAdsInfo'
import PaymentTracking from './pages/PaymentTracking'
import InterviewProcess from './pages/InterviewProcess'
import Incentives from './pages/Incentives'
import SOPLibrary from './pages/SOPLibrary'
import Settings from './pages/Settings'
import WorkProgress from './pages/WorkProgress'

import './index.css'

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.access)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-primary opacity-30">
          <Lock size={64} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)' }}>You don't have permission to view this page.</p>
      </div>
    )
  }
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route element={<Layout />}>
        {/* According to Requirements, Default page should show this component */}
        <Route path="/" element={<WorkProgress />} />

        {/* Team Board */}
        <Route path="/team-board/content-specialist" element={<ContentSpecialistPage />} />
        <Route path="/team-board/editor" element={<EditorPage />} />
        <Route path="/team-board/video-grapher" element={<VideoGrapherPage />} />
        <Route path="/team-board/meta-ads" element={<MetaAdsPage />} />
        <Route path="/team-board/software-developer" element={<SoftwareDeveloperPage />} />

        {/* Dashboard */}
        <Route path="/dashboard/workers" element={<Workers />} />
        <Route path="/dashboard/revenue" element={<Revenue />} />
        <Route path="/dashboard/work-progress" element={<WorkProgress />} />

        {/* Clients */}
        <Route path="/clients/details" element={<ClientsDetails />} />
        <Route path="/clients/works" element={<ClientWorks />} />
        <Route path="/clients/enquiries" element={<EnquiriesDashboard />} />
        <Route path="/clients/payment" element={<PaymentTracking />} />

        {/* Employee Info Section */}
        <Route path="/employee-info/content-specialist" element={<ContentSpecialistInfo />} />
        <Route path="/employee-info/editor" element={<EditorInfo />} />
        <Route path="/employee-info/videographer" element={<VideoGrapherInfo />} />
        <Route path="/employee-info/meta-ads" element={<MetaAdsInfo />} />
        <Route path="/employee-info/software-developer" element={<SoftwareDeveloperInfo />} />

        {/* Expenditure */}
        <Route path="/expenditure/salary" element={<Salary />} />
        <Route path="/expenditure/expenses" element={<Expenses />} />

        {/* Hiring */}
        <Route path="/hiring/interview-process" element={<InterviewProcess />} />

        {/* Standalone Pages mapping back to actual components */}
        <Route path="/incentives" element={<ProtectedRoute allowedRoles={['Manager', 'Jeevan']}><Incentives /></ProtectedRoute>} />
        <Route path="/sop" element={<SOPLibrary />} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['Manager', 'Jeevan']}><Settings /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
