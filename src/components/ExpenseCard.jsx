import PropTypes from 'prop-types'
import { useCurrency } from '../context/useCurrency'
import { categoryStyles, incomeCategoryStyles } from '../services/expenseData'

const fallbackCategoryStyle = {
  icon: '💳',
  bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
}

function ExpenseCard({ expense, type = 'expense' }) {
  const { formatter } = useCurrency()
  const isIncome = type === 'income'
  const category = isIncome
    ? incomeCategoryStyles[expense.category] ?? fallbackCategoryStyle
    : categoryStyles[expense.category] ?? fallbackCategoryStyle

  return (
    <article className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl ${category.bg}`}>
          {category.icon}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-black text-slate-900 dark:text-white">
            {expense.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {expense.category} · {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className={`shrink-0 text-right font-black ${isIncome ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-950 dark:text-white'}`}>
        {isIncome ? '+' : '-'}{formatter.format(expense.amount)}
      </p>
    </article>
  )
}

ExpenseCard.propTypes = {
  expense: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.oneOf(['expense', 'income']),
}

export default ExpenseCard