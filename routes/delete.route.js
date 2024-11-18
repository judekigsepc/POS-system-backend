const express = require('express')
const router = express.Router()

const {deleteProduct,deleteTransaction,deleteUser} = require('../controllers/crud.controller')

router.delete('/product/:id',deleteProduct)
router.delete('/user/:id',deleteUser)
router.delete('/transaction/:id',deleteTransaction)

module.exports = router