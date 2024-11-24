const express = require('express')
const router = express.Router()

const {updateProduct,
    updateTransaction} = require('../controllers/crud.controller')

router.put('/product/:id',updateProduct)
router.put('/transaction/:id',updateTransaction)


module.exports = router