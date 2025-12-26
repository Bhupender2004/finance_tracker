'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Target, TrendingUp, Calendar, DollarSign } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalForm } from '@/components/goals/GoalForm'
import { StatCard } from '@/components/dashboard/StatCard'
import { Button } from '@/components/ui/Button'
import { useGoals } from '@/hooks/useGoals'
import { Goal } from '@/types'
import toast from 'react-hot-toast'

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 'mock-user-123'

export default function GoalsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  
  const { 
    goals, 
    loading, 
    error, 
    addGoal,
    deleteGoal,
    addToGoal
  } = useGoals(MOCK_USER_ID)

  const handleAddGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addGoal(goalData)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to add goal:', error)
    }
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setIsFormOpen(true)
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(goalId)
        toast.success('Goal deleted successfully')
      } catch {
        toast.error('Failed to delete goal')
      }
    }
  }

  const handleAddMoney = async (goalId: string, amount: number) => {
    try {
      await addToGoal(goalId, amount)
    } catch (error) {
      console.error('Failed to add money to goal:', error)
      throw error
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingGoal(null)
  }

  // Calculate stats
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  if (error) {
    return (
      <DashboardLayout title="Goals">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading goals: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Goals">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">Financial Goals</h2>
            <p className="text-muted-foreground">
              Set and track your savings goals to achieve your dreams
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Goal</span>
          </Button>
        </motion.div>

        {/* Goal Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <StatCard
            title="Total Target"
            value={totalTargetAmount}
            icon={DollarSign}
            color="hsl(221, 83%, 53%)"
          />
          <StatCard
            title="Total Saved"
            value={totalCurrentAmount}
            icon={TrendingUp}
            color="hsl(142, 76%, 36%)"
          />
          <StatCard
            title="Overall Progress"
            value={overallProgress}
            format="percentage"
            icon={Target}
            color="hsl(262, 83%, 58%)"
          />
          <StatCard
            title="Completed Goals"
            value={completedGoals}
            format="number"
            icon={Calendar}
            color="hsl(38, 92%, 50%)"
          />
        </motion.div>

        {/* Goal Cards */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-80"></div>
              </div>
            ))}
          </div>
        ) : goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first financial goal to start saving for what matters most to you.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
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
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GoalCard
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onAddMoney={handleAddMoney}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Goal Form Modal */}
        <GoalForm
          isOpen={isFormOpen}
          onSubmit={handleAddGoal}
          onCancel={handleFormCancel}
          initialData={editingGoal || undefined}
        />
      </div>
    </DashboardLayout>
  )
}
