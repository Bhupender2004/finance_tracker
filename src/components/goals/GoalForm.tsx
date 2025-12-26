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
import { Goal } from '@/types'
import toast from 'react-hot-toast'

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  description: z.string().optional(),
  targetAmount: z.number().positive('Target amount must be positive'),
  targetDate: z.date().min(new Date(), 'Target date must be in the future'),
  category: z.string().min(1, 'Category is required'),
  color: z.string().min(1, 'Color is required'),
})

type GoalFormData = z.infer<typeof goalSchema>

interface GoalFormProps {
  onSubmit: (goal: Omit<Goal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<Goal>
  isOpen: boolean
}

const goalCategories = [
  'Emergency Fund',
  'Vacation',
  'New Car',
  'House Down Payment',
  'Education',
  'Retirement',
  'Wedding',
  'Electronics',
  'Home Improvement',
  'Investment',
  'Other'
]

const goalColors = [
  { name: 'Blue', value: 'hsl(221, 83%, 53%)' },
  { name: 'Green', value: 'hsl(142, 76%, 36%)' },
  { name: 'Purple', value: 'hsl(262, 83%, 58%)' },
  { name: 'Orange', value: 'hsl(38, 92%, 50%)' },
  { name: 'Red', value: 'hsl(0, 84%, 60%)' },
  { name: 'Teal', value: 'hsl(195, 100%, 50%)' },
  { name: 'Pink', value: 'hsl(330, 100%, 50%)' },
  { name: 'Indigo', value: 'hsl(262, 90%, 50%)' },
]

export function GoalForm({ onSubmit, onCancel, initialData, isOpen }: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      targetAmount: initialData?.targetAmount || 0,
      targetDate: initialData?.targetDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      category: initialData?.category || '',
      color: initialData?.color || goalColors[0].value,
    }
  })

  const selectedColor = watch('color')

  const onFormSubmit = async (data: GoalFormData) => {
    try {
      setIsSubmitting(true)

      await onSubmit({
        name: data.name,
        description: data.description,
        targetAmount: data.targetAmount,
        targetDate: data.targetDate,
        category: data.category,
        color: data.color,
      })

      toast.success('Goal saved successfully!')
      reset()
      onCancel()
    } catch (error) {
      toast.error('Failed to save goal')
      console.error('Error saving goal:', error)
    } finally {
      setIsSubmitting(false)
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
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{initialData ? 'Edit Goal' : 'Create Goal'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Goal Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.name && "border-destructive"
                  )}
                  placeholder="e.g., Emergency Fund"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg resize-none",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.description && "border-destructive"
                  )}
                  placeholder="Describe your goal..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Target Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('targetAmount', { valueAsNumber: true })}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.targetAmount && "border-destructive"
                  )}
                  placeholder="0.00"
                />
                {errors.targetAmount && (
                  <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
                )}
              </div>

              {/* Target Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date</label>
                <input
                  type="date"
                  {...register('targetDate', { valueAsDate: true })}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.targetDate && "border-destructive"
                  )}
                />
                {errors.targetDate && (
                  <p className="text-sm text-destructive">{errors.targetDate.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  {...register('category')}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.category && "border-destructive"
                  )}
                >
                  <option value="">Select a category</option>
                  {goalCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {goalColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setValue('color', color.value)}
                      className={cn(
                        "w-full h-10 rounded-lg border-2 transition-all",
                        selectedColor === color.value
                          ? "border-foreground scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {selectedColor === color.value && (
                        <span className="text-white font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                {errors.color && (
                  <p className="text-sm text-destructive">{errors.color.message}</p>
                )}
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
                  {isSubmitting ? 'Saving...' : 'Save Goal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
