'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  CreditCard,
  PiggyBank
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { ExpenseChart } from '@/components/charts/ExpenseChart'
import { ProgressRing } from '@/components/charts/ProgressRing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate } from '@/utils/formatters'

// Mock data - in a real app, this would come from your API/database
const mockStats = {
  totalIncome: 85000,
  totalExpenses: 52000,
  netIncome: 33000,
  budgetUtilization: 68.5,
}

const mockExpenseData = [
  { name: 'Food & Dining', value: 12500, color: 'hsl(142, 76%, 36%)' },
  { name: 'Transportation', value: 8500, color: 'hsl(221, 83%, 53%)' },
  { name: 'Shopping', value: 15000, color: 'hsl(262, 83%, 58%)' },
  { name: 'Entertainment', value: 6000, color: 'hsl(38, 92%, 50%)' },
  { name: 'Bills & Utilities', value: 10000, color: 'hsl(0, 84%, 60%)' },
]

const mockGoals = [
  { name: 'Emergency Fund', current: 150000, target: 300000, color: 'hsl(142, 76%, 36%)' },
  { name: 'Vacation', current: 45000, target: 100000, color: 'hsl(221, 83%, 53%)' },
  { name: 'New Car', current: 250000, target: 800000, color: 'hsl(262, 83%, 58%)' },
]

const mockRecentTransactions = [
  { id: '1', description: 'Grocery Shopping', amount: 2500, category: 'Food & Dining', type: 'expense', date: new Date() },
  { id: '2', description: 'Salary Deposit', amount: 75000, category: 'Salary', type: 'income', date: new Date() },
  { id: '3', description: 'Petrol', amount: 3500, category: 'Transportation', type: 'expense', date: new Date() },
]

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Total Income"
            value={mockStats.totalIncome}
            change={12.5}
            changeType="increase"
            icon={TrendingUp}
            color="hsl(142, 76%, 36%)"
          />
          <StatCard
            title="Total Expenses"
            value={mockStats.totalExpenses}
            change={8.2}
            changeType="increase"
            icon={TrendingDown}
            color="hsl(0, 84%, 60%)"
          />
          <StatCard
            title="Net Income"
            value={mockStats.netIncome}
            change={15.3}
            changeType="increase"
            icon={DollarSign}
            color="hsl(221, 83%, 53%)"
          />
          <StatCard
            title="Budget Used"
            value={mockStats.budgetUtilization}
            change={5.1}
            changeType="decrease"
            icon={Target}
            format="percentage"
            color="hsl(262, 83%, 58%)"
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Expense Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ExpenseChart data={mockExpenseData} />
          </motion.div>

          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Savings Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockGoals.map((goal, index) => {
                  const progress = (goal.current / goal.target) * 100
                  return (
                    <motion.div
                      key={goal.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <ProgressRing
                        progress={progress}
                        size={60}
                        strokeWidth={6}
                        color={goal.color}
                      >
                        <span className="text-xs font-medium">
                          {Math.round(progress)}%
                        </span>
                      </ProgressRing>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{goal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm",
                        transaction.type === 'income' ? "bg-success" : "bg-destructive"
                      )}>
                        {transaction.type === 'income' ? '↗' : '↙'}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{transaction.description}</h4>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold",
                        transaction.type === 'income' ? "text-success" : "text-destructive"
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date, 'MMM dd')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
