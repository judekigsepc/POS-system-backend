const express = require('express')
const router = express.Router()

const {getAllProducts,
    getAllTransactions,
    getAllUsers,getSingleProduct,
    getSingleTransaction,
    getSingleUser } = require('../controllers/crud.controller')

router.get('/all-products',getAllProducts)
router.get('/all-transactions',getAllTransactions)
router.get('/all-users',getAllUsers)

router.get('/product/:id',getSingleProduct)
router.get('/transaction/:id',getSingleTransaction)
router.get('/user/:id',getSingleUser)


module.exports = router