const express = require('express')
const { getInsightsByEmail } = require('../controllers/insightController')

const router = express.Router()

router.get('/:email', getInsightsByEmail)

module.exports = router