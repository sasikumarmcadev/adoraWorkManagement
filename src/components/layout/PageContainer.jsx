export default function PageContainer({ title, subtitle, actions, children }) {
  return (
    <div className="w-full flex flex-col h-full fade-in">
      {(title || subtitle || actions) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {title && <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>}
            {subtitle && <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-3">{actions}</div>}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 lg:p-8 flex-1">
        {children}
      </div>
    </div>
  )
}
