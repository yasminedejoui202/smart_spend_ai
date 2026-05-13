import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileNav from '../components/MobileNav'
import { useExpenses } from '../context/useExpenses'
import { categories } from '../services/expenseData'

const initialFormState = {
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().split('T')[0],
}

function AddExpense() {
  const [formData, setFormData] = useState(initialFormState)
  const [message, setMessage] = useState('')
  const { addExpense, isMutating } = useExpenses()
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
      await addExpense(formData)
      setFormData(initialFormState)
      setMessage('Expense saved successfully.')
      setTimeout(() => navigate('/expenses'), 500)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <MobileNav />
      <section className="page-shell mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-500">
          New transaction
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
          Add Expense
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Save an expense to MongoDB and instantly update your dashboard analytics.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label>
            <span className="field-label">Title</span>
            <input
              className="field-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Morning coffee"
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
                {categories.map((category) => (
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
            <p className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isMutating}
            className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {isMutating ? 'Saving expense...' : 'Save Expense'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default AddExpense