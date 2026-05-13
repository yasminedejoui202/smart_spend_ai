const Expense = require('../models/Expense')
const Income = require('../models/Income')
const { generateInsights } = require('../services/insightService')

async function getInsightsByEmail(req, res) {
  try {
    const { email } = req.params

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const [expenses, income] = await Promise.all([
      Expense.find({ userEmail: normalizedEmail }).sort({ date: -1 }),
      Income.find({ userEmail: normalizedEmail }).sort({ date: -1 }),
    ])

    const analysis = generateInsights(expenses, income)

    return res.json(analysis)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate insights', error: error.message })
  }
}

module.exports = {
  getInsightsByEmail,
}