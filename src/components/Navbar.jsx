import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { useCurrency } from '../context/useCurrency'

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { currency, currencyOptions, setCurrency } = useCurrency()
  const { logout, user } = useAuth()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-indigo-500">
            AI Expense Tracker
          </p>
          <h1 className="mt-1 text-xl font-black text-slate-950 dark:text-white sm:text-2xl">
            Smart Spend AI
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="sr-only" htmlFor="currency">Preferred currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm outline-none transition hover:border-indigo-200 focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {currencyOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.symbol} {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsDarkMode((currentMode) => !currentMode)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Signed in</p>
            <p className="text-sm font-black text-slate-950 dark:text-white">{user.name}</p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-600 dark:bg-white dark:text-slate-950 dark:hover:bg-rose-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar