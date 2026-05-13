import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import PropTypes from 'prop-types'
import { Bar, Doughnut } from 'react-chartjs-2'
import { useCurrency } from '../context/useCurrency'
import { categories, categoryStyles, incomeCategories, incomeCategoryStyles } from '../services/expenseData'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

function CategoryChart({ expenses, incomes }) {
  const { formatter } = useCurrency()
  const expenseTotals = categories.map((category) =>
    expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  )

  const incomeTotals = incomeCategories.map((category) =>
    incomes
      .filter((income) => income.category === category)
      .reduce((sum, income) => sum + income.amount, 0),
  )

  const totalExpenses = expenseTotals.reduce((sum, amount) => sum + amount, 0)
  const totalIncome = incomeTotals.reduce((sum, amount) => sum + amount, 0)

  const expenseData = {
    labels: categories,
    datasets: [
      {
        data: expenseTotals,
        backgroundColor: categories.map((category) => categoryStyles[category].color),
        borderColor: 'transparent',
        hoverOffset: 10,
      },
    ],
  }

  const overviewData = {
    labels: ['Income', 'Expenses', 'Balance'],
    datasets: [
      {
        data: [totalIncome, totalExpenses, totalIncome - totalExpenses],
        backgroundColor: ['#22c55e', '#6366f1', totalIncome >= totalExpenses ? '#14b8a6' : '#f43f5e'],
        borderRadius: 14,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${formatter.format(context.parsed)}`,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 18,
          color: '#94a3b8',
          font: {
            family: 'Inter, system-ui, sans-serif',
            weight: '700',
          },
        },
      },
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => formatter.format(context.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            weight: '700',
          },
        },
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
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="h-80">
        <Doughnut data={expenseData} options={options} />
      </div>
      <div className="h-80">
        <Bar data={overviewData} options={barOptions} />
      </div>
    </div>
  )
}

CategoryChart.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
    }),
  ).isRequired,
  incomes: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      category: PropTypes.oneOf(Object.keys(incomeCategoryStyles)).isRequired,
    }),
  ).isRequired,
}

export default CategoryChart