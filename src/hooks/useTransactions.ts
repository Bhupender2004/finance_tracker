'use client'

import { useState, useEffect } from 'react'
import { Transaction } from '@/types'
import { TransactionService } from '@/lib/services/transactionService'

export function useTransactions(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setTransactions([])
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await TransactionService.getUserTransactions(userId)
        setTransactions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId])

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('User not authenticated')
    
    try {
      const id = await TransactionService.createTransaction(userId, transaction)
      const newTransaction: Transaction = {
        ...transaction,
        id,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTransactions(prev => [newTransaction, ...prev])
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction')
      throw err
    }
  }

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      await TransactionService.updateTransaction(transactionId, updates)
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, ...updates, updatedAt: new Date() }
            : transaction
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction')
      throw err
    }
  }

  const deleteTransaction = async (transactionId: string) => {
    try {
      await TransactionService.deleteTransaction(transactionId)
      setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction')
      throw err
    }
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
        TransactionService.getUserTransactions(userId).then(setTransactions)
      }
    }
  }
}
