import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Home', path: '/dashboard', icon: '📊' },
  { label: 'Spend', path: '/add', icon: '➕' },
  { label: 'Earn', path: '/add-income', icon: '💰' },
  { label: 'Expenses', path: '/expenses', icon: '🧾' },
  { label: 'Income', path: '/incomes', icon: '📥' },
  { label: 'AI', path: '/insights', icon: '🤖' },
]

function MobileNav() {
  return (
    <nav className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:hidden">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
            end={link.path === '/dashboard'}
          className={({ isActive }) =>
            `rounded-2xl px-3 py-3 text-center text-xs font-bold transition ${
              isActive
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                : 'bg-white/80 text-slate-600 dark:bg-slate-900/80 dark:text-slate-300'
            }`
          }
        >
          <span className="block text-lg">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav