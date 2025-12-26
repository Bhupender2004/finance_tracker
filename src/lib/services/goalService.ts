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
import { Goal } from '@/types'

const COLLECTION_NAME = 'goals'

export class GoalService {
  static async createGoal(userId: string, goal: Omit<Goal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...goal,
        userId,
        currentAmount: 0,
        targetDate: Timestamp.fromDate(goal.targetDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating goal:', error)
      throw error
    }
  }

  static async updateGoal(goalId: string, updates: Partial<Goal>) {
    try {
      const docRef = doc(db, COLLECTION_NAME, goalId)
      const updateData: DocumentData = {
        ...updates,
        updatedAt: Timestamp.now(),
      }
      
      if (updates.targetDate) {
        updateData.targetDate = Timestamp.fromDate(updates.targetDate)
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  static async deleteGoal(goalId: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, goalId)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error
    }
  }

  static async getUserGoals(userId: string) {
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
        targetDate: doc.data().targetDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Goal[]
    } catch (error) {
      console.error('Error fetching goals:', error)
      throw error
    }
  }

  static async getActiveGoals(userId: string) {
    try {
      const now = new Date()
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        where('targetDate', '>=', Timestamp.fromDate(now))
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        targetDate: doc.data().targetDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Goal[]
    } catch (error) {
      console.error('Error fetching active goals:', error)
      throw error
    }
  }

  static async updateGoalProgress(goalId: string, currentAmount: number) {
    try {
      const docRef = doc(db, COLLECTION_NAME, goalId)
      await updateDoc(docRef, {
        currentAmount,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating goal progress:', error)
      throw error
    }
  }

  static async addToGoal(goalId: string, amount: number) {
    try {
      // Note: In a real app, you'd want to use a transaction to ensure atomicity
      // This is a simplified version
      const docRef = doc(db, COLLECTION_NAME, goalId)
      const goalDoc = await getDocs(query(collection(db, COLLECTION_NAME), where('__name__', '==', goalId)))
      
      if (!goalDoc.empty) {
        const currentGoal = goalDoc.docs[0].data() as Goal
        const newAmount = currentGoal.currentAmount + amount
        
        await updateDoc(docRef, {
          currentAmount: newAmount,
          updatedAt: Timestamp.now(),
        })
        
        return newAmount
      }
      throw new Error('Goal not found')
    } catch (error) {
      console.error('Error adding to goal:', error)
      throw error
    }
  }
}
