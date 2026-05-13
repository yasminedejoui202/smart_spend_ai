import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import PropTypes from 'prop-types'
import { Bar } from 'react-chartjs-2'
import MobileNav from '../components/MobileNav'
import { useCurrency } from '../context/useCurrency'
import { useExpenses } from '../context/useExpenses'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const insightStyles = {
  positive: {
    icon: '✅',
    label: 'Positive',
    card: 'border-emerald-100 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10',
    badge: 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950',
    text: 'text-emerald-700 dark:text-emerald-200',
  },
  warning: {
    icon: '⚠️',
    label: 'Warning',
    card: 'border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10',
    badge: 'bg-amber-500 text-white dark:bg-amber-300 dark:text-slate-950',
    text: 'text-amber-800 dark:text-amber-100',
  },
  neutral: {
    icon: '💡',
    label: 'Suggestion',
    card: 'border-indigo-100 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10',
    badge: 'bg-indigo-600 text-white dark:bg-indigo-300 dark:text-slate-950',
    text: 'text-indigo-700 dark:text-indigo-100',
  },
}

function AIInsights() {
  const {
    analytics,
    insights,
    insightsError,
    isInsightsLoading,
    refreshInsights,
  } = useExpenses()
  const { formatter } = useCurrency()
  const hasInsights = insights.length > 0
  const health = getFinancialHealth(analytics)
  const monthlyTrend = Array.isArray(analytics.monthlyTrend) ? analytics.monthlyTrend : []

  const trendData = {
    labels: monthlyTrend.map((month) => month.label),
    datasets: [
      {
        label: 'Income',
        data: monthlyTrend.map((month) => month.income),
        backgroundColor: '#22c55e',
        borderRadius: 12,
      },
      {
        label: 'Expenses',
        data: monthlyTrend.map((month) => month.expenses),
        backgroundColor: '#6366f1',
        borderRadius: 12,
      },
    ],
  }

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { weight: '700' } },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatter.format(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { weight: '700' } },
      },
      y: {
        ticks: {
          color: '#94a3b8',
          callback: (value) => formatter.format(value),
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <MobileNav />
      <section className="page-shell overflow-hidden">
        <div className="relative rounded-[2rem] bg-slate-950 p-8 text-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-indigo-950">
          <div className="absolute right-6 top-6 text-6xl opacity-20">🤖</div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
            Smart financial assistant
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black">
            AI Insights powered by your MongoDB data
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Rule-based analysis of your income, expenses, categories, monthly trends, and savings behavior.
          </p>
          <div className={`mt-6 inline-flex rounded-full px-4 py-2 text-sm font-black ${health.className}`}>
            {health.icon} {health.label}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Monthly income" value={formatter.format(analytics.currentMonthIncome)} helper="Current month" />
          <MetricCard label="Monthly expenses" value={formatter.format(analytics.currentMonthExpenses)} helper={`${analytics.expenseTrendPercent}% vs last month`} />
          <MetricCard label="Monthly savings" value={formatter.format(analytics.currentMonthSavings)} helper={`${analytics.savingsTrendPercent}% savings trend`} />
          <MetricCard label="Top category" value={analytics.topCategory?.name || 'None'} helper={analytics.topCategory ? formatter.format(analytics.topCategory.total) : 'No spending yet'} />
        </div>

        {isInsightsLoading && (
          <StatusCard tone="info" title="Generating insights" message="Analyzing your latest income, expenses, categories, and trends..." />
        )}

        {insightsError && (
          <StatusCard
            tone="error"
            title="Unable to load AI insights"
            message={insightsError}
            actionLabel="Retry analysis"
            onAction={refreshInsights}
          />
        )}

        {!isInsightsLoading && !insightsError && !hasInsights && (
          <StatusCard
            tone="empty"
            title="No insights available yet"
            message="Add a few expenses and income entries so Smart Spend AI can detect meaningful patterns."
          />
        )}

        {!insightsError && hasInsights && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {insights.map((insight) => (
              <InsightCard key={`${insight.title}-${insight.message}`} insight={insight} />
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
              Recommendation engine
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              Quick suggestions
            </h3>
            <div className="mt-5 space-y-3">
              {buildSuggestions(analytics).map((suggestion) => (
                <p key={suggestion} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {suggestion}
                </p>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
              Spending trends
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              Income vs expenses
            </h3>
            <div className="mt-5 h-80">
              <Bar data={trendData} options={trendOptions} />
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

function getFinancialHealth(analytics) {
  if (analytics.currentMonthIncome <= 0 && analytics.currentMonthExpenses <= 0) {
    return { icon: '🧭', label: 'Waiting for data', className: 'bg-slate-100 text-slate-700' }
  }

  if (analytics.currentMonthSavings > 0 && analytics.currentMonthExpenses <= analytics.currentMonthIncome * 0.7) {
    return { icon: '💚', label: 'Healthy financial position', className: 'bg-emerald-400 text-slate-950' }
  }

  if (analytics.currentMonthIncome > 0 && analytics.currentMonthExpenses >= analytics.currentMonthIncome * 0.9) {
    return { icon: '⚠️', label: 'Watch spending closely', className: 'bg-amber-300 text-slate-950' }
  }

  return { icon: '📊', label: 'Stable but monitor trends', className: 'bg-indigo-300 text-slate-950' }
}

function buildSuggestions(analytics) {
  const suggestions = []

  if (analytics.topCategory?.name) {
    suggestions.push(`Set a monthly budget for ${analytics.topCategory.name}, your highest spending category.`)
  }

  if (analytics.currentMonthSavings > 0) {
    suggestions.push('Your income covers your expenses. Consider moving part of your savings into a dedicated goal.')
  } else if (analytics.currentMonthExpenses > 0) {
    suggestions.push('Your monthly savings are negative. Reduce optional spending before adding new purchases.')
  }

  if (analytics.expenseTrendPercent > 15) {
    suggestions.push('Expenses are trending upward. Review recent transactions and pause non-essential spending.')
  }

  if (!suggestions.length) {
    suggestions.push('Add more transactions to receive smarter recommendations.')
  }

  return suggestions.slice(0, 3)
}

function MetricCard({ helper, label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  )
}

function InsightCard({ insight }) {
  const style = insightStyles[insight.type] ?? insightStyles.neutral

  return (
    <article className={`rounded-3xl border p-5 shadow-sm ${style.card}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${style.badge}`}>
            {style.icon} {style.label}
          </span>
          <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">
            {insight.title}
          </h3>
        </div>
        {insight.metric && (
          <span className={`rounded-2xl bg-white/70 px-3 py-2 text-sm font-black ${style.text} dark:bg-slate-950/40`}>
            {insight.metric}
          </span>
        )}
      </div>
      <p className={`mt-3 text-sm font-semibold leading-6 ${style.text}`}>
        {insight.message}
      </p>
    </article>
  )
}

function StatusCard({ actionLabel, message, onAction, title, tone }) {
  const styles = {
    info: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200',
    error: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
    empty: 'bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300',
  }

  return (
    <div className={`mt-6 rounded-3xl p-5 ${styles[tone]}`}>
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm font-semibold opacity-80">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-indigo-600 dark:bg-white dark:text-slate-950"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

MetricCard.propTypes = {
  helper: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

InsightCard.propTypes = {
  insight: PropTypes.shape({
    message: PropTypes.string.isRequired,
    metric: PropTypes.string,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['positive', 'warning', 'neutral']).isRequired,
  }).isRequired,
}

StatusCard.propTypes = {
  actionLabel: PropTypes.string,
  message: PropTypes.string.isRequired,
  onAction: PropTypes.func,
  title: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(['info', 'error', 'empty']).isRequired,
}

export default AIInsights