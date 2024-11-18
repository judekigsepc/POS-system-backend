const express = require('express')
const router = express.Router()

const {updateProduct,
    updateTransaction,
    updateUser} = require('../controllers/crud.controller')

router.put('/product/:id',updateProduct)
router.put('/user/:id',updateUser)
router.put('/transaction/:id',updateTransaction)


module.exports = router