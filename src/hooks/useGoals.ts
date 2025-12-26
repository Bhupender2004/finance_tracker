'use client'

import { useState, useEffect } from 'react'
import { Goal } from '@/types'
import { GoalService } from '@/lib/services/goalService'

export function useGoals(userId: string | null) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setGoals([])
      setLoading(false)
      return
    }

    const fetchGoals = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await GoalService.getUserGoals(userId)
        setGoals(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch goals')
        console.error('Error fetching goals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGoals()
  }, [userId])

  const addGoal = async (goal: Omit<Goal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')
    
    try {
      const id = await GoalService.createGoal(userId, goal)
      const newGoal: Goal = {
        ...goal,
        id,
        userId,
        currentAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setGoals(prev => [newGoal, ...prev])
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add goal')
      throw err
    }
  }

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      await GoalService.updateGoal(goalId, updates)
      setGoals(prev => 
        prev.map(goal => 
          goal.id === goalId 
            ? { ...goal, ...updates, updatedAt: new Date() }
            : goal
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal')
      throw err
    }
  }

  const deleteGoal = async (goalId: string) => {
    try {
      await GoalService.deleteGoal(goalId)
      setGoals(prev => prev.filter(goal => goal.id !== goalId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete goal')
      throw err
    }
  }

  const addToGoal = async (goalId: string, amount: number) => {
    try {
      const newAmount = await GoalService.addToGoal(goalId, amount)
      setGoals(prev => 
        prev.map(goal => 
          goal.id === goalId 
            ? { ...goal, currentAmount: newAmount, updatedAt: new Date() }
            : goal
        )
      )
      return newAmount
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to goal')
      throw err
    }
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
        GoalService.getUserGoals(userId).then(setGoals)
      }
    }
  }
}
