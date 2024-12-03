const express = require('express')
const router = express.Router()

const {updateProduct,updateTransaction, updateBusinessDetails} = require('../controllers/crud.controller')

router.put('/product/:id',updateProduct)
router.put('/transaction/:id',updateTransaction)
router.put('/business', updateBusinessDetails)


module.exports = router