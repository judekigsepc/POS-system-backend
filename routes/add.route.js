const express = require('express')
const router = express.Router()

const {createProduct,createTransaction,createBusinessDetails, createConfiguration} = require('../controllers/crud.controller')

router.post('/product',createProduct)
router.post('/transaction', createTransaction)
router.post('/business',createBusinessDetails)
router.post('/config', createConfiguration)


module.exports = router