const express = require('express')
const router = express.Router()

const {createProduct,createTransaction,createBusinessDetails} = require('../controllers/crud.controller')

router.post('/product',createProduct)
router.post('/transaction', createTransaction)
router.post('/business',createBusinessDetails)


module.exports = router