export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  description: string
  category: TransactionCategory
  type: 'income' | 'expense'
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface TransactionCategory {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export interface Budget {
  id: string
  userId: string
  name: string
  amount: number
  spent: number
  category: TransactionCategory
  period: 'weekly' | 'monthly' | 'yearly'
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  id: string
  userId: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  category: string
  color: string
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  budgetUtilization: number
  goalsProgress: number
  monthlyComparison: {
    income: number
    expenses: number
  }
}

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  income: number
  expenses: number
  net: number
}

export type Theme = 'light' | 'dark'

export interface AppSettings {
  theme: Theme
  currency: string
  dateFormat: string
  notifications: {
    budgetAlerts: boolean
    goalReminders: boolean
    weeklyReports: boolean
  }
}
