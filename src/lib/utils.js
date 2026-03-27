// Utility to merge Tailwind classes
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatMonth(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

export function getDaysAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export const STATUS_COLORS = {
  'Done': 'status-done',
  'In Progress': 'status-inprogress',
  'Not Started': 'status-notstarted',
  'Declined': 'status-declined',
  'Onboard': 'badge bg-emerald-100/10 text-emerald-500 border border-emerald-500/20',
  'Enquiries': 'badge bg-blue-100/10 text-blue-500 border border-blue-500/20',
  'Profile Check': 'badge bg-purple-100/10 text-purple-500 border border-purple-500/20',
  'Waiting for Response': 'badge bg-amber-100/10 text-amber-500 border border-amber-500/20',
  'Not Interest': 'badge bg-red-100/10 text-red-500 border border-red-500/20',
  'Applied': 'badge bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'Interview': 'badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  'Selected': 'badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'Rejected': 'badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  'Active': 'badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'Inactive': 'badge bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300',
  'Paid': 'badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'Pending': 'badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  'Advance': 'badge bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'Partial': 'badge bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  'Approved': 'badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'Changes Needed': 'badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export function getStatusClass(status) {
  return STATUS_COLORS[status] || 'badge bg-surface-100 text-surface-600'
}
