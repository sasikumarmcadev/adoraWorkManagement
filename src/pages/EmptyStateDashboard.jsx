import PageContainer from '../components/layout/PageContainer'
import { LayoutDashboard } from 'lucide-react'

export default function EmptyStateDashboard() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-gray-50 dark:ring-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-105">
          <LayoutDashboard className="w-10 h-10 text-brand-500" />
        </div>
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Empty State</h2>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm">
          Display today works and work pending by workers
        </p>
      </div>
    </PageContainer>
  )
}

