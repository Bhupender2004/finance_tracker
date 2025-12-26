'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Plus, Target, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/charts/ProgressRing'
import { cn } from '@/utils/cn'
import { Goal } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'
import toast from 'react-hot-toast'

interface GoalCardProps {
  goal: Goal
  onEdit?: (goal: Goal) => void
  onDelete?: (goalId: string) => void
  onAddMoney?: (goalId: string, amount: number) => void
  className?: string
}

export function GoalCard({ goal, onEdit, onDelete, onAddMoney, className }: GoalCardProps) {
  const [isAddingMoney, setIsAddingMoney] = useState(false)
  const [addAmount, setAddAmount] = useState('')

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const isCompleted = progress >= 100
  const remainingAmount = goal.targetAmount - goal.currentAmount
  const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysRemaining < 0

  const handleAddMoney = async () => {
    const amount = parseFloat(addAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      await onAddMoney?.(goal.id, amount)
      setAddAmount('')
      setIsAddingMoney(false)
      toast.success(`Added ${formatCurrency(amount)} to ${goal.name}!`)
      
      // Check if goal is completed after adding money
      if (goal.currentAmount + amount >= goal.targetAmount) {
        toast.success(`🎉 Congratulations! You've reached your goal: ${goal.name}!`, {
          duration: 6000,
        })
      }
    } catch {
      toast.error('Failed to add money to goal')
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className={cn(
        "relative overflow-hidden",
        isCompleted && "border-success bg-success/5",
        isOverdue && !isCompleted && "border-warning bg-warning/5"
      )}>
        {/* Completion celebration effect */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center"
          >
            <Target className="h-4 w-4 text-white" />
          </motion.div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <span>{goal.name}</span>
                {isCompleted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-success"
                  >
                    ✅
                  </motion.span>
                )}
              </CardTitle>
              {goal.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {goal.description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(goal)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(goal.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Ring */}
          <div className="flex items-center justify-center">
            <ProgressRing
              progress={Math.min(progress, 100)}
              size={120}
              strokeWidth={10}
              color={isCompleted ? 'hsl(142, 76%, 36%)' : goal.color}
            >
              <div className="text-center">
                <div className="text-xl font-bold">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  complete
                </div>
              </div>
            </ProgressRing>
          </div>

          {/* Goal Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current</span>
              <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Target</span>
              <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
            </div>
            
            {!isCompleted && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-medium text-primary">
                  {formatCurrency(remainingAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Target Date */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Target Date
              </span>
              <span className={cn(
                isOverdue && !isCompleted ? "text-warning" : "text-foreground"
              )}>
                {formatDate(goal.targetDate)}
              </span>
            </div>
            {!isCompleted && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-muted-foreground">Days remaining</span>
                <span className={cn(
                  isOverdue ? "text-warning" : daysRemaining <= 30 ? "text-warning" : "text-foreground"
                )}>
                  {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                </span>
              </div>
            )}
          </div>

          {/* Add Money Section */}
          {!isCompleted && onAddMoney && (
            <div className="pt-2 border-t border-border">
              {isAddingMoney ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    step="0.01"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    className={cn(
                      "w-full px-3 py-2 text-sm border rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-primary"
                    )}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleAddMoney}
                      className="flex-1"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAddingMoney(false)
                        setAddAmount('')
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingMoney(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Money
                </Button>
              )}
            </div>
          )}

          {/* Status Messages */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-success/10 border border-success/20 rounded-lg p-3"
            >
              <p className="text-sm text-success font-medium text-center">
                🎉 Goal completed! Congratulations!
              </p>
            </motion.div>
          )}

          {isOverdue && !isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning/20 rounded-lg p-3"
            >
              <p className="text-sm text-warning font-medium text-center">
                ⚠️ This goal is overdue
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
