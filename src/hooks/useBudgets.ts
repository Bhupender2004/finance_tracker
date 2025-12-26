'use client'

import { useState, useEffect, useCallback } from 'react'
import { Budget } from '@/types'

const STORAGE_KEY = 'financetrackr_budgets'

// Helper to load budgets from localStorage
const loadBudgetsFromStorage = (userId: string): Budget[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const allBudgets = JSON.parse(stored) as Budget[]
      return allBudgets
        .filter(b => b.userId === userId)
        .map(b => ({
          ...b,
          startDate: new Date(b.startDate),
          endDate: new Date(b.endDate),
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
        }))
    }
  } catch (err) {
    console.error('Error loading budgets from localStorage:', err)
  }
  return []
}

// Helper to save budgets to localStorage
const saveBudgetsToStorage = (budgets: Budget[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
  } catch (err) {
    console.error('Error saving budgets to localStorage:', err)
  }
}

// Get all budgets from storage (for internal use)
const getAllBudgetsFromStorage = (): Budget[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Budget[]
    }
  } catch (err) {
    console.error('Error loading all budgets from localStorage:', err)
  }
  return []
}

export function useBudgets(userId: string | null) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load budgets from localStorage on mount
  useEffect(() => {
    if (!userId) {
      setBudgets([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    
    // Small delay to simulate loading and ensure client-side execution
    const timer = setTimeout(() => {
      const loadedBudgets = loadBudgetsFromStorage(userId)
      setBudgets(loadedBudgets)
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [userId])

  // Save budgets to localStorage whenever they change
  const persistBudgets = useCallback((updatedBudgets: Budget[]) => {
    const allBudgets = getAllBudgetsFromStorage()
    // Remove current user's budgets and add updated ones
    const otherBudgets = allBudgets.filter(b => b.userId !== userId)
    saveBudgetsToStorage([...otherBudgets, ...updatedBudgets])
  }, [userId])

  const addBudget = async (budget: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')
    
    const id = `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newBudget: Budget = {
      ...budget,
      id,
      userId,
      spent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const updatedBudgets = [newBudget, ...budgets]
    setBudgets(updatedBudgets)
    persistBudgets(updatedBudgets)
    return id
  }

  const updateBudget = async (budgetId: string, updates: Partial<Budget>) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === budgetId 
        ? { ...budget, ...updates, updatedAt: new Date() }
        : budget
    )
    setBudgets(updatedBudgets)
    persistBudgets(updatedBudgets)
  }

  const deleteBudget = async (budgetId: string) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== budgetId)
    setBudgets(updatedBudgets)
    persistBudgets(updatedBudgets)
  }

  const updateBudgetSpent = async (budgetId: string, spentAmount: number) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === budgetId 
        ? { ...budget, spent: spentAmount, updatedAt: new Date() }
        : budget
    )
    setBudgets(updatedBudgets)
    persistBudgets(updatedBudgets)
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
        const loadedBudgets = loadBudgetsFromStorage(userId)
        setBudgets(loadedBudgets)
      }
    }
  }
}
