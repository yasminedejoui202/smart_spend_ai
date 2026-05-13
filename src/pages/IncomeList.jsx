import { useMemo, useState } from 'react'
import ExpenseCard from '../components/ExpenseCard'
import MobileNav from '../components/MobileNav'
import { useCurrency } from '../context/useCurrency'
import { useExpenses } from '../context/useExpenses'
import { incomeCategories } from '../services/expenseData'

function IncomeList() {
  const { error, incomes, isLoading, refreshTransactions } = useExpenses()
  const { formatter } = useCurrency()
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredIncomes = useMemo(() => {
    if (selectedCategory === 'All') return incomes
    return incomes.filter((income) => income.category === selectedCategory)
  }, [incomes, selectedCategory])

  const filteredTotal = filteredIncomes.reduce(
    (sum, income) => sum + income.amount,
    0,
  )

  return (
    <div className="space-y-6">
      <MobileNav />
      <section className="page-shell">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-500">
              Income
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
              Income List
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Filter income by category and review money coming into your budget.
            </p>
          </div>

          <label className="w-full md:w-64">
            <span className="field-label">Filter by category</span>
            <select
              className="field-input"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {incomeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredIncomes.length} income entries · Total
          </p>
          <p className="mt-1 text-3xl font-black text-emerald-600 dark:text-emerald-300">
            {formatter.format(filteredTotal)}
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {isLoading && (
            <p className="rounded-3xl bg-emerald-50 p-5 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
              Loading income from MongoDB...
            </p>
          )}

          {error && (
            <div className="rounded-3xl bg-rose-50 p-5 text-sm font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
              <p>{error}</p>
              <button
                type="button"
                onClick={refreshTransactions}
                className="mt-3 rounded-full bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-500"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && filteredIncomes.length === 0 && (
            <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              No income found{selectedCategory !== 'All' ? ` for ${selectedCategory}` : ''}. Add income to store it in MongoDB.
            </p>
          )}

          {!isLoading && !error && filteredIncomes.map((income) => (
            <ExpenseCard key={income.id} expense={income} type="income" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default IncomeList