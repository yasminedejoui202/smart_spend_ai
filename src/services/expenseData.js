export const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
]

export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investments',
  'Bonus',
  'Gift',
  'Other',
]

export const currencyOptions = [
  { code: 'USD', label: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', label: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', label: 'GBP', symbol: '£', locale: 'en-GB' },
]

export function createCurrencyFormatter(currency = 'USD') {
  const option = currencyOptions.find((item) => item.code === currency) ?? currencyOptions[0]

  return new Intl.NumberFormat(option.locale, {
    style: 'currency',
    currency: option.code,
  })
}

export const categoryStyles = {
  Food: {
    icon: '🍜',
    color: '#6366f1',
    bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200',
  },
  Transport: {
    icon: '🚕',
    color: '#06b6d4',
    bg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200',
  },
  Shopping: {
    icon: '🛍️',
    color: '#ec4899',
    bg: 'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200',
  },
  Bills: {
    icon: '💡',
    color: '#f59e0b',
    bg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  },
  Entertainment: {
    icon: '🎬',
    color: '#8b5cf6',
    bg: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200',
  },
  Health: {
    icon: '🩺',
    color: '#10b981',
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
  },
}

export const incomeCategoryStyles = {
  Salary: {
    icon: '💼',
    color: '#22c55e',
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
  },
  Freelance: {
    icon: '🧑‍💻',
    color: '#14b8a6',
    bg: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200',
  },
  Investments: {
    icon: '📈',
    color: '#84cc16',
    bg: 'bg-lime-50 text-lime-700 dark:bg-lime-500/15 dark:text-lime-200',
  },
  Bonus: {
    icon: '🏆',
    color: '#f59e0b',
    bg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
  },
  Gift: {
    icon: '🎁',
    color: '#ec4899',
    bg: 'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200',
  },
  Other: {
    icon: '✨',
    color: '#6366f1',
    bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200',
  },
}