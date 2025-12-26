'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { Budget } from '@/types'
import { DEFAULT_EXPENSE_CATEGORIES } from '@/lib/constants/categories'
import toast from 'react-hot-toast'

const budgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  period: z.enum(['weekly', 'monthly', 'yearly']),
  startDate: z.date(),
  endDate: z.date(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
})

type BudgetFormData = z.infer<typeof budgetSchema>

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<Budget>
  isOpen: boolean
}

export function BudgetForm({ onSubmit, onCancel, initialData, isOpen }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: initialData?.name || '',
      amount: initialData?.amount || 0,
      categoryId: initialData?.category?.id || '',
      period: initialData?.period || 'monthly',
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }
  })

  const selectedPeriod = watch('period')

  const onFormSubmit = async (data: BudgetFormData) => {
    try {
      setIsSubmitting(true)
      const category = DEFAULT_EXPENSE_CATEGORIES.find(c => c.id === data.categoryId)
      if (!category) throw new Error('Invalid category')

      await onSubmit({
        name: data.name,
        amount: data.amount,
        category,
        period: data.period,
        startDate: data.startDate,
        endDate: data.endDate,
      })

      toast.success('Budget saved successfully!')
      reset()
      onCancel()
    } catch (error) {
      toast.error('Failed to save budget')
      console.error('Error saving budget:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePeriodChange = (period: 'weekly' | 'monthly' | 'yearly') => {
    setValue('period', period)
    
    // Auto-adjust end date based on period
    const startDate = watch('startDate')
    if (startDate) {
      let endDate = new Date(startDate)
      switch (period) {
        case 'weekly':
          endDate.setDate(endDate.getDate() + 7)
          break
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1)
          break
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1)
          break
      }
      setValue('endDate', endDate)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{initialData ? 'Edit Budget' : 'Create Budget'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Budget Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.name && "border-destructive"
                  )}
                  placeholder="e.g., Monthly Groceries"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.amount && "border-destructive"
                  )}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  {...register('categoryId')}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.categoryId && "border-destructive"
                  )}
                >
                  <option value="">Select a category</option>
                  {DEFAULT_EXPENSE_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Period */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Period</label>
                <div className="flex space-x-2">
                  {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
                    <Button
                      key={period}
                      type="button"
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      className="flex-1 capitalize"
                      onClick={() => handlePeriodChange(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    {...register('startDate', { valueAsDate: true })}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-primary",
                      errors.startDate && "border-destructive"
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    {...register('endDate', { valueAsDate: true })}
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-primary",
                      errors.endDate && "border-destructive"
                    )}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-destructive">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Budget'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
