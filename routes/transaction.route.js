const express = require('express')
const { getAllTransactions, getSingleTransaction, transactionQueryController } = require('../controllers/defs.controller')
const router = express.Router()

router.get('/', getAllTransactions)
router.get('/:id', getSingleTransaction)
router.get('/:key/:value', transactionQueryController)

module.exports = router