'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { Transaction, TransactionCategory } from '@/types'
import { ALL_CATEGORIES, getCategoriesByType } from '@/lib/constants/categories'
import toast from 'react-hot-toast'

const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  date: z.date(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  initialData?: Partial<Transaction>
  isOpen: boolean
}

export function TransactionForm({ onSubmit, onCancel, initialData, isOpen }: TransactionFormProps) {
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(initialData?.type || 'expense')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      description: initialData?.description || '',
      categoryId: initialData?.category?.id || '',
      type: selectedType,
      date: initialData?.date || new Date(),
    }
  })

  const categories = getCategoriesByType(selectedType)

  const onFormSubmit = async (data: TransactionFormData) => {
    try {
      setIsSubmitting(true)
      const category = ALL_CATEGORIES.find(c => c.id === data.categoryId)
      if (!category) throw new Error('Invalid category')

      await onSubmit({
        amount: data.amount,
        description: data.description,
        category,
        type: data.type,
        date: data.date,
      })

      toast.success(`${data.type === 'income' ? 'Income' : 'Expense'} added successfully!`)
      reset()
      onCancel()
    } catch (error) {
      toast.error('Failed to save transaction')
      console.error('Error saving transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTypeChange = (type: 'income' | 'expense') => {
    setSelectedType(type)
    setValue('type', type)
    setValue('categoryId', '') // Reset category when type changes
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
            <CardTitle>Add Transaction</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Transaction Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={selectedType === 'expense' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleTypeChange('expense')}
                  >
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={selectedType === 'income' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleTypeChange('income')}
                  >
                    Income
                  </Button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
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

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input
                  type="text"
                  {...register('description')}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.description && "border-destructive"
                  )}
                  placeholder="Enter description..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  {...register('date', { valueAsDate: true })}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.date && "border-destructive"
                  )}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
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
                  {isSubmitting ? 'Saving...' : 'Save Transaction'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
