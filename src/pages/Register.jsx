import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const { authError, clearAuthError, isAuthLoading, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    if (message) setMessage('')
    clearAuthError()
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setMessage('Please complete all fields to create your account.')
      return
    }

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const feedbackMessage = message || authError

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 lg:grid-cols-[0.9fr_1fr]">
        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-500">
            Register
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            Create your smart budget workspace
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Create an account in MongoDB and jump straight into your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label>
              <span className="field-label">Name</span>
              <input
                className="field-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
              />
            </label>

            <label>
              <span className="field-label">Email</span>
              <input
                className="field-input"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </label>

            <label>
              <span className="field-label">Password</span>
              <input
                className="field-input"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </label>

            {feedbackMessage && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
                {feedbackMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isAuthLoading}
              className="rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              {isAuthLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link className="font-black text-indigo-600 dark:text-indigo-300" to="/login">
              Login
            </Link>
          </p>
        </div>

        <div className="hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-950 p-10 text-white lg:block">
          <div className="grid h-full content-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-100">
                Income + Expenses
              </p>
              <h1 className="mt-6 text-5xl font-black leading-tight">
                Build a complete picture of your cash flow.
              </h1>
              <p className="mt-5 text-lg text-white/75">
                Choose your currency, monitor your balance, and keep dark mode enabled everywhere.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="text-3xl">🌍 💳 ✅</p>
              <p className="mt-3 text-sm font-semibold text-white/75">
                Your profile, income, and expenses are stored in smart_spend_ai.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Register