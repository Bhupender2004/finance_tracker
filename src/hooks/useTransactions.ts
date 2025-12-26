'use client'

import { useState, useEffect, useCallback } from 'react'
import { Transaction } from '@/types'

const STORAGE_KEY = 'financetrackr_transactions'

// Helper to load transactions from localStorage
const loadTransactionsFromStorage = (userId: string): Transaction[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const allTransactions = JSON.parse(stored) as Transaction[]
      return allTransactions
        .filter(t => t.userId === userId)
        .map(t => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  } catch (err) {
    console.error('Error loading transactions from localStorage:', err)
  }
  return []
}

// Helper to save transactions to localStorage
const saveTransactionsToStorage = (transactions: Transaction[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch (err) {
    console.error('Error saving transactions to localStorage:', err)
  }
}

// Get all transactions from storage (for internal use)
const getAllTransactionsFromStorage = (): Transaction[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Transaction[]
    }
  } catch (err) {
    console.error('Error loading all transactions from localStorage:', err)
  }
  return []
}

export function useTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load transactions from localStorage on mount
  useEffect(() => {
    if (!userId) {
      setTransactions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    
    // Small delay to simulate loading and ensure client-side execution
    const timer = setTimeout(() => {
      const loadedTransactions = loadTransactionsFromStorage(userId)
      setTransactions(loadedTransactions)
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [userId])

  // Save transactions to localStorage whenever they change
  const persistTransactions = useCallback((updatedTransactions: Transaction[]) => {
    const allTransactions = getAllTransactionsFromStorage()
    // Remove current user's transactions and add updated ones
    const otherTransactions = allTransactions.filter(t => t.userId !== userId)
    saveTransactionsToStorage([...otherTransactions, ...updatedTransactions])
  }, [userId])

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')
    
    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newTransaction: Transaction = {
      ...transaction,
      id,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    persistTransactions(updatedTransactions)
    return id
  }

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === transactionId 
        ? { ...transaction, ...updates, updatedAt: new Date() }
        : transaction
    )
    setTransactions(updatedTransactions)
    persistTransactions(updatedTransactions)
  }

  const deleteTransaction = async (transactionId: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId)
    setTransactions(updatedTransactions)
    persistTransactions(updatedTransactions)
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: () => {
      if (userId) {
        const loadedTransactions = loadTransactionsFromStorage(userId)
        setTransactions(loadedTransactions)
      }
    }
  }
}
