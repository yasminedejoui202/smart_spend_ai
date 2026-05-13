import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Add Expense', path: '/add', icon: '➕' },
  { label: 'Add Income', path: '/add-income', icon: '💰' },
  { label: 'Expense List', path: '/expenses', icon: '🧾' },
  { label: 'Income List', path: '/incomes', icon: '📥' },
  { label: 'AI Insights', path: '/insights', icon: '🤖' },
]

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/60 bg-white/70 p-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:block">
      <div className="mb-8 flex items-center gap-3 rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-500 p-4 text-white shadow-soft">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-2xl">
          💸
        </div>
        <div>
          <p className="text-sm font-semibold text-white/75">Workspace</p>
          <p className="text-lg font-black">Personal Budget</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
        <p className="text-sm font-black text-indigo-700 dark:text-indigo-200">
          AI tip
        </p>
        <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-200/80">
          Track small daily purchases. They often reveal the biggest saving opportunities.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar