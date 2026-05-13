import { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { AuthContext } from './AuthContextObject'
import { loginUser, registerUser } from '../services/api'

const AUTH_STORAGE_KEY = 'smart-spend-auth-user'

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.warn('Failed to read stored auth session:', error)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

function persistUser(nextUser) {
  if (nextUser) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const login = useCallback(async (credentials) => {
    setIsAuthLoading(true)
    setAuthError('')

    try {
      const data = await loginUser(credentials)
      const authenticatedUser = data?.user

      if (!authenticatedUser?.email) {
        throw new Error('Login succeeded, but the server did not return a valid user.')
      }

      setUser(authenticatedUser)
      persistUser(authenticatedUser)
      return authenticatedUser
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setIsAuthLoading(false)
    }
  }, [])

  const register = useCallback(async (userData) => {
    setIsAuthLoading(true)
    setAuthError('')

    try {
      const data = await registerUser(userData)
      const registeredUser = data?.user

      if (!registeredUser?.email) {
        throw new Error('Registration succeeded, but the server did not return a valid user.')
      }

      setUser(registeredUser)
      persistUser(registeredUser)
      return registeredUser
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setIsAuthLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    persistUser(null)
    setAuthError('')
  }, [])

  const clearAuthError = useCallback(() => {
    setAuthError('')
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      authError,
      login,
      register,
      logout,
      clearAuthError,
    }),
    [user, isAuthLoading, authError, login, register, logout, clearAuthError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
