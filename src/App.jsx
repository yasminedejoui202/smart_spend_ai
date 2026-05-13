import { Navigate, Route, Routes } from 'react-router-dom'
import PropTypes from 'prop-types'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { AuthProvider } from './context/AuthContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { ExpenseProvider } from './context/ExpenseContext'
import AddExpense from './pages/AddExpense'
import AddIncome from './pages/AddIncome'
import AIInsights from './pages/AIInsights'
import Dashboard from './pages/Dashboard'
import ExpenseList from './pages/ExpenseList'
import IncomeList from './pages/IncomeList'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/useAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

function AppShell() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/add-income" element={<AddIncome />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/incomes" element={<IncomeList />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ExpenseProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_28rem),linear-gradient(135deg,_#f8fafc,_#eef2ff)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_28rem),linear-gradient(135deg,_#020617,_#0f172a)]">
            <Routes>
              <Route
                path="/login"
                element={(
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                )}
              />
              <Route
                path="/register"
                element={(
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                )}
              />
              <Route
                path="/*"
                element={(
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                )}
              />
            </Routes>
          </div>
        </ExpenseProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App
