import { useState } from 'react'
import CategoryChart from '../components/CategoryChart'
import ExpenseCard from '../components/ExpenseCard'
import MobileNav from '../components/MobileNav'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useCurrency } from '../context/useCurrency'
import { useExpenses } from '../context/useExpenses'
import { categories, categoryStyles } from '../services/expenseData'

function Dashboard() {
  const { error, expenses, incomes, isLoading, refreshTransactions, totals } = useExpenses()
  const { formatter } = useCurrency()
  const [view, setView] = useState('expense')
  const activeTransactions = view === 'expense' ? expenses : incomes
  const recentTransactions = activeTransactions.slice(0, 4)
  const hasTransactions = expenses.length > 0 || incomes.length > 0
  const topCategory = expenses.length > 0 ? categories
    .map((category) => ({
      name: category,
      total: expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .sort((a, b) => b.total - a.total)[0] : { name: 'None', total: 0 }

  return (
    <div className="space-y-6">
      <MobileNav />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-700 p-6 text-white shadow-soft dark:from-indigo-600 dark:to-cyan-500">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/65">
            Current balance
          </p>
          <h2 className="mt-4 text-4xl font-black">
            {formatter.format(totals.balance)}
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Income minus expenses across your current workspace.
          </p>
        </div>

        <div className="page-shell md:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total income" value={formatter.format(totals.totalIncome)} helper={`${incomes.length} income entries`} />
            <StatCard label="Total expenses" value={formatter.format(totals.totalExpenses)} helper={`${expenses.length} expense entries`} />
            <StatCard
              label="Top expense"
              value={topCategory.name}
              helper={formatter.format(topCategory.total)}
            />
          </div>
        </div>
      </section>

      {isLoading && (
        <StatusBanner tone="info" title="Loading your MongoDB records" message="Fetching expenses and income for your account..." />
      )}

      {error && (
        <StatusBanner
          tone="error"
          title="Could not load your transactions"
          message={error}
          actionLabel="Try again"
          onAction={refreshTransactions}
        />
      )}

      {!isLoading && !error && !hasTransactions && (
        <StatusBanner
          tone="empty"
          title="No MongoDB transactions yet"
          message="Add your first income or expense to populate totals, recent activity, and charts."
        />
      )}

      <section className="page-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
            Quick view
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
            Toggle between expense and income activity
          </h2>
        </div>
        <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-950">
          {['expense', 'income'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={`rounded-xl px-5 py-3 text-sm font-black capitalize transition ${
                view === option
                  ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="page-shell">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
                Analytics
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                Financial overview
              </h2>
            </div>
          </div>
          <CategoryChart expenses={expenses} incomes={incomes} />
        </div>

        <div className="page-shell">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
                Activity
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                Recent {view === 'expense' ? 'expenses' : 'income'}
              </h2>
            </div>
            <Link
              to={view === 'expense' ? '/expenses' : '/incomes'}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-950"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <ExpenseCard key={transaction.id} expense={transaction} type={view} />
              ))
            ) : (
              <EmptyState message={`No recent ${view === 'expense' ? 'expenses' : 'income'} found for this account.`} />
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const total = expenses
            .filter((expense) => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0)

          return (
            <div key={category} className="page-shell flex items-center gap-4">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${categoryStyles[category].bg}`}>
                {categoryStyles[category].icon}
              </div>
              <div>
                <p className="font-black text-slate-950 dark:text-white">{category}</p>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {formatter.format(total)} spent
                </p>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  )
}

function StatusBanner({ actionLabel, message, onAction, title, tone }) {
  const styles = {
    info: 'border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200',
    error: 'border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200',
    empty: 'border-slate-100 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
  }

  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${styles[tone]}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-black">{title}</p>
          <p className="mt-1 text-sm font-semibold opacity-80">{message}</p>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-950"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  )
}

function EmptyState({ message }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      {message}
    </div>
  )
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  helper: PropTypes.string.isRequired,
}

StatusBanner.propTypes = {
  actionLabel: PropTypes.string,
  message: PropTypes.string.isRequired,
  onAction: PropTypes.func,
  title: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(['info', 'error', 'empty']).isRequired,
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Dashboard