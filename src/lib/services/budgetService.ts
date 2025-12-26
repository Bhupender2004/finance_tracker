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
  Timestamp,
  DocumentData
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Budget } from '@/types'

const COLLECTION_NAME = 'budgets'

export class BudgetService {
  static async createBudget(userId: string, budget: Omit<Budget, 'id' | 'userId' | 'spent' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...budget,
        userId,
        spent: 0,
        startDate: Timestamp.fromDate(budget.startDate),
        endDate: Timestamp.fromDate(budget.endDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating budget:', error)
      throw error
    }
  }

  static async updateBudget(budgetId: string, updates: Partial<Budget>) {
    try {
      const docRef = doc(db, COLLECTION_NAME, budgetId)
      const updateData: DocumentData = {
        ...updates,
        updatedAt: Timestamp.now(),
      }
      
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate)
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate)
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating budget:', error)
      throw error
    }
  }

  static async deleteBudget(budgetId: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, budgetId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting budget:', error)
      throw error
    }
  }

  static async getUserBudgets(userId: string) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Budget[]
    } catch (error) {
      console.error('Error fetching budgets:', error)
      throw error
    }
  }

  static async getActiveBudgets(userId: string) {
    try {
      const now = new Date()
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('startDate', '<=', Timestamp.fromDate(now)),
        where('endDate', '>=', Timestamp.fromDate(now))
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Budget[]
    } catch (error) {
      console.error('Error fetching active budgets:', error)
      throw error
    }
  }

  static async updateBudgetSpent(budgetId: string, spentAmount: number) {
    try {
      const docRef = doc(db, COLLECTION_NAME, budgetId)
      await updateDoc(docRef, {
        spent: spentAmount,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating budget spent amount:', error)
      throw error
    }
  }
}
