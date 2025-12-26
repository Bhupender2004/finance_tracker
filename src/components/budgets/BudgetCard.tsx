'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/charts/ProgressRing'
import { cn } from '@/utils/cn'
import { Budget } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

interface BudgetCardProps {
  budget: Budget
  onEdit?: (budget: Budget) => void
  onDelete?: (budgetId: string) => void
  className?: string
}

export function BudgetCard({ budget, onEdit, onDelete, className }: BudgetCardProps) {
  const progress = (budget.spent / budget.amount) * 100
  const isOverBudget = progress > 100
  const isNearLimit = progress > 80 && progress <= 100

  const getProgressColor = () => {
    if (isOverBudget) return 'hsl(0, 84%, 60%)' // danger
    if (isNearLimit) return 'hsl(38, 92%, 50%)' // warning
    return budget.category.color
  }

  const getRemainingAmount = () => {
    const remaining = budget.amount - budget.spent
    return remaining > 0 ? remaining : 0
  }

  const getOverBudgetAmount = () => {
    return budget.spent > budget.amount ? budget.spent - budget.amount : 0
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
        isOverBudget && "border-destructive",
        isNearLimit && "border-warning"
      )}>
        {/* Alert indicator */}
        {(isOverBudget || isNearLimit) && (
          <div className={cn(
            "absolute top-2 right-2 p-1 rounded-full",
            isOverBudget ? "bg-destructive/20" : "bg-warning/20"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4",
              isOverBudget ? "text-destructive" : "text-warning"
            )} />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <span>{budget.category.icon}</span>
                <span>{budget.name}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {budget.period} budget
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(budget)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(budget.id)}
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
              size={100}
              strokeWidth={8}
              color={getProgressColor()}
            >
              <div className="text-center">
                <div className="text-lg font-bold">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  used
                </div>
              </div>
            </ProgressRing>
          </div>

          {/* Budget Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Spent</span>
              <span className="font-medium">{formatCurrency(budget.spent)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span className="font-medium">{formatCurrency(budget.amount)}</span>
            </div>
            
            {isOverBudget ? (
              <div className="flex justify-between items-center">
                <span className="text-sm text-destructive">Over budget</span>
                <span className="font-medium text-destructive">
                  {formatCurrency(getOverBudgetAmount())}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-medium text-success">
                  {formatCurrency(getRemainingAmount())}
                </span>
              </div>
            )}
          </div>

          {/* Period */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Period</span>
              <span>
                {formatDate(budget.startDate, 'MMM dd')} - {formatDate(budget.endDate, 'MMM dd')}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {isOverBudget && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-3"
            >
              <p className="text-sm text-destructive font-medium">
                You have exceeded your budget by {formatCurrency(getOverBudgetAmount())}
              </p>
            </motion.div>
          )}

          {isNearLimit && !isOverBudget && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning/20 rounded-lg p-3"
            >
              <p className="text-sm text-warning font-medium">
                You are close to your budget limit
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
