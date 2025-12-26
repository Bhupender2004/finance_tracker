import { TransactionCategory } from '@/types'

export const DEFAULT_EXPENSE_CATEGORIES: TransactionCategory[] = [
  {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: '🍽️',
    color: 'hsl(142, 76%, 36%)',
    type: 'expense'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    color: 'hsl(221, 83%, 53%)',
    type: 'expense'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: 'hsl(262, 83%, 58%)',
    type: 'expense'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: 'hsl(38, 92%, 50%)',
    type: 'expense'
  },
  {
    id: 'bills-utilities',
    name: 'Bills & Utilities',
    icon: '⚡',
    color: 'hsl(0, 84%, 60%)',
    type: 'expense'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    color: 'hsl(195, 100%, 50%)',
    type: 'expense'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: 'hsl(45, 100%, 50%)',
    type: 'expense'
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: 'hsl(300, 100%, 50%)',
    type: 'expense'
  },
  {
    id: 'fitness',
    name: 'Fitness & Sports',
    icon: '💪',
    color: 'hsl(120, 100%, 40%)',
    type: 'expense'
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '💄',
    color: 'hsl(330, 100%, 50%)',
    type: 'expense'
  },
  {
    id: 'gifts',
    name: 'Gifts & Donations',
    icon: '🎁',
    color: 'hsl(15, 100%, 50%)',
    type: 'expense'
  },
  {
    id: 'other-expense',
    name: 'Other',
    icon: '📦',
    color: 'hsl(0, 0%, 50%)',
    type: 'expense'
  }
]

export const DEFAULT_INCOME_CATEGORIES: TransactionCategory[] = [
  {
    id: 'salary',
    name: 'Salary',
    icon: '💼',
    color: 'hsl(142, 76%, 36%)',
    type: 'income'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    color: 'hsl(221, 83%, 53%)',
    type: 'income'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '🏢',
    color: 'hsl(262, 83%, 58%)',
    type: 'income'
  },
  {
    id: 'investments',
    name: 'Investments',
    icon: '📈',
    color: 'hsl(38, 92%, 50%)',
    type: 'income'
  },
  {
    id: 'rental',
    name: 'Rental Income',
    icon: '🏠',
    color: 'hsl(195, 100%, 50%)',
    type: 'income'
  },
  {
    id: 'bonus',
    name: 'Bonus',
    icon: '🎉',
    color: 'hsl(45, 100%, 50%)',
    type: 'income'
  },
  {
    id: 'gift-income',
    name: 'Gifts',
    icon: '🎁',
    color: 'hsl(300, 100%, 50%)',
    type: 'income'
  },
  {
    id: 'other-income',
    name: 'Other',
    icon: '💰',
    color: 'hsl(120, 100%, 40%)',
    type: 'income'
  }
]

export const ALL_CATEGORIES = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]

export const getCategoryById = (id: string): TransactionCategory | undefined => {
  return ALL_CATEGORIES.find(category => category.id === id)
}

export const getCategoriesByType = (type: 'income' | 'expense'): TransactionCategory[] => {
  return ALL_CATEGORIES.filter(category => category.type === type)
}
