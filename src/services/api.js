export const API_BASE_URL = 'http://localhost:5000'

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const contentType = response.headers.get('content-type')
    const data = contentType?.includes('application/json')
      ? await response.json().catch(() => null)
      : null

    if (!response.ok) {
      throw new Error(data?.message || `Request failed with status ${response.status}`)
    }

    return data ?? {}
  } catch (error) {
    console.error(`API error on ${endpoint}:`, error)
    throw new Error(error.message || 'Unable to connect to the backend API.')
  }
}

export function registerUser(userData) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export function loginUser(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function addExpense(expenseData) {
  return apiRequest('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  })
}

export function getExpensesByUser(email) {
  return apiRequest(`/api/expenses/${encodeURIComponent(email)}`)
}

export function addIncome(incomeData) {
  return apiRequest('/api/income', {
    method: 'POST',
    body: JSON.stringify(incomeData),
  })
}

export function getIncomeByUser(email) {
  return apiRequest(`/api/income/${encodeURIComponent(email)}`)
}