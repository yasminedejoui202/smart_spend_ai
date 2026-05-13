const Expense = require('../models/Expense')

async function addExpense(req, res) {
  try {
    const { title, amount, category, date, userEmail } = req.body

    if (!title || !amount || !category || !date || !userEmail) {
      return res.status(400).json({
        message: 'Title, amount, category, date, and userEmail are required',
      })
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      userEmail,
    })

    return res.status(201).json({
      message: 'Expense added successfully',
      expense,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add expense', error: error.message })
  }
}

async function getExpensesByEmail(req, res) {
  try {
    const { email } = req.params

    const expenses = await Expense.find({ userEmail: email }).sort({ date: -1 })

    return res.json(expenses)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get expenses', error: error.message })
  }
}

module.exports = {
  addExpense,
  getExpensesByEmail,
}