const express = require('express')
const { addExpense, getExpensesByEmail } = require('../controllers/expenseController')

const router = express.Router()

router.post('/', addExpense)
router.get('/:email', getExpensesByEmail)

module.exports = router