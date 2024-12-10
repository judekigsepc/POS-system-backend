const express = require('express')
const { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct } = require('../controllers/product.controller')
const router = express.Router()

router.get('/',getAllProducts) 
router.get('/:id',getSingleProduct)
router.post('/',createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router