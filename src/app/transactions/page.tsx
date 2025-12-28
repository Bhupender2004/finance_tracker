'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { Button } from '@/components/ui/Button'
import { TrialBanner } from '@/components/ui/TrialBanner'
import { useTransactions } from '@/hooks/useTransactions'
import { useTrialAccess } from '@/hooks/useTrialAccess'
import { Transaction } from '@/types'
import toast from 'react-hot-toast'

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 'mock-user-123'

export default function TransactionsPage() {
  const { canAccess, isLoading: trialLoading, isAuthenticated, remainingUses } = useTrialAccess('transactions')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  
  const { 
    transactions, 
    loading, 
    error, 
    addTransaction,  
    deleteTransaction 
  } = useTransactions(MOCK_USER_ID)

  if (trialLoading) {
    return (
      <DashboardLayout title="Transactions">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!canAccess) {
    return null // Will redirect to login
  }

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTransaction(transactionData)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to add transaction:', error)
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(transactionId)
        toast.success('Transaction deleted successfully')
      } catch {
        toast.error('Failed to delete transaction')
      }
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  if (error) {
    return (
      <DashboardLayout title="Transactions">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading transactions: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Transactions">
      {!isAuthenticated && <TrialBanner remainingUses={remainingUses} feature="Transactions" />}
      <div className="space-y-6">
        {/* Header with Add Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
            <p className="text-muted-foreground">
              Track your income and expenses
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
            <p className="text-2xl font-bold text-success">
              ${transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
            <p className="text-2xl font-bold text-destructive">
              ${transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Net Income</h3>
            <p className="text-2xl font-bold text-foreground">
              ${(transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0) -
                transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
              ).toFixed(2)}
            </p>
          </div>
        </motion.div>

        {/* Transaction List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            loading={loading}
          />
        </motion.div>

        {/* Transaction Form Modal */}
        <TransactionForm
          isOpen={isFormOpen}
          onSubmit={handleAddTransaction}
          onCancel={handleFormCancel}
          initialData={editingTransaction || undefined}
        />
      </div>
    </DashboardLayout>
  )
}
