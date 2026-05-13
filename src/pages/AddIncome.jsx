import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileNav from '../components/MobileNav'
import { useExpenses } from '../context/useExpenses'
import { incomeCategories } from '../services/expenseData'

const initialFormState = {
  title: '',
  amount: '',
  category: 'Salary',
  date: new Date().toISOString().split('T')[0],
}

function AddIncome() {
  const [formData, setFormData] = useState(initialFormState)
  const [message, setMessage] = useState('')
  const { addIncome, isMutating } = useExpenses()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    if (message) setMessage('')
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.title.trim() || Number(formData.amount) <= 0) {
      setMessage('Please enter a valid title and amount.')
      return
    }

    try {
      await addIncome(formData)
      setFormData(initialFormState)
      setMessage('Income saved successfully.')
      setTimeout(() => navigate('/incomes'), 500)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <MobileNav />
      <section className="page-shell mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-500">
          New income
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Add Income
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Record salary, freelance payments, investments, bonuses, and other income sources.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label>
            <span className="field-label">Title</span>
            <input
              className="field-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Monthly salary"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="field-label">Amount</span>
              <input
                className="field-input"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label>
              <span className="field-label">Category</span>
              <select
                className="field-input"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {incomeCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span className="field-label">Date</span>
            <input
              className="field-input"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </label>

          {message && (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isMutating}
            className="rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
          >
            {isMutating ? 'Saving income...' : 'Save Income'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default AddIncome