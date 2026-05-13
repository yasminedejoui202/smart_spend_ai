import { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ExpenseContext } from './ExpenseContextObject'
import {
  addExpense as createExpense,
  addIncome as createIncome,
  getExpensesByUser,
  getIncomeByUser,
} from '../services/api'
import { useAuth } from './useAuth'

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
  const [isLoading, setIsLoading] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState('')

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
      return normalizedExpense
    } catch (mutationError) {
      console.error('Failed to add expense:', mutationError)
      setError(mutationError.message)
      throw mutationError
    } finally {
      setIsMutating(false)
    }
  }, [user?.email])

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
      return normalizedIncome
    } catch (mutationError) {
      console.error('Failed to add income:', mutationError)
      setError(mutationError.message)
      throw mutationError
    } finally {
      setIsMutating(false)
    }
  }, [user?.email])

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
      totals,
      isLoading,
      isMutating,
      error,
      addExpense,
      addIncome,
      refreshTransactions: fetchUserTransactions,
      clearError,
    }),
    [expenses, incomes, totals, isLoading, isMutating, error, addExpense, addIncome, fetchUserTransactions, clearError],
  )

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  )
}

ExpenseProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
