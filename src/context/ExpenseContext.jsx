import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ExpenseContext } from './ExpenseContextObject'
import {
  addExpense as createExpense,
  addIncome as createIncome,
  getExpensesByUser,
  getInsightsByUser,
  getIncomeByUser,
} from '../services/api'
import { useAuth } from './useAuth'

const emptyAnalytics = {
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  currentMonthIncome: 0,
  currentMonthExpenses: 0,
  currentMonthSavings: 0,
  previousMonthIncome: 0,
  previousMonthExpenses: 0,
  previousMonthSavings: 0,
  expenseTrendPercent: 0,
  savingsTrendPercent: 0,
  topCategory: null,
  categoryTotals: {},
  monthlyTrend: [],
}

function normalizeTransaction(transaction) {
  if (!transaction) {
    throw new Error('The server did not return a valid transaction.')
  }

  return {
    ...transaction,
    id: transaction.id || transaction._id,
    amount: Number(transaction.amount),
    date: transaction.date ? new Date(transaction.date).toISOString() : new Date().toISOString(),
  }
}

function normalizeTransactionList(transactions) {
  return Array.isArray(transactions)
    ? transactions.filter(Boolean).map(normalizeTransaction)
    : []
}

export function ExpenseProvider({ children }) {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [insights, setInsights] = useState([])
  const [analytics, setAnalytics] = useState(emptyAnalytics)
  const [isLoading, setIsLoading] = useState(false)
  const [isInsightsLoading, setIsInsightsLoading] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState('')
  const [insightsError, setInsightsError] = useState('')

  const fetchUserInsights = useCallback(async () => {
    if (!user?.email) {
      setInsights([])
      setAnalytics(emptyAnalytics)
      return
    }

    setIsInsightsLoading(true)
    setInsightsError('')

    try {
      const data = await getInsightsByUser(user.email)
      setInsights(Array.isArray(data?.insights) ? data.insights : [])
      setAnalytics({ ...emptyAnalytics, ...(data?.analytics || {}) })
    } catch (fetchError) {
      console.error('Failed to load AI insights:', fetchError)
      setInsightsError(fetchError.message)
    } finally {
      setIsInsightsLoading(false)
    }
  }, [user?.email])

  const fetchUserTransactions = useCallback(async () => {
    if (!user?.email) {
      setExpenses([])
      setIncomes([])
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const [expenseData, incomeData] = await Promise.all([
        getExpensesByUser(user.email),
        getIncomeByUser(user.email),
      ])

      setExpenses(normalizeTransactionList(expenseData))
      setIncomes(normalizeTransactionList(incomeData))
    } catch (fetchError) {
      console.error('Failed to load user transactions:', fetchError)
      setError(fetchError.message)
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    fetchUserTransactions()
  }, [fetchUserTransactions])

  useEffect(() => {
    fetchUserInsights()
  }, [fetchUserInsights])

  const addExpense = useCallback(async (expense) => {
    if (!user?.email) {
      throw new Error('You must be logged in to add an expense.')
    }

    setIsMutating(true)
    setError('')

    try {
      const payload = {
        ...expense,
        amount: Number(expense.amount),
        userEmail: user.email,
      }
      const data = await createExpense(payload)
      const normalizedExpense = normalizeTransaction(data?.expense)

      setExpenses((currentExpenses) => [normalizedExpense, ...currentExpenses])
      fetchUserInsights()
      return normalizedExpense
    } catch (mutationError) {
      console.error('Failed to add expense:', mutationError)
      setError(mutationError.message)
      throw mutationError
    } finally {
      setIsMutating(false)
    }
  }, [fetchUserInsights, user?.email])

  const addIncome = useCallback(async (income) => {
    if (!user?.email) {
      throw new Error('You must be logged in to add income.')
    }

    setIsMutating(true)
    setError('')

    try {
      const payload = {
        ...income,
        amount: Number(income.amount),
        userEmail: user.email,
      }
      const data = await createIncome(payload)
      const normalizedIncome = normalizeTransaction(data?.income)

      setIncomes((currentIncomes) => [normalizedIncome, ...currentIncomes])
      fetchUserInsights()
      return normalizedIncome
    } catch (mutationError) {
      console.error('Failed to add income:', mutationError)
      setError(mutationError.message)
      throw mutationError
    } finally {
      setIsMutating(false)
    }
  }, [fetchUserInsights, user?.email])

  const totals = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

    return {
      totalExpenses,
      totalIncome,
      balance: totalIncome - totalExpenses,
    }
  }, [expenses, incomes])

  const clearError = useCallback(() => {
    setError('')
  }, [])

  const value = useMemo(
    () => ({
      expenses,
      incomes,
      insights,
      analytics,
      totals,
      isLoading,
      isInsightsLoading,
      isMutating,
      error,
      insightsError,
      addExpense,
      addIncome,
      refreshTransactions: fetchUserTransactions,
      refreshInsights: fetchUserInsights,
      clearError,
    }),
    [expenses, incomes, insights, analytics, totals, isLoading, isInsightsLoading, isMutating, error, insightsError, addExpense, addIncome, fetchUserTransactions, fetchUserInsights, clearError],
  )

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  )
}

ExpenseProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
