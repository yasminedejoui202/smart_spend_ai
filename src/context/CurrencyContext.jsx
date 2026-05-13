import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CurrencyContext } from './CurrencyContextObject'
import { createCurrencyFormatter, currencyOptions } from '../services/expenseData'

const savedCurrency = localStorage.getItem('smart-spend-currency') || 'USD'

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(savedCurrency)

  const setCurrency = useCallback((nextCurrency) => {
    setCurrencyState(nextCurrency)
    localStorage.setItem('smart-spend-currency', nextCurrency)
  }, [])

  const formatter = useMemo(() => createCurrencyFormatter(currency), [currency])

  const value = useMemo(
    () => ({ currency, currencyOptions, formatter, setCurrency }),
    [currency, formatter, setCurrency],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}