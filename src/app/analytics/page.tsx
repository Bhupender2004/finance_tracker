'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, PieChart, BarChart3, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ExpenseChart } from '@/components/charts/ExpenseChart'
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart'
import { SpendingTrendsChart } from '@/components/charts/SpendingTrendsChart'
import { StatCard } from '@/components/dashboard/StatCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// Mock data for analytics
const mockTimeSeriesData = [
  { date: 'Jan', income: 75000, expenses: 52000, net: 23000 },
  { date: 'Feb', income: 78000, expenses: 48000, net: 30000 },
  { date: 'Mar', income: 82000, expenses: 55000, net: 27000 },
  { date: 'Apr', income: 80000, expenses: 51000, net: 29000 },
  { date: 'May', income: 85000, expenses: 58000, net: 27000 },
  { date: 'Jun', income: 83000, expenses: 52000, net: 31000 },
]

const mockExpenseData = [
  { name: 'Food & Dining', value: 12500, color: 'hsl(142, 76%, 36%)' },
  { name: 'Transportation', value: 8500, color: 'hsl(221, 83%, 53%)' },
  { name: 'Shopping', value: 15000, color: 'hsl(262, 83%, 58%)' },
  { name: 'Entertainment', value: 6000, color: 'hsl(38, 92%, 50%)' },
  { name: 'Bills & Utilities', value: 10000, color: 'hsl(0, 84%, 60%)' },
]

const timeRanges = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
]

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m')

  // Calculate insights
  const totalIncome = mockTimeSeriesData.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = mockTimeSeriesData.reduce((sum, item) => sum + item.expenses, 0)
  const averageMonthlyIncome = totalIncome / mockTimeSeriesData.length
  const averageMonthlyExpenses = totalExpenses / mockTimeSeriesData.length
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Header with Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">Financial Analytics</h2>
            <p className="text-muted-foreground">
              Analyze your spending patterns and financial trends
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedTimeRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <StatCard
            title="Avg Monthly Income"
            value={averageMonthlyIncome}
            icon={TrendingUp}
            color="hsl(142, 76%, 36%)"
          />
          <StatCard
            title="Avg Monthly Expenses"
            value={averageMonthlyExpenses}
            icon={TrendingUp}
            color="hsl(0, 84%, 60%)"
          />
          <StatCard
            title="Savings Rate"
            value={savingsRate}
            format="percentage"
            icon={PieChart}
            color="hsl(221, 83%, 53%)"
          />
          <StatCard
            title="Net Worth Growth"
            value={15.3}
            format="percentage"
            change={2.1}
            changeType="increase"
            icon={BarChart3}
            color="hsl(262, 83%, 58%)"
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Income vs Expenses Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <IncomeExpenseChart data={mockTimeSeriesData} />
          </motion.div>

          {/* Expense Breakdown Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ExpenseChart data={mockExpenseData} title="Expense Categories" />
          </motion.div>
        </div>

        {/* Spending Trends Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SpendingTrendsChart data={mockTimeSeriesData} />
        </motion.div>

        {/* Insights Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Top Spending Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExpenseData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${category.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {((category.value / mockExpenseData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Health Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Financial Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">85/100</div>
                  <p className="text-sm text-muted-foreground">Excellent financial health</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Savings Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full"
                          style={{ width: `${Math.min(savingsRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{savingsRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Budget Adherence</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-warning rounded-full" />
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Goal Progress</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-3/5 h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
