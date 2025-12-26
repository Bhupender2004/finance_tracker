import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Transaction } from '@/types'

const COLLECTION_NAME = 'transactions'

export class TransactionService {
  static async createTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...transaction,
        userId,
        date: Timestamp.fromDate(transaction.date),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  }

  static async updateTransaction(transactionId: string, updates: Partial<Transaction>) {
    try {
      const docRef = doc(db, COLLECTION_NAME, transactionId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  }

  static async deleteTransaction(transactionId: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, transactionId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  }

  static async getUserTransactions(userId: string, limitCount = 50) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Transaction[]
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  }

  static async getTransactionsByCategory(userId: string, categoryId: string) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('category.id', '==', categoryId),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Transaction[]
    } catch (error) {
      console.error('Error fetching transactions by category:', error)
      throw error
    }
  }

  static async getTransactionsByDateRange(userId: string, startDate: Date, endDate: Date) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Transaction[]
    } catch (error) {
      console.error('Error fetching transactions by date range:', error)
      throw error
    }
  }
}
