const express = require('express')
const router = express.Router()

const {createProduct,createTransaction,createUser} = require('../controllers/crud.controller')

router.post('/user',createUser)
router.post('/product',createProduct)
router.post('/transaction', createTransaction)

module.exports = router