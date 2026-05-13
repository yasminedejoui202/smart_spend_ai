import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const { authError, clearAuthError, isAuthLoading, login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    if (message) setMessage('')
    clearAuthError()
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email.trim() || !formData.password.trim()) {
      setMessage('Please enter your email and password.')
      return
    }

    try {
      await login(formData)
      navigate('/dashboard')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const feedbackMessage = message || authError

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-slate-950 via-indigo-900 to-cyan-600 p-10 text-white lg:block">
          <div className="grid h-full content-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-200">
                Smart Spend AI
              </p>
              <h1 className="mt-6 text-5xl font-black leading-tight">
                Welcome back to clearer money decisions.
              </h1>
              <p className="mt-5 text-lg text-white/75">
                Track expenses, income, balance, and AI-ready insights from one responsive dashboard.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
              <p className="text-3xl">📊 💰 🤖</p>
              <p className="mt-3 text-sm font-semibold text-white/75">
                Securely connected to your local MongoDB-backed API.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-500">
            Login
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            Sign in to your dashboard
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Sign in with your registered account to load your MongoDB expense and income records.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
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
                placeholder="••••••••"
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
              className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isAuthLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            New here?{' '}
            <Link className="font-black text-indigo-600 dark:text-indigo-300" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login