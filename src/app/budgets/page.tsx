'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, AlertTriangle } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { BudgetCard } from '@/components/budgets/BudgetCard'
import { BudgetForm } from '@/components/budgets/BudgetForm'
import { StatCard } from '@/components/dashboard/StatCard'
import { Button } from '@/components/ui/Button'
import { useBudgets } from '@/hooks/useBudgets'
import { Budget } from '@/types'
import toast from 'react-hot-toast'

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 'mock-user-123'

export default function BudgetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  
  const { 
    budgets, 
    loading, 
    error, 
    addBudget,  
    deleteBudget 
  } = useBudgets(MOCK_USER_ID)

  const handleAddBudget = async (budgetData: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addBudget(budgetData)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to add budget:', error)
    }
  }

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setIsFormOpen(true)
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId)
        toast.success('Budget deleted successfully')
      } catch {
        toast.error('Failed to delete budget')
      }
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingBudget(null)
  }

  // Calculate stats
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overBudgetCount = budgets.filter(budget => budget.spent > budget.amount).length
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  if (error) {
    return (
      <DashboardLayout title="Budgets">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading budgets: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Budgets">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">Budgets</h2>
            <p className="text-muted-foreground">
              Manage your spending limits and track progress
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Budget</span>
          </Button>
        </motion.div>

        {/* Budget Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <StatCard
            title="Total Budget"
            value={totalBudget}
            icon={TrendingUp}
            color="hsl(221, 83%, 53%)"
          />
          <StatCard
            title="Total Spent"
            value={totalSpent}
            icon={TrendingUp}
            color="hsl(0, 84%, 60%)"
          />
          <StatCard
            title="Budget Utilization"
            value={budgetUtilization}
            format="percentage"
            icon={TrendingUp}
            color="hsl(142, 76%, 36%)"
          />
          <StatCard
            title="Over Budget"
            value={overBudgetCount}
            format="number"
            icon={AlertTriangle}
            color="hsl(38, 92%, 50%)"
          />
        </motion.div>

        {/* Budget Cards */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first budget to start tracking your spending limits and financial goals.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Budget
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {budgets.map((budget, index) => (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <BudgetCard
                  budget={budget}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Budget Form Modal */}
        <BudgetForm
          isOpen={isFormOpen}
          onSubmit={handleAddBudget}
          onCancel={handleFormCancel}
          initialData={editingBudget || undefined}
        />
      </div>
    </DashboardLayout>
  )
}
