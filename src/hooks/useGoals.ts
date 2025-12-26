'use client'

import { useState, useEffect, useCallback } from 'react'
import { Goal } from '@/types'

const STORAGE_KEY = 'financetrackr_goals'

// Helper to load goals from localStorage
const loadGoalsFromStorage = (userId: string): Goal[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const allGoals = JSON.parse(stored) as Goal[]
      return allGoals
        .filter(g => g.userId === userId)
        .map(g => ({
          ...g,
          targetDate: new Date(g.targetDate),
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt),
        }))
    }
  } catch (err) {
    console.error('Error loading goals from localStorage:', err)
  }
  return []
}

// Helper to save goals to localStorage
const saveGoalsToStorage = (goals: Goal[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  } catch (err) {
    console.error('Error saving goals to localStorage:', err)
  }
}

// Get all goals from storage (for internal use)
const getAllGoalsFromStorage = (): Goal[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Goal[]
    }
  } catch (err) {
    console.error('Error loading all goals from localStorage:', err)
  }
  return []
}

export function useGoals(userId: string | null) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load goals from localStorage on mount
  useEffect(() => {
    if (!userId) {
      setGoals([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    
    // Small delay to simulate loading and ensure client-side execution
    const timer = setTimeout(() => {
      const loadedGoals = loadGoalsFromStorage(userId)
      setGoals(loadedGoals)
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [userId])

  // Save goals to localStorage whenever they change
  const persistGoals = useCallback((updatedGoals: Goal[]) => {
    const allGoals = getAllGoalsFromStorage()
    // Remove current user's goals and add updated ones
    const otherGoals = allGoals.filter(g => g.userId !== userId)
    saveGoalsToStorage([...otherGoals, ...updatedGoals])
  }, [userId])

  const addGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')
    
    const id = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newGoal: Goal = {
      ...goal,
      id,
      userId,
      currentAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const updatedGoals = [newGoal, ...goals]
    setGoals(updatedGoals)
    persistGoals(updatedGoals)
    return id
  }

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, ...updates, updatedAt: new Date() }
        : goal
    )
    setGoals(updatedGoals)
    persistGoals(updatedGoals)
  }

  const deleteGoal = async (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId)
    setGoals(updatedGoals)
    persistGoals(updatedGoals)
  }

  const addToGoal = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId)
    if (!goal) throw new Error('Goal not found')
    
    const newAmount = goal.currentAmount + amount
    const updatedGoals = goals.map(g => 
      g.id === goalId 
        ? { ...g, currentAmount: newAmount, updatedAt: new Date() }
        : g
    )
    setGoals(updatedGoals)
    persistGoals(updatedGoals)
    return newAmount
  }

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    refetch: () => {
      if (userId) {
        const loadedGoals = loadGoalsFromStorage(userId)
        setGoals(loadedGoals)
      }
    }
  }
}
