'use client'

import { useState, useEffect } from 'react'
import { Budget } from '@/types'
import { BudgetService } from '@/lib/services/budgetService'

export function useBudgets(userId: string | null) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setBudgets([])
      setLoading(false)
      return
    }

    const fetchBudgets = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await BudgetService.getUserBudgets(userId)
        setBudgets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch budgets')
        console.error('Error fetching budgets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBudgets()
  }, [userId])

  const addBudget = async (budget: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')
    
    try {
      const id = await BudgetService.createBudget(userId, budget)
      const newBudget: Budget = {
        ...budget,
        id,
        userId,
        spent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setBudgets(prev => [newBudget, ...prev])
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add budget')
      throw err
    }
  }

  const updateBudget = async (budgetId: string, updates: Partial<Budget>) => {
    try {
      await BudgetService.updateBudget(budgetId, updates)
      setBudgets(prev => 
        prev.map(budget => 
          budget.id === budgetId 
            ? { ...budget, ...updates, updatedAt: new Date() }
            : budget
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget')
      throw err
    }
  }

  const deleteBudget = async (budgetId: string) => {
    try {
      await BudgetService.deleteBudget(budgetId)
      setBudgets(prev => prev.filter(budget => budget.id !== budgetId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget')
      throw err
    }
  }

  const updateBudgetSpent = async (budgetId: string, spentAmount: number) => {
    try {
      await BudgetService.updateBudgetSpent(budgetId, spentAmount)
      setBudgets(prev => 
        prev.map(budget => 
          budget.id === budgetId 
            ? { ...budget, spent: spentAmount, updatedAt: new Date() }
            : budget
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget spent amount')
      throw err
    }
  }

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    updateBudgetSpent,
    refetch: () => {
      if (userId) {
        BudgetService.getUserBudgets(userId).then(setBudgets)
      }
    }
  }
}
