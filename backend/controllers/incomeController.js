const Income = require('../models/Income')

async function addIncome(req, res) {
  try {
    const { title, amount, category, date, userEmail } = req.body

    if (!title || !amount || !category || !date || !userEmail) {
      return res.status(400).json({
        message: 'Title, amount, category, date, and userEmail are required',
      })
    }

    const income = await Income.create({
      title,
      amount,
      category,
      date,
      userEmail,
    })

    return res.status(201).json({
      message: 'Income added successfully',
      income,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add income', error: error.message })
  }
}

async function getIncomeByEmail(req, res) {
  try {
    const { email } = req.params

    const income = await Income.find({ userEmail: email }).sort({ date: -1 })

    return res.json(income)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get income', error: error.message })
  }
}

module.exports = {
  addIncome,
  getIncomeByEmail,
}