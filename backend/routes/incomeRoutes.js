const express = require('express')
const { addIncome, getIncomeByEmail } = require('../controllers/incomeController')

const router = express.Router()

router.post('/', addIncome)
router.get('/:email', getIncomeByEmail)

module.exports = router